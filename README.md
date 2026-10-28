# miralex_D_Great creative agency

## Run locally

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env`.
3. Configure `MONGODB_URI`, `MONGODB_DB`, `ADMIN_PASSWORD_HASH`, and `SESSION_SECRET` in `.env`.
4. Run `npm install`, then `npm run dev`.
5. Open `http://127.0.0.1:3000`.

Generate a bcrypt hash for your admin password locally:

```sh
node --input-type=module -e "import bcrypt from 'bcryptjs'; import { createInterface } from 'node:readline/promises'; const rl = createInterface({ input: process.stdin, output: process.stdout }); const password = await rl.question('Admin password: '); console.log(await bcrypt.hash(password, 12)); rl.close();"
```

Generate the session secret locally with:

```sh
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Put the resulting hash and secret in `.env`; do not send them in chat or commit
`.env`. Use a MongoDB database user with only the permissions this application
needs, and restrict Atlas network access to your server where possible.

The Studio panel requires a sign-in. Its password is verified against the
bcrypt hash; authorized changes use short-lived, HTTP-only, same-site session
cookies. Production sessions are stored in MongoDB. Configure MongoDB and an
admin hash in development too if you want to test the complete panel.
The public contact section includes WhatsApp and email links. Set the WhatsApp
number with its international country code in the Studio panel's Site content
tab; the site converts it to the digits-only format required by WhatsApp links.
Add real client quotes from the Studio panel's Testimonials tab; each quote
needs a client name and testimonial, while role/company and project are
optional. Testimonials appear between Selected Work and the Studio section.
When creating a portfolio project, choose “Other…” to enter a custom service.
Saving the portfolio also adds that service to the public “What we do” list.

## MongoDB collections

- `site`: site copy and portfolio project metadata
- `views`: unique project views per signed browser visitor
- `likes`: one current like per project and browser visitor
- `comments`: public project comments and their moderation status
- `admin_sessions`: short-lived administrator sessions

Project covers and gallery images can be JPEG, PNG, or WebP (up to 25 MB each).
Uploaded images are stored as supplied without resizing or recompression, preserving
their original pixel data and embedded color profile.
Project galleries also accept MP4 and WebM videos (up to 100 MB each), with up
to 30 gallery items per project. These files are stored in MongoDB GridFS when
MongoDB is configured. Without MongoDB in local development, uploads use
`public/uploads/` instead. Visitors can open a project cover to browse its
images and videos in the horizontal project viewer. Visitors can also comment
and like projects; views are counted once per browser profile. Public comments
are rate-limited and can be removed from the Studio panel's Comments tab.

If `MONGODB_URI` is omitted during local development, the site falls back to
local JSON files for content and engagement. Production refuses to start
without MongoDB, a bcrypt admin password hash, and a session secret.

## Deploy the full site to Render

Render hosts both the React site and Express API, avoiding proxy limits for
large portfolio image and video uploads. MongoDB stores content, engagement,
sessions, and uploaded files across deployments.

1. Push the project to a GitHub repository. Do not add `.env` or any secrets.
2. In Render, create a Blueprint from that repository and use `render.yaml`.
   Set `MONGODB_URI`, `ADMIN_PASSWORD_HASH`, and `SESSION_SECRET` in the
   service's private environment settings. The hash and secret can be generated
   locally using the commands above. Keep MongoDB credentials out of chat and
   source control.
3. Allow the Render service to connect to MongoDB in your database network
   access settings.
4. Open the Render service URL after deployment and verify the site loads, the
   Studio sign-in works, and an authorized portfolio upload saves.

The included Blueprint uses Render's free plan, which may sleep when idle and
take longer to respond on the first visit after inactivity. Choose an
always-on plan in Render if you need consistent response times.
