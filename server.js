import "dotenv/config";
import express from "express";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import rateLimit from "express-rate-limit";
import session from "express-session";
import MongoStore from "connect-mongo";
import bcrypt from "bcryptjs";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { GridFSBucket, MongoClient } from "mongodb";

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.join(root, "data");
const contentFile = path.join(dataDirectory, "site-content.json");
const defaultContentFile = path.join(dataDirectory, "default-content.json");
const engagementFile = path.join(dataDirectory, "engagement.json");
const uploadsDirectory = path.join(root, "public", "uploads");
const port = Number(process.env.PORT) || 3000;
const productionMode = process.env.NODE_ENV === "production" || process.argv.includes("--production");
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || "";
const sessionSecret = process.env.SESSION_SECRET || "";
const mongoUri = process.env.MONGODB_URI || "";
const mongoDatabaseName = process.env.MONGODB_DB || undefined;
const maxImageSize = 25 * 1024 * 1024;
const defaultWhatsAppNumber = "+2348107346036";
const app = express();
const mongoClient = mongoUri ? new MongoClient(mongoUri) : null;
let database;
let uploadBucket;
let writeQueue = Promise.resolve();

if (adminPasswordHash && !/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(adminPasswordHash)) {
  throw new Error("ADMIN_PASSWORD_HASH must be a bcrypt hash.");
}
if (adminPasswordHash && !sessionSecret) {
  throw new Error("Set SESSION_SECRET when configuring ADMIN_PASSWORD_HASH.");
}
if (sessionSecret && Buffer.byteLength(sessionSecret) < 32) {
  throw new Error("SESSION_SECRET must contain at least 32 bytes.");
}
if (productionMode && (!adminPasswordHash || !sessionSecret || !mongoUri)) {
  throw new Error("Production requires ADMIN_PASSWORD_HASH, SESSION_SECRET, and MONGODB_URI.");
}

app.disable("x-powered-by");
app.set("trust proxy", productionMode ? 1 : false);
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
if (productionMode) {
  app.use((request, response, next) => {
    if (!request.secure) {
      response.status(400).send("HTTPS is required.");
      return;
    }
    next();
  });
}
app.use(express.json({ limit: "2mb" }));

const publicInteractionLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 150,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
const commentLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
const uploadLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 40,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxImageSize, files: 1 },
});
const galleryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024, files: 1 },
});
const imageTypes = {
  "image/jpeg": { extension: ".jpg", signature: (buffer) => buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff },
  "image/png": { extension: ".png", signature: (buffer) => buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  "image/webp": { extension: ".webp", signature: (buffer) => buffer.length > 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP" },
};
const videoTypes = {
  "video/mp4": { extension: ".mp4", signature: (buffer) => buffer.length > 12 && buffer.toString("ascii", 4, 8) === "ftyp" },
  "video/webm": { extension: ".webm", signature: (buffer) => buffer.length > 4 && buffer.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3])) },
};

function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function projectSlug(title) {
  return title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "project";
}

function isProjectId(value) {
  return typeof value === "string" && /^[a-z0-9-]{1,60}$/i.test(value);
}

function assignProjectIds(content) {
  if (typeof content.whatsappNumber !== "string" || !content.whatsappNumber.trim()) {
    content.whatsappNumber = defaultWhatsAppNumber;
  }
  if (!Array.isArray(content.testimonials)) content.testimonials = [];
  const seen = new Set();
  content.projects = content.projects.map((project, index) => {
    const baseId = isProjectId(project.id) ? project.id : projectSlug(project.title);
    let id = baseId;
    let suffix = index + 1;
    while (seen.has(id)) id = `${baseId}-${suffix++}`;
    seen.add(id);
    return { ...project, id };
  });
  return content;
}

async function writeJsonAtomically(filePath, value) {
  const save = async () => {
    await fs.mkdir(dataDirectory, { recursive: true });
    const temporaryFile = `${filePath}.${randomUUID()}.tmp`;
    await fs.writeFile(temporaryFile, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    await fs.rename(temporaryFile, filePath);
  };
  const currentWrite = writeQueue.then(save);
  writeQueue = currentWrite.catch(() => {});
  await currentWrite;
}

async function readFileContent() {
  try {
    return assignProjectIds(JSON.parse(await fs.readFile(contentFile, "utf8")));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return assignProjectIds(JSON.parse(await fs.readFile(defaultContentFile, "utf8")));
  }
}

async function readContent() {
  if (!database) return readFileContent();
  const saved = await database.collection("site").findOne({ _id: "main" });
  if (saved) return assignProjectIds(saved.content);
  const initial = await readFileContent();
  try {
    await database.collection("site").updateOne(
      { _id: "main" },
      { $setOnInsert: { content: initial, updatedAt: new Date() } },
      { upsert: true },
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
  }
  const migrated = await database.collection("site").findOne({ _id: "main" });
  return assignProjectIds(migrated.content);
}

async function saveContent(content) {
  if (database) {
    await database.collection("site").replaceOne(
      { _id: "main" },
      { _id: "main", content, updatedAt: new Date() },
      { upsert: true },
    );
    return;
  }
  await writeJsonAtomically(contentFile, content);
}

async function readEngagement() {
  try {
    return JSON.parse(await fs.readFile(engagementFile, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return {};
  }
}

async function mutateFileEngagement(mutator) {
  let result;
  const currentWrite = writeQueue.then(async () => {
    const data = await readEngagement();
    result = await mutator(data);
    await fs.mkdir(dataDirectory, { recursive: true });
    const temporaryFile = `${engagementFile}.${randomUUID()}.tmp`;
    await fs.writeFile(temporaryFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    await fs.rename(temporaryFile, engagementFile);
  });
  writeQueue = currentWrite.catch(() => {});
  await currentWrite;
  return result;
}

function engagementFor(data, projectId, visitorId) {
  const project = data[projectId] || { viewers: [], likedBy: [], comments: [] };
  return {
    views: project.viewers.length,
    likes: project.likedBy.length,
    likedByMe: project.likedBy.includes(visitorId),
    comments: project.comments.slice(-100),
  };
}

async function getEngagement(projectId, visitorId) {
  if (!database) return engagementFor(await readEngagement(), projectId, visitorId);
  const [views, likes, liked, comments] = await Promise.all([
    database.collection("views").countDocuments({ projectId }),
    database.collection("likes").countDocuments({ projectId }),
    database.collection("likes").findOne({ projectId, visitorId }),
    database.collection("comments").find({ projectId }).sort({ createdAt: -1 }).limit(100).toArray(),
  ]);
  return { views, likes, likedByMe: Boolean(liked), comments: comments.reverse() };
}

async function recordView(projectId, visitorId) {
  if (database) {
    try {
      await database.collection("views").updateOne(
        { projectId, visitorId },
        { $setOnInsert: { projectId, visitorId, createdAt: new Date() } },
        { upsert: true },
      );
    } catch (error) {
      if (error.code !== 11000) throw error;
    }
    return getEngagement(projectId, visitorId);
  }
  await mutateFileEngagement((data) => {
    const project = data[projectId] ||= { viewers: [], likedBy: [], comments: [] };
    if (!project.viewers.includes(visitorId)) project.viewers.push(visitorId);
  });
  return getEngagement(projectId, visitorId);
}

async function toggleProjectLike(projectId, visitorId) {
  if (database) {
    const likes = database.collection("likes");
    const existing = await likes.findOne({ projectId, visitorId });
    if (existing) await likes.deleteOne({ _id: existing._id });
    else {
      try {
        await likes.insertOne({ projectId, visitorId, createdAt: new Date() });
      } catch (error) {
        if (error.code !== 11000) throw error;
      }
    }
    return getEngagement(projectId, visitorId);
  }
  await mutateFileEngagement((data) => {
    const project = data[projectId] ||= { viewers: [], likedBy: [], comments: [] };
    if (project.likedBy.includes(visitorId)) project.likedBy = project.likedBy.filter((id) => id !== visitorId);
    else project.likedBy.push(visitorId);
  });
  return getEngagement(projectId, visitorId);
}

async function addComment(projectId, comment) {
  if (database) {
    await database.collection("comments").insertOne(comment);
    return;
  }
  await mutateFileEngagement((data) => {
    const project = data[projectId] ||= { viewers: [], likedBy: [], comments: [] };
    project.comments.push(comment);
    project.comments = project.comments.slice(-500);
  });
}

async function listComments() {
  if (database) return database.collection("comments").find().sort({ createdAt: -1 }).limit(1000).toArray();
  const [content, engagement] = await Promise.all([readContent(), readEngagement()]);
  const projectNames = new Map(content.projects.map((project) => [project.id, project.title]));
  return Object.entries(engagement).flatMap(([projectId, project]) =>
    (project.comments || []).map((comment) => ({ ...comment, projectId, projectTitle: projectNames.get(projectId) || "Removed project" })),
  ).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 1000);
}

async function removeComment(projectId, commentId) {
  if (database) {
    const result = await database.collection("comments").deleteOne({ id: commentId, projectId });
    return result.deletedCount > 0;
  }
  return mutateFileEngagement((data) => {
    const project = data[projectId];
    if (!project) return false;
    const initialCount = project.comments.length;
    project.comments = project.comments.filter((comment) => comment.id !== commentId);
    return project.comments.length < initialCount;
  });
}

function isValidContent(value) {
  const textFields = [
    "eyebrow",
    "headlineLineOne",
    "headlineLineTwo",
    "headlineEmphasis",
    "headlineLineThree",
    "intro",
    "email",
  ];
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  if (!textFields.every((field) => typeof value[field] === "string")) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) || value.email.length > 120) return false;
  const whatsappDigits = typeof value.whatsappNumber === "string" ? value.whatsappNumber.replace(/\D/g, "") : "";
  if (!whatsappDigits || whatsappDigits.length < 8 || whatsappDigits.length > 15 || value.whatsappNumber.length > 24) return false;
  if (textFields.some((field) => value[field].length > 300)) return false;
  if (!Array.isArray(value.services) || value.services.length > 50) return false;
  if (!value.services.every((service) => typeof service === "string" && service.length <= 100)) return false;
  if (!Array.isArray(value.testimonials) || value.testimonials.length > 20) return false;
  if (!value.testimonials.every((testimonial) =>
    testimonial &&
    (testimonial.id === undefined || isUuid(testimonial.id)) &&
    typeof testimonial.quote === "string" && testimonial.quote.length <= 800 &&
    typeof testimonial.name === "string" && testimonial.name.length <= 80 &&
    typeof testimonial.role === "string" && testimonial.role.length <= 100 &&
    typeof testimonial.project === "string" && testimonial.project.length <= 100
  )) return false;
  if (!Array.isArray(value.projects) || value.projects.length > 50) return false;
  return value.projects.every((project) =>
    project &&
    (project.id === undefined || isProjectId(project.id)) &&
    typeof project.title === "string" && project.title.length <= 80 &&
    typeof project.category === "string" && project.category.length <= 100 &&
    typeof project.year === "string" && project.year.length <= 8 &&
    typeof project.image === "string" && project.image.length <= 1000 &&
    (project.image === "" || /^https:\/\//i.test(project.image) || /^\/uploads\/[a-f0-9-]+\.(?:jpg|png|webp)$/i.test(project.image)) &&
    (project.media === undefined || (
      Array.isArray(project.media) &&
      project.media.length <= 30 &&
      project.media.every((item) =>
        item &&
        (item.type === "image" || item.type === "video") &&
        typeof item.url === "string" &&
        item.url.length <= 1000 &&
        (/^https:\/\//i.test(item.url) || (
          item.type === "image"
            ? /^\/uploads\/[a-f0-9-]+\.(?:jpg|png|webp)$/i.test(item.url)
            : /^\/uploads\/[a-f0-9-]+\.(?:mp4|webm)$/i.test(item.url)
        ))
      )
    ))
  );
}

function ensureVisitor(request, response, next) {
  const visitorId = request.signedCookies.visitorId;
  if (isUuid(visitorId)) {
    request.visitorId = visitorId;
    next();
    return;
  }
  const id = randomUUID();
  response.cookie("visitorId", id, {
    signed: true,
    httpOnly: true,
    sameSite: "lax",
    secure: productionMode,
    maxAge: 365 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  request.visitorId = id;
  next();
}

function requireSameOrigin(request, response, next) {
  const origin = request.get("origin");
  const expectedOrigin = `${request.protocol}://${request.get("host")}`;
  let actualOrigin = "";
  try {
    actualOrigin = new URL(origin).origin;
  } catch {
    actualOrigin = "";
  }
  if (!origin || actualOrigin !== expectedOrigin) {
    response.status(403).json({ error: "A same-origin Origin header is required for this request." });
    return;
  }
  next();
}

function requireAdmin(request, response, next) {
  if (!adminPasswordHash) {
    response.status(503).json({ error: "Admin access is not configured. Set ADMIN_PASSWORD_HASH and SESSION_SECRET in the server environment." });
    return;
  }
  if (request.session?.isAdmin !== true) {
    response.status(401).json({ error: "Please sign in to manage the studio." });
    return;
  }
  next();
}

function asyncRoute(handler) {
  return (request, response, next) => Promise.resolve(handler(request, response, next)).catch(next);
}

async function start() {
  if (mongoClient) {
    await mongoClient.connect();
    database = mongoClient.db(mongoDatabaseName);
    uploadBucket = new GridFSBucket(database, { bucketName: "portfolio_images" });
    await Promise.all([
      database.collection("views").createIndex({ projectId: 1, visitorId: 1 }, { unique: true }),
      database.collection("likes").createIndex({ projectId: 1, visitorId: 1 }, { unique: true }),
      database.collection("comments").createIndex({ projectId: 1, createdAt: -1 }),
    ]);
    console.log(`Connected to MongoDB database "${database.databaseName}".`);
  } else {
    console.warn("MONGODB_URI is not set; using local JSON files for development data.");
  }

  app.use(cookieParser(sessionSecret || randomUUID()));
  app.use(session({
    name: "miralex.sid",
    secret: sessionSecret || randomUUID(),
    store: database
      ? MongoStore.create({
          client: mongoClient,
          dbName: database.databaseName,
          collectionName: "admin_sessions",
          ttl: 2 * 60 * 60,
          autoRemove: "native",
        })
      : undefined,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: "strict",
      secure: productionMode,
      maxAge: 2 * 60 * 60 * 1000,
      path: "/",
    },
  }));
  app.use("/api", ensureVisitor);
  app.use("/uploads", express.static(uploadsDirectory, {
    dotfiles: "deny",
    index: false,
    maxAge: "1y",
    immutable: true,
  }));

  app.get("/uploads/:filename", asyncRoute(async (request, response, next) => {
    if (!uploadBucket || !/^[a-f0-9-]+\.(?:jpg|png|webp|mp4|webm)$/i.test(request.params.filename)) {
      next();
      return;
    }
    const file = await database.collection("portfolio_images.files")
      .find({ filename: request.params.filename })
      .sort({ uploadDate: -1 })
      .limit(1)
      .next();
    if (!file) {
      next();
      return;
    }
    const range = request.get("range");
    let start = 0;
    let end = file.length - 1;
    let status = 200;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match || (!match[1] && !match[2])) {
        response.status(416).set("Content-Range", `bytes */${file.length}`).end();
        return;
      }
      if (!match[1]) {
        const suffixLength = Number(match[2]);
        start = Math.max(file.length - suffixLength, 0);
      } else {
        start = Number(match[1]);
        if (match[2]) end = Math.min(Number(match[2]), end);
      }
      if (start >= file.length || end < start) {
        response.status(416).set("Content-Range", `bytes */${file.length}`).end();
        return;
      }
      status = 206;
    }
    response.set({
      "Content-Type": file.metadata?.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Accept-Ranges": "bytes",
      "Content-Length": String(end - start + 1),
      ...(status === 206 ? { "Content-Range": `bytes ${start}-${end}/${file.length}` } : {}),
    });
    response.status(status);
    uploadBucket.openDownloadStream(file._id, { start, end: end + 1 }).pipe(response);
  }));

  app.get("/api/auth", (request, response) => {
    response.json({
      authenticated: request.session?.isAdmin === true,
      configured: Boolean(adminPasswordHash),
      mongoConnected: Boolean(database),
    });
  });

  app.post("/api/auth/login", loginLimit, requireSameOrigin, asyncRoute(async (request, response) => {
    const password = typeof request.body?.password === "string" ? request.body.password : "";
    if (password.length > 200 || !adminPasswordHash || !(await bcrypt.compare(password, adminPasswordHash))) {
      response.status(401).json({ error: "The password is incorrect or admin access is not configured." });
      return;
    }
    await new Promise((resolve, reject) => {
      request.session.regenerate((error) => error ? reject(error) : resolve());
    });
    request.session.isAdmin = true;
    await new Promise((resolve, reject) => {
      request.session.save((error) => error ? reject(error) : resolve());
    });
    response.json({ authenticated: true });
  }));

  app.post("/api/auth/logout", requireSameOrigin, requireAdmin, (request, response, next) => {
    request.session.destroy((error) => {
      if (error) {
        next(error);
        return;
      }
      response.clearCookie("miralex.sid", {
        httpOnly: true,
        sameSite: "strict",
        secure: productionMode,
        path: "/",
      });
      response.json({ authenticated: false });
    });
  });

  app.get("/api/content", asyncRoute(async (_request, response) => {
    response.json(await readContent());
  }));

  app.put("/api/content", requireSameOrigin, requireAdmin, asyncRoute(async (request, response) => {
    if (!isValidContent(request.body)) {
      response.status(400).json({ error: "The submitted site content is invalid." });
      return;
    }
    const content = assignProjectIds(request.body);
    if (new Set(content.projects.map((project) => project.id)).size !== content.projects.length) {
      response.status(400).json({ error: "Every portfolio project must have a unique ID." });
      return;
    }
    await saveContent(content);
    response.json({ saved: true });
  }));

  app.post("/api/uploads", uploadLimit, requireSameOrigin, requireAdmin, (request, response, next) => {
    upload.single("image")(request, response, next);
  }, asyncRoute(async (request, response) => {
    if (!request.file) {
      response.status(400).json({ error: "Choose an image to upload." });
      return;
    }
    const type = imageTypes[request.file.mimetype];
    if (!type || !type.signature(request.file.buffer)) {
      response.status(400).json({ error: "Upload a valid JPEG, PNG, or WebP image." });
      return;
    }
    const filename = `${randomUUID()}${type.extension}`;
    if (uploadBucket) {
      await new Promise((resolve, reject) => {
        const stream = uploadBucket.openUploadStream(filename, {
          contentType: request.file.mimetype,
          metadata: { contentType: request.file.mimetype },
        });
        stream.once("error", reject);
        stream.once("finish", resolve);
        stream.end(request.file.buffer);
      });
    } else {
      await fs.mkdir(uploadsDirectory, { recursive: true });
      await fs.writeFile(path.join(uploadsDirectory, filename), request.file.buffer, { flag: "wx" });
    }
    response.status(201).json({ url: `/uploads/${filename}` });
  }));

  app.post("/api/uploads/media", uploadLimit, requireSameOrigin, requireAdmin, (request, response, next) => {
    galleryUpload.single("media")(request, response, next);
  }, asyncRoute(async (request, response) => {
    if (!request.file) {
      response.status(400).json({ error: "Choose an image or video to add to the project gallery." });
      return;
    }
    const type = imageTypes[request.file.mimetype];
    if (type && request.file.size > maxImageSize) {
      response.status(413).json({ error: "Images must be 25 MB or smaller." });
      return;
    }
    const mediaType = type ? "image" : "video";
    const acceptedType = type || videoTypes[request.file.mimetype];
    if (!acceptedType || !acceptedType.signature(request.file.buffer)) {
      response.status(400).json({ error: "Upload a valid JPEG, PNG, WebP, MP4, or WebM file." });
      return;
    }
    const filename = `${randomUUID()}${acceptedType.extension}`;
    if (uploadBucket) {
      await new Promise((resolve, reject) => {
        const stream = uploadBucket.openUploadStream(filename, {
          contentType: request.file.mimetype,
          metadata: { contentType: request.file.mimetype },
        });
        stream.once("error", reject);
        stream.once("finish", resolve);
        stream.end(request.file.buffer);
      });
    } else {
      await fs.mkdir(uploadsDirectory, { recursive: true });
      await fs.writeFile(path.join(uploadsDirectory, filename), request.file.buffer, { flag: "wx" });
    }
    response.status(201).json({ url: `/uploads/${filename}`, type: mediaType });
  }));

  app.use("/api/uploads", (error, _request, response, next) => {
    if (error instanceof multer.MulterError) {
      response.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400)
        .json({ error: error.code === "LIMIT_FILE_SIZE" ? "Images must be 25 MB or smaller; videos must be 100 MB or smaller." : "Choose one media file to upload." });
      return;
    }
    next(error);
  });

  app.get("/api/projects/:projectId/engagement", publicInteractionLimit, asyncRoute(async (request, response) => {
    const content = await readContent();
    if (!content.projects.some((project) => project.id === request.params.projectId)) {
      response.status(404).json({ error: "Project not found." });
      return;
    }
    response.json(await getEngagement(request.params.projectId, request.visitorId));
  }));

  app.post("/api/projects/:projectId/views", publicInteractionLimit, asyncRoute(async (request, response) => {
    const content = await readContent();
    if (!content.projects.some((project) => project.id === request.params.projectId)) {
      response.status(404).json({ error: "Project not found." });
      return;
    }
    response.json(await recordView(request.params.projectId, request.visitorId));
  }));

  app.post("/api/projects/:projectId/likes", publicInteractionLimit, asyncRoute(async (request, response) => {
    const content = await readContent();
    if (!content.projects.some((project) => project.id === request.params.projectId)) {
      response.status(404).json({ error: "Project not found." });
      return;
    }
    response.json(await toggleProjectLike(request.params.projectId, request.visitorId));
  }));

  app.post("/api/projects/:projectId/comments", commentLimit, asyncRoute(async (request, response) => {
    const content = await readContent();
    if (!content.projects.some((project) => project.id === request.params.projectId)) {
      response.status(404).json({ error: "Project not found." });
      return;
    }
    const name = typeof request.body?.name === "string" ? request.body.name.trim() : "";
    const text = typeof request.body?.text === "string" ? request.body.text.trim() : "";
    if (name.length > 40 || text.length < 2 || text.length > 800) {
      response.status(400).json({ error: "Enter a comment of 2–800 characters and a name under 40 characters." });
      return;
    }
    const comment = {
      id: randomUUID(),
      projectId: request.params.projectId,
      projectTitle: content.projects.find((project) => project.id === request.params.projectId).title,
      name: name || "Anonymous",
      text,
      createdAt: new Date(),
    };
    await addComment(request.params.projectId, comment);
    response.status(201).json(await getEngagement(request.params.projectId, request.visitorId));
  }));

  app.get("/api/comments", requireAdmin, asyncRoute(async (_request, response) => {
    response.json(await listComments());
  }));

  app.delete("/api/projects/:projectId/comments/:commentId", requireSameOrigin, requireAdmin, asyncRoute(async (request, response) => {
    const removed = await removeComment(request.params.projectId, request.params.commentId);
    if (!removed) {
      response.status(404).json({ error: "Comment not found." });
      return;
    }
    response.json({ removed: true });
  }));

  if (productionMode) {
    const buildDirectory = path.join(root, "dist");
    app.use("/assets", express.static(path.join(buildDirectory, "assets"), {
      maxAge: "1y",
      immutable: true,
    }));
    app.use(express.static(buildDirectory, {
      setHeaders(response, filePath) {
        if (path.basename(filePath) === "index.html") {
          response.setHeader("Cache-Control", "no-cache");
        }
      },
    }));
    app.use((_request, response) => response.sendFile(path.join(buildDirectory, "index.html")));
  } else {
    const { createServer } = await import("vite");
    const vite = await createServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  }

  app.use((error, _request, response, _next) => {
    console.error("Request failed:", error);
    if (!response.headersSent) {
      const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 500 ? error.status : 500;
      response.status(status).json({ error: status === 400 ? "The request body is invalid JSON." : "The server could not complete this request." });
    }
  });

  const host = process.env.HOST || (productionMode ? "0.0.0.0" : "127.0.0.1");
  app.listen(port, host, () => {
    console.log(`miralex_D_Great is running at http://127.0.0.1:${port}`);
  });
}

start().catch(async (error) => {
  console.error("Could not start miralex_D_Great:", error);
  if (mongoClient) await mongoClient.close();
  process.exitCode = 1;
});
