import React, { useEffect, useRef, useState } from "react";

const emptyContent = {
  eyebrow: "",
  headlineLineOne: "",
  headlineLineTwo: "",
  headlineEmphasis: "",
  headlineLineThree: "",
  intro: "",
  email: "",
  whatsappNumber: "",
  services: [],
  testimonials: [],
  projects: [],
};

const serviceDescription = "Thoughtful, made with intention";

function WhatsAppIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2L3 20l1.2-4.9a8.2 8.2 0 1 1 16-3.4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8.2 7.9c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .6.5.9 1.3 1.7 2.2 2.2.2.1.4.1.6-.1l.8-.9c.2-.2.4-.2.7-.1l1.6.8c.3.1.4.3.4.5 0 .3-.2 1.1-.7 1.5-.5.5-1.2.7-2 .5-1.9-.5-3.5-1.6-4.7-3.1-1.1-1.3-1.7-2.7-1.7-3.7 0-.6.3-1.1.7-1.2Z" fill="currentColor" />
    </svg>
  );
}

function getProjectMedia(project) {
  const media = [];
  if (project.image) media.push({ type: "image", url: project.image });
  (project.media || []).forEach((item) => {
    if (item.url !== project.image) media.push(item);
  });
  return media;
}

function HeroArtwork() {
  return (
    <svg className="hero-artwork-svg" viewBox="0 0 460 420" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="heroBoard" x1="84" y1="53" x2="387" y2="353" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5F2EB" />
          <stop offset="1" stopColor="#C6E5D7" />
        </linearGradient>
        <linearGradient id="heroPoster" x1="120" y1="115" x2="273" y2="290" gradientUnits="userSpaceOnUse">
          <stop stopColor="#08A897" />
          <stop offset="1" stopColor="#063C35" />
        </linearGradient>
        <linearGradient id="heroCube" x1="289" y1="145" x2="380" y2="273" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C6E5D7" />
          <stop offset="1" stopColor="#008A7C" />
        </linearGradient>
        <filter id="heroShadow" x="30" y="12" width="426" height="398" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>
      <ellipse cx="243" cy="339" rx="157" ry="25" fill="#001D19" fillOpacity=".42" filter="url(#heroShadow)" />
      <g transform="rotate(-7 232 209)">
        <rect x="76" y="48" width="321" height="299" rx="22" fill="url(#heroBoard)" />
        <path d="M76 70c0-12.15 9.85-22 22-22h277c12.15 0 22 9.85 22 22v31H76V70Z" fill="#E8E8DE" />
        <circle cx="101" cy="76" r="5" fill="#008A7C" />
        <circle cx="119" cy="76" r="5" fill="#D49379" />
        <circle cx="137" cy="76" r="5" fill="#183D36" />
        <rect x="102" y="120" width="151" height="190" rx="6" fill="url(#heroPoster)" />
        <circle cx="178" cy="201" r="48" fill="#C6E5D7" />
        <path d="M130 265c24-39 49-58 73-58 18 0 34 9 50 27v77h-123v-46Z" fill="#F2B09B" />
        <path d="m235 132 22 21-22 21-22-21 22-21Z" fill="#F2B09B" />
        <rect x="274" y="128" width="93" height="7" rx="3.5" fill="#123A34" fillOpacity=".28" />
        <rect x="274" y="145" width="68" height="6" rx="3" fill="#123A34" fillOpacity=".15" />
        <rect x="274" y="176" width="86" height="99" rx="10" fill="#E1E9DD" />
        <path d="m317 184 35 21v42l-35 21-35-21v-42l35-21Z" fill="url(#heroCube)" />
        <path d="m317 184 35 21-35 21-35-21 35-21Z" fill="#E5F0E7" />
        <path d="M282 205v42l35 21v-42l-35-21Z" fill="#008A7C" />
        <path d="M317 226v42l35-21v-42l-35 21Z" fill="#0A574D" />
        <rect x="274" y="291" width="51" height="6" rx="3" fill="#008A7C" fillOpacity=".7" />
        <rect x="274" y="304" width="78" height="5" rx="2.5" fill="#123A34" fillOpacity=".14" />
      </g>
      <g transform="rotate(19 382 100)">
        <rect x="367" y="53" width="17" height="123" rx="8.5" fill="#E9AC91" />
        <path d="m367 60 17 10v87l-17-10V60Z" fill="#CB836C" />
        <path d="m367 53 8.5-22 8.5 22h-17Z" fill="#C6E5D7" />
        <path d="m375.5 31 8.5 22h-8.5V31Z" fill="#008A7C" />
        <path d="m372 163 3.5 13 3.5-13h-7Z" fill="#F5F2EB" />
      </g>
      <circle cx="83" cy="139" r="12" fill="#E9AC91" />
      <path d="m81 125 3-10 3 10" stroke="#F5F2EB" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StudioArtwork() {
  return (
    <svg className="studio-artwork-svg" viewBox="0 0 480 440" fill="none" role="img" aria-labelledby="studio-artwork-title">
      <title id="studio-artwork-title">A colorful creative workspace with a design board, color palette, and three-dimensional geometric shapes</title>
      <defs>
        <linearGradient id="studioCanvas" x1="79" y1="47" x2="395" y2="387" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7F1E5" />
          <stop offset="1" stopColor="#D3E5D6" />
        </linearGradient>
        <linearGradient id="studioOrb" x1="310" y1="96" x2="392" y2="192" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E5A98D" />
          <stop offset="1" stopColor="#BD6D57" />
        </linearGradient>
        <linearGradient id="studioBlock" x1="277" y1="255" x2="387" y2="373" gradientUnits="userSpaceOnUse">
          <stop stopColor="#37B9A1" />
          <stop offset="1" stopColor="#087366" />
        </linearGradient>
        <filter id="studioShadow" x="19" y="18" width="452" height="418" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <ellipse cx="245" cy="378" rx="170" ry="24" fill="#001E19" fillOpacity=".34" filter="url(#studioShadow)" />
      <g transform="rotate(-5 237 217)">
        <rect x="59" y="45" width="339" height="330" rx="20" fill="#001E19" fillOpacity=".14" />
        <rect x="50" y="36" width="339" height="330" rx="20" fill="url(#studioCanvas)" />
        <rect x="50" y="36" width="339" height="34" rx="16" fill="#E6E7DA" />
        <path d="M50 54h339v16H50V54Z" fill="#E6E7DA" />
        <circle cx="74" cy="53" r="4.5" fill="#008A7C" />
        <circle cx="91" cy="53" r="4.5" fill="#E5A98D" />
        <circle cx="108" cy="53" r="4.5" fill="#163F37" />
        <rect x="78" y="96" width="142" height="211" rx="5" fill="#073E36" />
        <path d="M78 266c26-38 49-58 75-58 25 0 47 20 67 58v41H78v-41Z" fill="#E8A68A" />
        <circle cx="149" cy="173" r="46" fill="#D6E6D6" />
        <path d="m191 105 13 13-13 13-13-13 13-13Z" fill="#E2AD43" />
        <path d="M246 103h104" stroke="#163F37" strokeOpacity=".2" strokeWidth="7" strokeLinecap="round" />
        <path d="M246 123h78" stroke="#163F37" strokeOpacity=".12" strokeWidth="6" strokeLinecap="round" />
        <rect x="246" y="148" width="109" height="81" rx="9" fill="#EDE4D3" />
        <path d="M276 207a29 29 0 1 1 58 0h-58Z" fill="#008A7C" />
        <circle cx="305" cy="177" r="29" stroke="#E1A486" strokeWidth="14" strokeDasharray="112 72" transform="rotate(-60 305 177)" />
        <circle cx="305" cy="177" r="6" fill="#163F37" />
        <rect x="256" y="279" width="85" height="57" rx="6" fill="url(#studioBlock)" />
        <path d="m256 279 43-25 42 25-43 25-42-25Z" fill="#9AE1C4" />
        <path d="m341 279-43 25v57l43-25v-57Z" fill="#075E53" />
        <path d="m256 279 42 25v57l-42-25v-57Z" fill="#16927E" />
      </g>
      <g transform="rotate(18 392 217)">
        <path d="M388 203c-10 12-29 34-32 48-3 13 6 22 17 18 15-6 28-35 36-49-2-9-11-16-21-17Z" fill="#F2C957" />
        <path d="m388 203 11 8 10 9c-9 15-22 43-36 49l-2-13 17-53Z" fill="#E9AC91" />
        <path d="m388 203 11 8-7 11-7-10 3-9Z" fill="#FAF2DF" />
        <path d="m388 203 4-13 7 11-11 2Z" fill="#123A34" />
      </g>
      <circle cx="399" cy="318" r="10" fill="#E9AC91" />
      <circle cx="82" cy="342" r="7" fill="#E2AD43" />
    </svg>
  );
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    if (response.status === 401) window.dispatchEvent(new Event("admin-session-expired"));
    throw new Error(result.error || `Request failed (${response.status}).`);
  }
  return response.json();
}

async function requestContent(method, content) {
  return requestJson("/api/content", {
    method,
    ...(content ? { body: JSON.stringify(content) } : {}),
  });
}

function App() {
  const [content, setContent] = useState(emptyContent);
  const [draft, setDraft] = useState(emptyContent);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [customServiceProjects, setCustomServiceProjects] = useState({});
  const [customServiceValues, setCustomServiceValues] = useState({});
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [engagement, setEngagement] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [adminComments, setAdminComments] = useState([]);
  const [uploadingProject, setUploadingProject] = useState("");
  const [galleryProjectId, setGalleryProjectId] = useState("");
  const [galleryActiveIndex, setGalleryActiveIndex] = useState(0);
  const galleryTrack = useRef(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [adminConfigured, setAdminConfigured] = useState(true);
  const [mongoConfigured, setMongoConfigured] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([requestContent("GET"), requestJson("/api/auth")])
      .then(([saved, auth]) => {
        if (active) {
          setContent(saved);
          setDraft(saved);
          setAuthenticated(auth.authenticated);
          setAdminConfigured(auth.configured);
          setMongoConfigured(auth.mongoConnected);
        }
      })
      .catch((loadError) => {
        if (active) setError(`Could not load the site: ${loadError.message}`);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (loading || !content.projects.length) return undefined;
    let active = true;
    const projectIds = content.projects.map((project) => project.id);

    Promise.all(projectIds.map(async (projectId) => {
      const current = await requestJson(`/api/projects/${encodeURIComponent(projectId)}/engagement`);
      if (active) setEngagement((saved) => ({ ...saved, [projectId]: current }));
    })).catch((loadError) => {
      if (active) setError(`Could not load portfolio activity: ${loadError.message}`);
    });

    if (!("IntersectionObserver" in window)) {
      projectIds.forEach((projectId) => recordView(projectId));
      return () => { active = false; };
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          recordView(entry.target.dataset.projectId);
        }
      });
    }, { threshold: 0.35 });
    document.querySelectorAll("[data-project-id]").forEach((card) => observer.observe(card));
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [loading, content.projects]);

  useEffect(() => {
    if (!editorOpen || activeTab !== "comments") return undefined;
    let active = true;
    requestJson("/api/comments")
      .then((comments) => { if (active) setAdminComments(comments); })
      .catch((loadError) => setError(`Could not load comments: ${loadError.message}`));
    return () => { active = false; };
  }, [editorOpen, activeTab]);

  useEffect(() => {
    document.body.classList.toggle("panel-open", editorOpen);
    return () => document.body.classList.remove("panel-open");
  }, [editorOpen]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setEditorOpen(false);
        setLoginOpen(false);
        setGalleryProjectId("");
        setMenuOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!galleryProjectId) return undefined;
    function onKeyDown(event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (event.target instanceof HTMLElement && event.target.closest("video, input, textarea, select")) return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const slides = galleryTrack.current?.querySelectorAll(".gallery-slide");
      const nextIndex = Math.max(0, Math.min(galleryActiveIndex + direction, (slides?.length || 1) - 1));
      const nextSlide = slides?.[nextIndex];
      if (!nextSlide || !galleryTrack.current) return;
      galleryTrack.current.scrollTo({
        left: nextSlide.offsetLeft - (galleryTrack.current.clientWidth - nextSlide.clientWidth) / 2,
        behavior: "smooth",
      });
      setGalleryActiveIndex(nextIndex);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [galleryProjectId, galleryActiveIndex]);

  useEffect(() => {
    document.body.classList.toggle("gallery-open", Boolean(galleryProjectId));
    return () => document.body.classList.remove("gallery-open");
  }, [galleryProjectId]);

  useEffect(() => {
    function onSessionExpired() {
      setAuthenticated(false);
      setEditorOpen(false);
      setLoginOpen(true);
      setError("Your studio session expired. Please sign in again.");
    }
    window.addEventListener("admin-session-expired", onSessionExpired);
    return () => window.removeEventListener("admin-session-expired", onSessionExpired);
  }, []);

  function openEditor() {
    if (!authenticated) {
      setLoginPassword("");
      setLoginOpen(true);
      return;
    }
    setDraft(structuredClone(content));
    setActiveTab("content");
    setEditorOpen(true);
  }

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  async function saveDraft(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    if ((draft.testimonials || []).some((testimonial) => !testimonial.quote.trim() || !testimonial.name.trim())) {
      setError("Each testimonial needs a quote and client name before saving.");
      setSaving(false);
      return;
    }
    const services = [];
    const seenServices = new Set();
    for (const service of [...draft.services, ...draft.projects.map((project) => project.category)]) {
      const trimmedService = service.trim();
      const serviceKey = trimmedService.toLowerCase();
      if (trimmedService && !seenServices.has(serviceKey)) {
        services.push(trimmedService);
        seenServices.add(serviceKey);
      }
    }
    if (services.length > 50 || services.some((service) => service.length > 100)) {
      setError("Services must contain no more than 50 entries, each 100 characters or fewer.");
      setSaving(false);
      return;
    }
    const savedDraft = {
      ...draft,
      services,
      projects: draft.projects.map((project) => ({ ...project, category: project.category.trim() })),
    };
    try {
      await requestContent("PUT", savedDraft);
      setDraft(savedDraft);
      setContent(savedDraft);
      setToast("Changes saved on this server.");
    } catch (saveError) {
      setError(`Could not save changes: ${saveError.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function recordView(projectId) {
    try {
      const result = await requestJson(`/api/projects/${encodeURIComponent(projectId)}/views`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      setEngagement((current) => ({ ...current, [projectId]: result }));
    } catch (viewError) {
      setError(`Could not record portfolio view: ${viewError.message}`);
    }
  }

  async function toggleLike(projectId) {
    try {
      const result = await requestJson(`/api/projects/${encodeURIComponent(projectId)}/likes`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      setEngagement((current) => ({ ...current, [projectId]: result }));
    } catch (likeError) {
      setError(`Could not update like: ${likeError.message}`);
    }
  }

  async function submitComment(projectId, event) {
    event.preventDefault();
    const draftComment = commentDrafts[projectId] || { name: "", text: "" };
    try {
      const result = await requestJson(`/api/projects/${encodeURIComponent(projectId)}/comments`, {
        method: "POST",
        body: JSON.stringify(draftComment),
      });
      setEngagement((saved) => ({ ...saved, [projectId]: result }));
      setCommentDrafts((saved) => ({ ...saved, [projectId]: { name: draftComment.name, text: "" } }));
    } catch (commentError) {
      setError(`Could not post comment: ${commentError.message}`);
    }
  }

  async function handleImageUpload(projectIndex, event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const projectId = draft.projects[projectIndex].id;
    setUploadingProject(projectId);
    setError("");
    const formData = new FormData();
    formData.append("image", file);
    try {
      const result = await requestJson("/api/uploads", {
        method: "POST",
        body: formData,
      });
      setDraft((current) => ({
        ...current,
        projects: current.projects.map((project) => project.id === projectId ? { ...project, image: result.url } : project),
      }));
      setToast("Image uploaded. Save the portfolio to publish it.");
    } catch (uploadError) {
      setError(`Could not upload image: ${uploadError.message}`);
    } finally {
      setUploadingProject("");
      event.target.value = "";
    }
  }

  async function handleGalleryUpload(projectIndex, event) {
    const files = Array.from(event.target.files || []);
    const project = draft.projects[projectIndex];
    if (!files.length || !project) return;
    const currentCount = project.media?.length || 0;
    if (files.length + currentCount > 30) {
      setError("Each project can have up to 30 gallery images or videos. Remove an item before adding more.");
      event.target.value = "";
      return;
    }
    setUploadingProject(project.id);
    setError("");
    let uploaded = 0;
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("media", file);
        const result = await requestJson("/api/uploads/media", {
          method: "POST",
          body: formData,
        });
        setDraft((current) => ({
          ...current,
          projects: current.projects.map((item) => item.id === project.id
            ? { ...item, media: [...(item.media || []), result] }
            : item),
        }));
        uploaded += 1;
      }
      setToast(`${uploaded} gallery ${uploaded === 1 ? "item" : "items"} uploaded. Save the portfolio to publish.`);
    } catch (uploadError) {
      setError(`Could not upload gallery media${uploaded ? ` (${uploaded} file${uploaded === 1 ? "" : "s"} uploaded)` : ""}: ${uploadError.message}`);
    } finally {
      setUploadingProject("");
      event.target.value = "";
    }
  }

  async function deleteComment(projectId, commentId) {
    try {
      await requestJson(`/api/projects/${encodeURIComponent(projectId)}/comments/${encodeURIComponent(commentId)}`, {
        method: "DELETE",
      });
      setAdminComments((comments) => comments.filter((comment) => comment.id !== commentId));
      const current = await requestJson(`/api/projects/${encodeURIComponent(projectId)}/engagement`);
      setEngagement((saved) => ({ ...saved, [projectId]: current }));
      setToast("Comment removed.");
    } catch (deleteError) {
      setError(`Could not remove comment: ${deleteError.message}`);
    }
  }

  async function login(event) {
    event.preventDefault();
    setLoginBusy(true);
    setError("");
    try {
      await requestJson("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ password: loginPassword }),
      });
      setAuthenticated(true);
      setLoginOpen(false);
      setLoginPassword("");
      setDraft(structuredClone(content));
      setActiveTab("content");
      setEditorOpen(true);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoginBusy(false);
    }
  }

  async function logout() {
    try {
      await requestJson("/api/auth/logout", { method: "POST", body: JSON.stringify({}) });
      setAuthenticated(false);
      setEditorOpen(false);
      setLoginOpen(false);
      setToast("You have been signed out.");
    } catch (logoutError) {
      setError(`Could not sign out: ${logoutError.message}`);
    }
  }

  function updateProject(index, field, value) {
    setDraft((current) => ({
      ...current,
      projects: current.projects.map((project, projectIndex) =>
        projectIndex === index ? { ...project, [field]: value } : project,
      ),
    }));
  }

  function chooseProjectService(index, selection) {
    const project = draft.projects[index];
    if (!project) return;
    if (selection !== "__other__") {
      setCustomServiceProjects((current) => ({ ...current, [project.id]: false }));
      setCustomServiceValues((current) => ({ ...current, [project.id]: "" }));
      updateProject(index, "category", selection);
      return;
    }

    const existingCustom = project.category && !draft.services.some(
      (service) => service.toLowerCase() === project.category.toLowerCase(),
    ) ? project.category : "";
    setCustomServiceProjects((current) => ({ ...current, [project.id]: true }));
    setCustomServiceValues((current) => ({ ...current, [project.id]: existingCustom }));
    setDraft((current) => ({
      ...current,
      projects: current.projects.map((item, projectIndex) =>
        projectIndex === index ? { ...item, category: existingCustom } : item,
      ),
    }));
  }

  function updateCustomProjectService(index, value) {
    const project = draft.projects[index];
    if (!project) return;
    setCustomServiceProjects((current) => ({ ...current, [project.id]: true }));
    setCustomServiceValues((current) => ({ ...current, [project.id]: value }));
    setError("");
    updateProject(index, "category", value);
  }

  function addTestimonial() {
    setDraft((current) => ({
      ...current,
      testimonials: [...(current.testimonials || []), {
        id: window.crypto.randomUUID(),
        quote: "",
        name: "",
        role: "",
        project: "",
      }],
    }));
  }

  function updateTestimonial(index, field, value) {
    setDraft((current) => ({
      ...current,
      testimonials: current.testimonials.map((testimonial, testimonialIndex) =>
        testimonialIndex === index ? { ...testimonial, [field]: value } : testimonial,
      ),
    }));
  }

  function removeTestimonial(index) {
    setDraft((current) => ({
      ...current,
      testimonials: current.testimonials.filter((_, testimonialIndex) => testimonialIndex !== index),
    }));
  }

  function addProject() {
    setDraft((current) => ({
      ...current,
      projects: [
        ...current.projects,
        {
        id: window.crypto.randomUUID(),
        title: "New project",
          category: draft.services[0] || "",
          year: String(new Date().getFullYear()),
          image: "",
        },
      ],
    }));
  }

  function removeProject(index) {
    setDraft((current) => ({
      ...current,
      projects: current.projects.filter((_, projectIndex) => projectIndex !== index),
    }));
  }

  function moveGallery(direction) {
    const slides = galleryTrack.current?.querySelectorAll(".gallery-slide");
    const nextIndex = Math.max(0, Math.min(galleryActiveIndex + direction, (slides?.length || 1) - 1));
    const nextSlide = slides?.[nextIndex];
    if (!nextSlide || !galleryTrack.current) return;
    galleryTrack.current.scrollTo({
      left: nextSlide.offsetLeft - (galleryTrack.current.clientWidth - nextSlide.clientWidth) / 2,
      behavior: "smooth",
    });
    setGalleryActiveIndex(nextIndex);
  }

  function updateGalleryFocus(event) {
    const slides = Array.from(event.currentTarget.querySelectorAll(".gallery-slide"));
    const trackCenter = event.currentTarget.getBoundingClientRect().left + event.currentTarget.clientWidth / 2;
    const focusedIndex = slides.reduce((closest, slide, index) => {
      const bounds = slide.getBoundingClientRect();
      const distance = Math.abs(bounds.left + bounds.width / 2 - trackCenter);
      return distance < closest.distance ? { index, distance } : closest;
    }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
    setGalleryActiveIndex(focusedIndex);
  }

  const headlineLineTwo = (
    <>
      {content.headlineLineTwo} <em>{content.headlineEmphasis}</em>
    </>
  );
  const activeGalleryProject = content.projects.find((project) => project.id === galleryProjectId);
  const activeGalleryItems = activeGalleryProject ? getProjectMedia(activeGalleryProject) : [];
  const whatsappDigits = (content.whatsappNumber || "").replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent("Hi Miralex_D_Great, I have a creative project in mind.")}`;

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="miralex_D_Great home">
          <img src="/logo.png" alt="" className="brand-mark" />
          <span className="brand-name">miralex_D_Great<span className="brand-subtitle">CREATIVE AGENCY</span></span>
        </a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span>
        </button>
        <nav className={`main-nav${menuOpen ? " open" : ""}`} aria-label="Main navigation">
          <a href="#work" onClick={() => setMenuOpen(false)}>Selected work</a>
          <a href="#testimonials" onClick={() => setMenuOpen(false)}>Kind words</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>Studio</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>What we do</a>
        </nav>
        <a className="header-contact header-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer" aria-label="Start a conversation on WhatsApp">
          <WhatsAppIcon className="header-whatsapp-icon" /><span>Let's talk</span><span>↗</span>
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-orbit orbit-one"></div>
          <div className="hero-orbit orbit-two"></div>
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot"></span>{content.eyebrow || "Independent creative studio · Available worldwide"}</p>
            <h1>
              <span>{content.headlineLineOne}</span><br />
              <span>{headlineLineTwo}</span><br />
              <span>{content.headlineLineThree}</span>
            </h1>
            <div className="hero-bottom">
              <p>{content.intro}</p>
              <a className="round-link" href="#work" aria-label="Explore selected work">↓</a>
            </div>
          </div>
          <div className="hero-artwork"><HeroArtwork /></div>
          <div className="hero-index">01 — 04</div>
        </section>

        <section className="ticker" aria-label="Studio services">
          <div className="ticker-track">
            {Array.from({ length: 3 }, (_, index) => (
              <React.Fragment key={index}>
                <span>IDENTITY</span><i>✳</i><span>DIGITAL</span><i>✳</i><span>MOTION</span><i>✳</i>
              </React.Fragment>
            ))}
          </div>
        </section>

        <section className="work-section section-wrap" id="work">
          <div className="section-heading">
            <div><p className="eyebrow dark-eyebrow">A few good things</p><h2>Selected <em>work</em></h2></div>
            <p className="section-note">Thoughtful collaborations.<br />Made with intention.</p>
          </div>
          <div className="project-grid" aria-live="polite">
            {content.projects.map((project, index) => {
              const activity = engagement[project.id] || { views: 0, likes: 0, likedByMe: false, comments: [] };
              const commentDraft = commentDrafts[project.id] || { name: "", text: "" };
              const projectMedia = getProjectMedia(project);
              return (
              <article className="project-card" key={project.id || `${project.title}-${index}`} data-project-id={project.id}>
                <div className="project-image-wrap">
                  <button
                    className="project-cover-button"
                    type="button"
                    disabled={!projectMedia.length}
                    aria-label={`View ${project.title} gallery, ${projectMedia.length} ${projectMedia.length === 1 ? "item" : "items"}`}
                    onClick={() => {
                      setGalleryActiveIndex(0);
                      setGalleryProjectId(project.id);
                    }}
                  >
                    {project.image ? <img className="project-image" src={project.image} alt="" loading="lazy" decoding="async" /> : <span className="project-image-placeholder">{project.title}</span>}
                    <span className="project-gallery-hint">{projectMedia.length > 1 ? `${projectMedia.length} images & videos · View project` : "View project"}</span>
                    <span className="project-index">{String(index + 1).padStart(2, "0")} / {String(content.projects.length).padStart(2, "0")}</span>
                  </button>
                </div>
                <div className="project-meta">
                  <div><h3>{project.title}</h3><p>{project.category}</p></div>
                  <span className="project-year">{project.year}</span>
                </div>
                <div className="project-engagement">
                  <span className="view-count" aria-label={`${activity.views} views`}>◉ {activity.views} views</span>
                  <button type="button" className={`engagement-button${activity.likedByMe ? " liked" : ""}`} aria-pressed={activity.likedByMe} onClick={() => toggleLike(project.id)}>♥ <span>{activity.likes}</span> Like</button>
                  <button type="button" className="engagement-button comments-toggle" aria-expanded={Boolean(openComments[project.id])} onClick={() => setOpenComments((saved) => ({ ...saved, [project.id]: !saved[project.id] }))}>Comments <span>{activity.comments.length}</span></button>
                </div>
                {openComments[project.id] && (
                  <div className="project-comments">
                    <div className="comment-list">
                      {activity.comments.map((comment) => (
                        <article className="public-comment" key={comment.id}>
                          <div><strong>{comment.name}</strong><time dateTime={comment.createdAt}>{new Date(comment.createdAt).toLocaleDateString()}</time></div>
                          <p>{comment.text}</p>
                        </article>
                      ))}
                      {!activity.comments.length && <p className="no-comments">No comments yet. Start the conversation.</p>}
                    </div>
                    <form className="public-comment-form" onSubmit={(event) => submitComment(project.id, event)}>
                      <input aria-label="Your name (optional)" placeholder="Your name (optional)" maxLength="40" value={commentDraft.name} onChange={(event) => setCommentDrafts((saved) => ({ ...saved, [project.id]: { ...commentDraft, name: event.target.value } }))} />
                      <textarea aria-label="Your comment" placeholder="Leave a thoughtful comment…" required minLength="2" maxLength="800" value={commentDraft.text} onChange={(event) => setCommentDrafts((saved) => ({ ...saved, [project.id]: { ...commentDraft, text: event.target.value } }))} />
                      <button className="add-project" type="submit">Post comment ↗</button>
                    </form>
                  </div>
                )}
              </article>
            );})}
            {!content.projects.length && <p className="empty-projects">Your next good thing belongs here. Add a project in the studio panel.</p>}
          </div>
        </section>

        <section className="testimonials-section section-wrap" id="testimonials">
          <div className="section-heading">
            <div><p className="eyebrow dark-eyebrow">Good work, good people</p><h2>Kind words from our <em>partners</em></h2></div>
            <p className="section-note">The best projects are built<br />together.</p>
          </div>
          {content.testimonials?.filter((testimonial) => testimonial.quote.trim() && testimonial.name.trim()).length ? (
            <div className="testimonials-grid">
              {content.testimonials.filter((testimonial) => testimonial.quote.trim() && testimonial.name.trim()).map((testimonial, index) => (
                <article className="testimonial-card" key={testimonial.id || `${testimonial.name}-${index}`}>
                  <span className="testimonial-quote-mark" aria-hidden="true">“</span>
                  <blockquote>{testimonial.quote}</blockquote>
                  <div className="testimonial-attribution">
                    <strong>{testimonial.name}</strong>
                    {testimonial.role && <span>{testimonial.role}</span>}
                    {testimonial.project && <small>{testimonial.project}</small>}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="testimonials-empty">
              <span className="testimonial-quote-mark" aria-hidden="true">“</span>
              <p>Every great project starts with a great partnership.<br />Client stories will appear here soon.</p>
            </div>
          )}
        </section>

        <section className="about-section" id="about">
          <div className="about-artwork"><StudioArtwork /></div>
          <div className="about-copy">
            <p className="eyebrow">Small studio. Big-picture thinking.</p>
            <h2>We make things<br />that <em>mean</em> something.</h2>
            <div className="about-detail">
              <p>Good design is more than a pretty picture. It's the feeling you remember, the story you want to tell, and the details that make it yours.</p>
              <p>We partner with ambitious people to turn a clear point of view into a brand, a website, and a world worth stepping into.</p>
            </div>
            <a className="text-link" href="#contact">A little more about us <span>↗</span></a>
          </div>
          <span className="about-side-note">INDEPENDENT BY NATURE · INTENTIONAL BY DESIGN</span>
        </section>

        <section className="services-section section-wrap" id="services">
          <div className="section-heading">
            <div><p className="eyebrow dark-eyebrow">From first thought to final frame</p><h2>What we <em>do</em></h2></div>
            <p className="section-note">One studio, all the right<br />creative disciplines.</p>
          </div>
          <div className="service-list">
            {content.services.map((service, index) => (
              <div className="service-row" key={`${service}-${index}`}>
                <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="service-name">{service}</span>
                <span className="service-description">{serviceDescription}</span>
                <span className="service-arrow">↗</span>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-top"><p className="eyebrow">Your next big idea starts here</p><span className="contact-spark">✳</span></div>
          <h2>Have a good idea?<br />Let's bring it <em>to life.</em></h2>
          <p className="contact-intro">Tell us what you're dreaming up. We would love to make something meaningful with you.</p>
          <div className="contact-actions">
            <a className="contact-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer">
              <WhatsAppIcon className="contact-whatsapp-icon" />
              <span><strong>Start a conversation</strong><small>Chat with us on WhatsApp</small></span>
              <span className="contact-action-arrow">↗</span>
            </a>
            <a className="contact-email" href={`mailto:${content.email}`}>
              <span className="contact-email-icon" aria-hidden="true">@</span>
              <span><strong>Email us</strong><small>{content.email}</small></span>
              <span className="contact-action-arrow">↗</span>
            </a>
          </div>
          <div className="contact-footer">
            <span>miralex_D_Great creative agency</span>
            <a href="#home">Back to the top ↑</a>
            <span>© {new Date().getFullYear()} miralex_D_Great</span>
          </div>
        </section>
      </main>

      {activeGalleryProject && activeGalleryItems.length > 0 && (
        <div
          className="gallery-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setGalleryProjectId("");
          }}
        >
          <section className="gallery-viewer" role="dialog" aria-modal="true" aria-labelledby="gallery-title">
            <header className="gallery-header">
              <div>
                <p className="gallery-eyebrow">{activeGalleryProject.category} · {activeGalleryProject.year}</p>
                <h2 id="gallery-title">{activeGalleryProject.title}</h2>
              </div>
              <button className="gallery-close" type="button" aria-label="Close project gallery" onClick={() => setGalleryProjectId("")}>×</button>
            </header>
            <div className="gallery-carousel-wrap">
              <button className="gallery-arrow gallery-previous" type="button" aria-label="Previous image" disabled={galleryActiveIndex === 0} onClick={() => moveGallery(-1)}>←</button>
              <div className="gallery-track" ref={galleryTrack} onScroll={updateGalleryFocus}>
                {activeGalleryItems.map((item, index) => (
                  <figure className={`gallery-slide${galleryActiveIndex === index ? " focused" : ""}`} key={`${item.url}-${index}`} data-gallery-index={index}>
                    <div className="gallery-media-frame">
                      {item.type === "video"
                        ? <video src={item.url} controls playsInline preload="none" aria-label={`${activeGalleryProject.title} video ${index + 1}`} />
                        : <img src={item.url} alt={`${activeGalleryProject.title} gallery image ${index + 1}`} loading={index === galleryActiveIndex ? "eager" : "lazy"} decoding="async" draggable="false" />}
                    </div>
                    <figcaption>{String(index + 1).padStart(2, "0")} / {String(activeGalleryItems.length).padStart(2, "0")}{item.type === "video" ? " · VIDEO" : ""}</figcaption>
                  </figure>
                ))}
              </div>
              <button className="gallery-arrow gallery-next" type="button" aria-label="Next image" disabled={galleryActiveIndex >= activeGalleryItems.length - 1} onClick={() => moveGallery(1)}>→</button>
            </div>
            <footer className="gallery-footer">
              <span>Scroll or swipe sideways to explore</span>
              <span>{String(galleryActiveIndex + 1).padStart(2, "0")} / {String(activeGalleryItems.length).padStart(2, "0")}</span>
            </footer>
          </section>
        </div>
      )}

      <button className="control-trigger" type="button" aria-label="Open studio control panel" onClick={openEditor}>
        <span className="control-icon">✳</span><span>Studio panel</span>
      </button>

      {editorOpen && (
        <div className="editor-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setEditorOpen(false);
        }}>
          <aside className="editor-panel" role="dialog" aria-modal="true" aria-labelledby="editor-title">
            <div className="editor-header">
              <div><p className="eyebrow dark-eyebrow">Your studio, your story</p><h2 id="editor-title">Control <em>panel</em></h2></div>
              <div className="editor-header-actions">
                <button className="logout-button" type="button" onClick={logout}>Sign out</button>
                <button className="icon-button" type="button" aria-label="Close control panel" onClick={() => setEditorOpen(false)}>×</button>
              </div>
            </div>
            <p className="editor-notice">Set a project cover, add a gallery of images and videos, manage project details, and review public comments below.</p>
            {error && <p className="editor-error" role="alert">{error}</p>}
            <div className="editor-tabs" role="tablist" aria-label="Control panel sections">
              <button type="button" className={`editor-tab${activeTab === "content" ? " active" : ""}`} role="tab" aria-selected={activeTab === "content"} onClick={() => setActiveTab("content")}>Site content</button>
              <button type="button" className={`editor-tab${activeTab === "projects" ? " active" : ""}`} role="tab" aria-selected={activeTab === "projects"} onClick={() => setActiveTab("projects")}>Portfolio</button>
              <button type="button" className={`editor-tab${activeTab === "testimonials" ? " active" : ""}`} role="tab" aria-selected={activeTab === "testimonials"} onClick={() => setActiveTab("testimonials")}>Testimonials</button>
              <button type="button" className={`editor-tab${activeTab === "comments" ? " active" : ""}`} role="tab" aria-selected={activeTab === "comments"} onClick={() => setActiveTab("comments")}>Comments</button>
            </div>
            {activeTab === "content" ? (
              <form className="editor-form" onSubmit={saveDraft}>
                <label>Intro line<input value={draft.eyebrow} maxLength="100" onChange={(event) => updateDraft("eyebrow", event.target.value)} /></label>
                <label>Headline line one<input value={draft.headlineLineOne} maxLength="45" onChange={(event) => updateDraft("headlineLineOne", event.target.value)} /></label>
                <label>Headline line two<input value={draft.headlineLineTwo} maxLength="45" onChange={(event) => updateDraft("headlineLineTwo", event.target.value)} /></label>
                <label>Italic emphasis<input value={draft.headlineEmphasis} maxLength="35" onChange={(event) => updateDraft("headlineEmphasis", event.target.value)} /></label>
                <label>Headline line three<input value={draft.headlineLineThree} maxLength="45" onChange={(event) => updateDraft("headlineLineThree", event.target.value)} /></label>
                <label>Short introduction<textarea value={draft.intro} rows="3" maxLength="240" onChange={(event) => updateDraft("intro", event.target.value)} /></label>
                <label>Contact email<input value={draft.email} type="email" maxLength="120" onChange={(event) => updateDraft("email", event.target.value)} /></label>
                <label>Business WhatsApp number<input value={draft.whatsappNumber || ""} type="tel" inputMode="tel" maxLength="24" placeholder="+234 801 234 5678" onChange={(event) => updateDraft("whatsappNumber", event.target.value)} /><span className="field-help">Include your country code. Example: +234 801 234 5678.</span></label>
                <label>Services <span className="field-help">One service per line.</span><textarea value={draft.services.join("\n")} rows="5" maxLength="5100" onChange={(event) => updateDraft("services", event.target.value.split("\n").map((service) => service.trim()).filter(Boolean))} /></label>
                <button className="save-button" type="submit" disabled={saving}>Save site content <span>↗</span></button>
              </form>
            ) : activeTab === "projects" ? (
              <div className="editor-projects">
                <div className="project-editor-heading"><h3>Portfolio projects</h3><button className="add-project" type="button" onClick={addProject}>+ Add project</button></div>
                <div className="project-edit-list">
                  {draft.projects.map((project, index) => (
                    <div className="project-edit-card" key={project.id}>
                      <h4>PROJECT {String(index + 1).padStart(2, "0")}</h4>
                      <p className="project-admin-stats">
                        {engagement[project.id]?.views || 0} views · {engagement[project.id]?.likes || 0} likes · {engagement[project.id]?.comments.length || 0} comments
                      </p>
                      <label>Project name<input value={project.title} maxLength="80" onChange={(event) => updateProject(index, "title", event.target.value)} /></label>
                      <label>Service category
                        <select value={(customServiceProjects[project.id] || (project.category && !draft.services.includes(project.category))) ? "__other__" : project.category} onChange={(event) => chooseProjectService(index, event.target.value)}>
                          <option value="" disabled>Select a service</option>
                          {draft.services.map((service) => <option key={service} value={service}>{service}</option>)}
                          <option value="__other__">Other…</option>
                        </select>
                      </label>
                      {(customServiceProjects[project.id] || (project.category && !draft.services.includes(project.category))) && (
                        <label>Specify the service
                          <input value={customServiceValues[project.id] ?? project.category} maxLength="100" placeholder="e.g. Art direction" onChange={(event) => updateCustomProjectService(index, event.target.value)} />
                          <span className="field-help">This will also be added to the public “What we do” list when you save the portfolio.</span>
                        </label>
                      )}
                      <label>Year<input value={project.year} maxLength="8" onChange={(event) => updateProject(index, "year", event.target.value)} /></label>
                      <label>Image URL<input value={project.image} type="text" maxLength="1000" placeholder="Upload an image or paste a public HTTPS URL" onChange={(event) => updateProject(index, "image", event.target.value)} /></label>
                      <label className="upload-image-label">Upload cover image<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploadingProject === project.id} onChange={(event) => handleImageUpload(index, event)} /><span className="field-help">JPEG, PNG, or WebP · 25 MB maximum. CMYK JPEGs with an embedded profile are color-converted to sRGB for screen display.</span></label>
                      <div className="gallery-admin">
                        <div className="gallery-admin-heading">
                          <span>Project gallery <small>{project.media?.length || 0} / 30</small></span>
                        </div>
                        {!!project.media?.length && (
                          <div className="gallery-admin-grid">
                            {project.media.map((item, mediaIndex) => (
                              <div className="gallery-admin-item" key={`${item.url}-${mediaIndex}`}>
                                {item.type === "video"
                                  ? <video src={item.url} preload="none" muted />
                                  : <img src={item.url} alt={`Gallery item ${mediaIndex + 1}`} loading="lazy" decoding="async" />}
                                <span>{item.type}</span>
                                {item.type === "image" && item.url !== project.image && (
                                  <button type="button" onClick={() => {
                                    updateProject(index, "image", item.url);
                                    updateProject(index, "media", project.media.filter((galleryItem) => galleryItem.url !== item.url));
                                  }}>Set cover</button>
                                )}
                                <button className="gallery-remove-item" type="button" aria-label={`Remove gallery item ${mediaIndex + 1}`} onClick={() => updateProject(index, "media", project.media.filter((_, itemIndex) => itemIndex !== mediaIndex))}>×</button>
                              </div>
                            ))}
                          </div>
                        )}
                        <label className="upload-image-label">Add gallery images or videos<input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" multiple disabled={uploadingProject === project.id || (project.media?.length || 0) >= 30} onChange={(event) => handleGalleryUpload(index, event)} /><span className="field-help">JPEG, PNG, or WebP images up to 25 MB; MP4 or WebM videos up to 100 MB. CMYK JPEGs with an embedded profile are color-converted to sRGB. {uploadingProject === project.id ? "Uploading…" : ""}</span></label>
                      </div>
                      <button className="remove-project" type="button" disabled={uploadingProject === project.id} onClick={() => removeProject(index)}>Remove project</button>
                    </div>
                  ))}
                </div>
                <button className="save-button save-projects" type="button" disabled={saving} onClick={saveDraft}>Save portfolio <span>↗</span></button>
              </div>
            ) : activeTab === "testimonials" ? (
              <div className="editor-testimonials">
                <div className="project-editor-heading">
                  <h3>Client testimonials</h3>
                  <button className="add-project" type="button" disabled={(draft.testimonials || []).length >= 20} onClick={addTestimonial}>+ Add testimonial</button>
                </div>
                <p className="field-help testimonial-editor-help">Share only real client feedback. Quotes need a quote and client name; role and project are optional. Up to 20 testimonials.</p>
                {(draft.testimonials || []).map((testimonial, index) => (
                  <div className="testimonial-edit-card" key={testimonial.id || index}>
                    <h4>TESTIMONIAL {String(index + 1).padStart(2, "0")}</h4>
                    <label>Client quote<textarea rows="4" maxLength="800" value={testimonial.quote} onChange={(event) => updateTestimonial(index, "quote", event.target.value)} /></label>
                    <label>Client name<input maxLength="80" value={testimonial.name} onChange={(event) => updateTestimonial(index, "name", event.target.value)} /></label>
                    <label>Role or company<input maxLength="100" value={testimonial.role} onChange={(event) => updateTestimonial(index, "role", event.target.value)} /></label>
                    <label>Related project (optional)<input maxLength="100" value={testimonial.project} onChange={(event) => updateTestimonial(index, "project", event.target.value)} /></label>
                    <button className="remove-project" type="button" onClick={() => removeTestimonial(index)}>Remove testimonial</button>
                  </div>
                ))}
                <button className="save-button" type="button" disabled={saving} onClick={saveDraft}>Save testimonials <span>↗</span></button>
              </div>
            ) : (
              <div className="moderation-list">
                {!adminComments.length && <p className="no-comments">There are no portfolio comments yet.</p>}
                {adminComments.map((comment) => (
                  <article className="moderation-comment" key={comment.id}>
                    <p className="moderation-project">{comment.projectTitle} · {new Date(comment.createdAt).toLocaleString()}</p>
                    <strong>{comment.name}</strong>
                    <p>{comment.text}</p>
                    <button className="remove-project" type="button" onClick={() => deleteComment(comment.projectId, comment.id)}>Remove comment</button>
                  </article>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}
      {loginOpen && (
        <div className="editor-backdrop login-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setLoginOpen(false);
            setError("");
          }
        }}>
          <section className="login-panel" role="dialog" aria-modal="true" aria-labelledby="login-title">
            <div className="editor-header">
              <div><p className="eyebrow dark-eyebrow">Private studio access</p><h2 id="login-title">Sign <em>in</em></h2></div>
              <button className="icon-button" type="button" aria-label="Close sign in" onClick={() => { setLoginOpen(false); setError(""); }}>×</button>
            </div>
            {!adminConfigured && <p className="editor-error">Studio access has not been configured. Set ADMIN_PASSWORD_HASH and SESSION_SECRET in the server environment.</p>}
            {!mongoConfigured && <p className="editor-notice">MongoDB is not connected. Local development is using JSON files. Add your private MongoDB URI to `.env` to enable database storage.</p>}
            {error && <p className="editor-error" role="alert">{error}</p>}
            <form className="editor-form" onSubmit={login}>
              <label>Admin password<input type="password" autoComplete="current-password" required value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} /></label>
              <button className="save-button" type="submit" disabled={loginBusy || !adminConfigured}>{loginBusy ? "Signing in…" : "Sign in to studio"} <span>↗</span></button>
            </form>
          </section>
        </div>
      )}
      {loading && <div className="load-indicator" role="status">Loading studio content…</div>}
      {error && !editorOpen && !loginOpen && <div className="global-error" role="alert">{error}</div>}
      {toast && <div className="toast visible" role="status" aria-live="polite">{toast}</div>}
    </>
  );
}

export default App;
