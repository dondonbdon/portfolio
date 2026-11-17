export type BodyKind =
  | "star"
  | "giant"
  | "crystal"
  | "ice"
  | "station"
  | "moon"
  | "asteroid"
  | "archive";

export interface ProjectLink {
  github?: string;
  live?: string;
  store?: string;
}

export interface ProjectMedia {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectChild {
  slug: string;
  name: string;
  tagline: string;
  accent?: `#${string}`;
}

export interface Project {
  slug: string;
  name: string;
  subtitle: string;
  year: number;
  era: string;
  kind: BodyKind;
  featured: boolean;
  /** Distance from galactic center in world units (higher = older/outer rim) */
  orbitRadius: number;
  /** Base polar angle in radians around the galactic plane */
  orbitAngle: number;
  /** Vertical offset from galactic plane */
  elevation: number;
  /** Visual radius of the primary 3D body */
  bodyRadius: number;
  tagline: string;
  summary: string;
  story: string[];
  highlights: string[];
  stack: string[];
  visibility: "public" | "private";
  links?: ProjectLink;
  media?: ProjectMedia[];
  color: `#${string}`;
  secondaryColor: `#${string}`;
  children?: ProjectChild[];
}

/**
 * Featured celestial bodies ordered along the inward flight path:
 * 2023 Outer Rim (Origins Belt) -> 2025/2026 Inner System -> 2026 Galactic Core (Spotly)
 */
export const featuredProjects: Project[] = [
  {
    slug: "origins-belt",
    name: "2023 Origins Belt",
    subtitle: "Early Android & Firebase Fleet",
    year: 2023,
    era: "2023 · OUTER RIM",
    kind: "asteroid",
    featured: true,
    orbitRadius: 21,
    orbitAngle: -2.4,
    elevation: 0.4,
    bodyRadius: 1.35,
    tagline:
      "Five rapid-fire Android applications that forged my product instincts — including Swift, the direct ancestor of Spotly.",
    summary:
      "An asteroid belt of five distinct 2023 mobile products built with Java, Firebase Realtime Database, Firestore, and ExoPlayer.",
    story: [
      "Every system starts somewhere. In 2023, I shipped five ambitious Android apps back-to-back to master real-time data sync, media pipelines, authentication, and mobile commerce.",
      "Elixer explored live streaming, host calls, event ticketing, and ephemeral cameras. Oslea blended social discovery with real-time messaging and video playback. Paoz digitized cell-group attendance and leadership reporting, while IdealZW tackled local e-commerce.",
      "And Swift — originally prototyped as 'Swift Super App' with Captain dispatch and Bite checkout flows — planted the seed that later evolved into Spotly at the galactic core.",
    ],
    highlights: [
      "Real-time chat, live audio/video calls, and camera capture pipelines",
      "Firebase Auth, Firestore, Realtime Database, Crashlytics & Storage",
      "Swift Super App prototype directly inspired Spotly's multi-service core",
    ],
    stack: ["Java", "Android SDK", "Firebase", "Firestore", "ExoPlayer", "Google Maps"],
    visibility: "private",
    media: [
      {
        src: "/media/origins.jpg",
        alt: "2023 Origins Belt — five glowing hero asteroids orbiting toward the core",
        caption: "Five foundational Android builds connected by the Swift → Spotly evolution beam",
      },
    ],
    color: "#fb7185",
    secondaryColor: "#f59e0b",
    children: [
      {
        slug: "swift",
        name: "Swift",
        tagline: "Early super-app & Bite delivery prototype — precursor to Spotly",
        accent: "#f59e0b",
      },
      {
        slug: "elixer",
        name: "Elixer",
        tagline: "Social media, live streaming, host calls, DMs & event ticketing",
        accent: "#38bdf8",
      },
      {
        slug: "oslea",
        name: "Oslea",
        tagline: "Ephemeral camera, video discovery & chat-shop mobile app",
        accent: "#10b981",
      },
      {
        slug: "paoz",
        name: "Paoz",
        tagline: "Organization, cell-group & attendance command app",
        accent: "#fb7185",
      },
      {
        slug: "idealzw",
        name: "IdealZW",
        tagline: "Local e-commerce marketplace & product catalog",
        accent: "#e2e8f0",
      },
    ],
  },
  {
    slug: "stm32-utils",
    name: "stm32-utils",
    subtitle: "Bare-Metal Embedded Firmware",
    year: 2025,
    era: "2025 · SILICON ORBIT",
    kind: "moon",
    featured: true,
    orbitRadius: 17,
    orbitAngle: -1.35,
    elevation: -1.1,
    bodyRadius: 1.25,
    tagline:
      "Low-level C drivers and a custom BODMAS expression evaluator running directly on STM32F303 silicon.",
    summary:
      "Hardware-interfacing C utilities for STM32F303RETX microcontrollers covering LCD driving, keypad matrix debouncing, servo PWM, and math parsing.",
    story: [
      "Stepping down from high-level app frameworks to bare-metal registers changes how you think about memory, timing, and state machines.",
      "Built for the STM32F303RETX target using STM32 HAL, this utility library wraps custom 16x2/character LCD drivers, matrix keypad scanning with hardware debounce, LED bar telemetry, servo control, and UART retargeting.",
      "At its heart sits a standalone C BODMAS expression evaluator built to parse and compute arithmetic expressions directly on constrained microcontroller RAM.",
    ],
    highlights: [
      "Deterministic keypad matrix scanning and multi-channel debounce",
      "Custom LCD driver, servo actuation, and LED bar visualizers",
      "Embedded C BODMAS parser executing without heap bloat",
    ],
    stack: ["C", "STM32F303", "STM32 HAL", "Embedded Systems", "UART / PWM"],
    visibility: "private",
    media: [
      {
        src: "/media/stm32-utils.jpg",
        alt: "STM32-utils circuit moon with illuminated copper and cyan traces",
        caption: "Procedural PCB trace topology representing bare-metal driver layers",
      },
    ],
    color: "#38bdf8",
    secondaryColor: "#f59e0b",
  },
  {
    slug: "payment-processor",
    name: "payment-processor",
    subtitle: "Event-Driven Clearing Station",
    year: 2026,
    era: "2026 · INFRASTRUCTURE",
    kind: "station",
    featured: true,
    orbitRadius: 14,
    orbitAngle: -0.3,
    elevation: 1.2,
    bodyRadius: 1.5,
    tagline:
      "Fault-tolerant Spring Boot payment orchestration engine with Kafka event streams, Resilience4j, and signed Paynow webhooks.",
    summary:
      "Standalone microservice handling payment lifecycle creation, cryptographic webhook verification, expiry scheduling, and Kafka domain events.",
    story: [
      "Financial infrastructure cannot afford silent failures or duplicate state transitions. payment-processor isolates gateway complexity behind a clean, event-driven microservice.",
      "Incoming payment intents are validated, assigned collision-free references, persisted to MongoDB, and dispatched to Paynow through resilient HTTP clients guarded by Resilience4j.",
      "Signed webhooks and scheduled expiry sweeps emit strongly typed Kafka events — PaymentCreated, PaymentCompleted, PaymentFailed, PaymentExpired — so downstream platforms react asynchronously.",
    ],
    highlights: [
      "Cryptographic webhook signature verification & idempotent state updates",
      "Apache Kafka event bus decoupling payment settlement from consumers",
      "Automated expiry scheduler & Resilience4j fault tolerance",
    ],
    stack: ["Java", "Spring Boot", "Apache Kafka", "MongoDB", "Resilience4j", "Paynow"],
    visibility: "private",
    media: [
      {
        src: "/media/payment-processor.jpg",
        alt: "Orbital financial clearing station with synchronized amber and emerald event beams",
        caption: "Event-driven Kafka payment pipeline & webhook verification gates",
      },
    ],
    color: "#10b981",
    secondaryColor: "#f59e0b",
  },
  {
    slug: "wos-util",
    name: "wos-util",
    subtitle: "Tactical Alliance War Room",
    year: 2026,
    era: "2026 · TACTICAL WEB",
    kind: "ice",
    featured: true,
    orbitRadius: 11.2,
    orbitAngle: 0.75,
    elevation: -0.7,
    bodyRadius: 1.45,
    tagline:
      "Interactive spatial planners for Whiteout Survival — Hive layouts, SvS castle grids, Foundry formations, and Rally timing.",
    summary:
      "Next.js 16 + Zustand tactical web suite and Spring backend for coordinating large-scale alliance warfare.",
    story: [
      "Coordinating dozens of players across timezones during State vs. State or Foundry battles breaks down fast in static spreadsheets.",
      "wos-util turns chaotic alliance coordination into real-time interactive canvas planners: Hive territory packing, Castle grey-zone wrapping, Rally timer synchronization, and FDT telemetry.",
      "Built on Next.js 16, React 19, Zustand state stores, and canvas export pipelines alongside a dedicated backend hosted on Fly.io.",
    ],
    highlights: [
      "Interactive Hive, Castle SvS, Foundry & Rally tactical planners",
      "High-frequency canvas state powered by Zustand & reselect selectors",
      "Exportable alliance battle plans via html2canvas & jsPDF",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Zustand", "Java", "Fly.io"],
    visibility: "private",
    media: [
      {
        src: "/media/wos-util.jpg",
        alt: "Frozen tactical planet with hexagonal fortress grids and frost telemetry",
        caption: "Arctic hexagonal sector & fortress positioning grid",
      },
    ],
    color: "#7dd3fc",
    secondaryColor: "#e0f2fe",
  },
  {
    slug: "flashpdf",
    name: "FlashPDF",
    subtitle: "AI Knowledge & Spaced Repetition",
    year: 2026,
    era: "2026 · AI ENGINE",
    kind: "crystal",
    featured: true,
    orbitRadius: 8.6,
    orbitAngle: 1.9,
    elevation: 0.85,
    bodyRadius: 1.4,
    tagline:
      "Refracting dense PDFs into structured knowledge graphs, OCR-verified chunks, RAG chat, and adaptive flashcards.",
    summary:
      "Full-stack AI study platform combining Next.js 16, Java Spring Boot, OCR layout analysis, vector embeddings, Gemini AI, and Stripe billing.",
    story: [
      "Most PDF-to-flashcard tools blindly feed raw text into an LLM and hallucinate half the curriculum. FlashPDF treats document understanding as a real ingestion pipeline.",
      "Uploaded PDFs flow through page rendering, OCR & layout analysis, semantic chunking, vector embeddings, and knowledge-graph extraction before generating grounded quizzes and visual diagrams.",
      "Students can interrogate their documents via RAG chat, drill decks with a spaced-repetition scheduler, and manage subscriptions via Stripe.",
    ],
    highlights: [
      "Multi-stage ingestion: OCR, layout analysis, semantic chunking & vector search",
      "Knowledge-driven flashcard generation, exam prep & RAG document chat",
      "Spring Boot job queue orchestrator + Next.js 16 & Radix UI frontend",
    ],
    stack: ["Next.js 16", "Spring Boot", "Gemini AI", "Vector Embeddings", "OCR", "Stripe"],
    visibility: "private",
    media: [
      {
        src: "/media/flashpdf.jpg",
        alt: "Refractive crystal shards transforming document planes into an AI knowledge graph",
        caption: "Document ingestion & knowledge-graph refraction",
      },
    ],
    color: "#38bdf8",
    secondaryColor: "#bae6fd",
  },
  {
    slug: "hacia",
    name: "Hacia Platform (v2 → v3)",
    subtitle: "Reactive Full-Stack Revamp",
    year: 2026,
    era: "2026 · REACTIVE WEB",
    kind: "giant",
    featured: true,
    orbitRadius: 6.2,
    orbitAngle: 3.15,
    elevation: -0.45,
    bodyRadius: 1.65,
    tagline:
      "From a battle-tested Spring Boot v2 backend to a sleek Next.js & Java 25 WebFlux reactive platform with MongoDB.",
    summary:
      "Complete architectural evolution of a multi-portal educational web platform from v2 APIs into a reactive Next.js + Spring WebFlux v3 system.",
    story: [
      "Great platforms outgrow their first architecture. Hacia began with a rich v2 backend handling media galleries, events, forms, and academic workflows.",
      "In v3, the entire stack was re-engineered from the ground up: a non-blocking Reactive Spring WebFlux backend running Java 25 and Reactive MongoDB paired with a modern Next.js App Router frontend.",
      "The ringed gas giant visualizes that duality — the dense v3 core surrounded by the v2 service ring that paved the way.",
    ],
    highlights: [
      "Non-blocking Spring Boot WebFlux + Reactive MongoDB on Java 25",
      "Multi-campus portals, admin gallery workflows, and news publishing",
      "Next.js App Router frontend with Tailwind v4 & Framer Motion",
    ],
    stack: ["Next.js", "TypeScript", "Java 25", "Spring WebFlux", "Reactive MongoDB", "Docker"],
    visibility: "private",
    media: [
      {
        src: "/media/hacia.jpg",
        alt: "Ringed orbital platform representing Hacia v2 to v3 architectural evolution",
        caption: "v3 reactive core encircled by the v2 service architecture",
      },
    ],
    color: "#34d399",
    secondaryColor: "#fbbf24",
  },
  {
    slug: "spotly",
    name: "Spotly",
    subtitle: "Galactic Core · Multi-Country Super-App",
    year: 2026,
    era: "2026 · GALACTIC CORE",
    kind: "star",
    featured: true,
    orbitRadius: 0,
    orbitAngle: 0,
    elevation: 0,
    bodyRadius: 2.35,
    tagline:
      "A unified Ride, Send, and Bite super-app ecosystem spanning Android, iOS, Web SDKs, and a reactive Spring backend.",
    summary:
      "Flagship multi-country platform powering Customer, Driver, Merchant, Admin, and Super-Admin applications across shared contract-verified SDKs.",
    story: [
      "Spotly sits at the center of the galaxy because every discipline I've learned converges here: native mobile architecture, real-time dispatch telemetry, cross-platform contract parity, and multi-currency finance.",
      "Built as a cohesive ecosystem rather than a single app, Spotly unites Ride (passenger mobility), Send (parcel fulfilment), and Bite (merchant & food delivery) across dedicated Customer, Driver, Merchant, and Operations apps.",
      "Shared Kotlin Multiplatform/Android core SDKs, Swift iOS parity, Web SDKs, and a reactive Spring backend synchronize around unified contract manifests — tracing its lineage all the way back to 2023's Swift prototype.",
    ],
    highlights: [
      "Three orbiting verticals: Spotly Ride, Spotly Send, and Spotly Bite",
      "Four specialized client surfaces: Super, Driver, Merchant, and Admin",
      "Native Android (Jetpack Compose), iOS (Swift), Web SDK, and Spring reactive backend",
    ],
    stack: [
      "Kotlin",
      "Jetpack Compose",
      "Swift",
      "TypeScript",
      "Spring WebFlux",
      "Firebase & Maps",
    ],
    visibility: "private",
    media: [
      {
        src: "/media/spotly.jpg",
        alt: "Spotly multi-service mobility and delivery trajectory visualization",
        caption: "Multi-vertical Ride, Send & Bite dispatch network",
      },
    ],
    color: "#f59e0b",
    secondaryColor: "#38bdf8",
    children: [
      { slug: "spotly-ride", name: "Spotly Ride", tagline: "Real-time passenger mobility & verified road routing", accent: "#f59e0b" },
      { slug: "spotly-send", name: "Spotly Send", tagline: "Tracked parcel fulfilment & chain-of-custody proof", accent: "#38bdf8" },
      { slug: "spotly-bite", name: "Spotly Bite", tagline: "Merchant storefront & courier basket delivery", accent: "#10b981" },
      { slug: "app-driver", name: "Driver App", tagline: "Foreground location & dispatch cockpit", accent: "#fbbf24" },
      { slug: "app-merchant", name: "Merchant App", tagline: "Live order intake & catalog ops", accent: "#34d399" },
      { slug: "app-admin", name: "Admin Console", tagline: "Operations & fleet oversight", accent: "#7dd3fc" },
      { slug: "app-super", name: "Customer Super-App", tagline: "Unified Ride, Send & Bite consumer client", accent: "#f8fafc" },
    ],
  },
];

export const archiveProjects: Project[] = [
  {
    slug: "kdym",
    name: "KDYM",
    subtitle: "Camp & Youth Command Center",
    year: 2026,
    era: "2026 · ARCHIVE",
    kind: "archive",
    featured: false,
    orbitRadius: 25.5,
    orbitAngle: 0.4,
    elevation: 2.2,
    bodyRadius: 0.4,
    tagline: "Jetpack Compose camp hub with tribes, live scoring, polls, church directories & command overlays.",
    summary: "Public Jetpack Compose Android app powering camp announcements, tribe scores, group chat, polls, and real-time command center overlays.",
    story: [
      "Built in Kotlin with Jetpack Compose and Firebase Cloud Messaging, KDYM acts as a real-time digital hub for large youth camps.",
      "Includes tribe scoreboards, live announcements, urgent global overlays, group moderation, and offline-friendly local persistence.",
    ],
    highlights: ["Jetpack Compose UI", "FCM real-time overlays", "Tribe & church management"],
    stack: ["Kotlin", "Jetpack Compose", "Firebase", "FCM"],
    visibility: "public",
    links: { github: "https://github.com/dondonbdon/kdym" },
    color: "#38bdf8",
    secondaryColor: "#94a3b8",
  },
  {
    slug: "achieverfarm",
    name: "AchieverFarm",
    subtitle: "Agri-Commerce Platform & Android App",
    year: 2026,
    era: "2026 · ARCHIVE",
    kind: "archive",
    featured: false,
    orbitRadius: 26.2,
    orbitAngle: 1.15,
    elevation: -1.8,
    bodyRadius: 0.4,
    tagline: "Full-stack agricultural marketplace with Java backend, custom Android SDK, and Compose storefront.",
    summary: "End-to-end agricultural commerce system pairing a modular Java backend with a Jetpack Compose Android app and Retrofit SDK.",
    story: [
      "Designed to connect agricultural producers with buyers, complete with dynamic unit pricing, inventory states, promo codes, wallet/payment methods, and order tracking.",
    ],
    highlights: ["Modular Java backend & Android SDK", "Cart, promo codes & multi-wallet checkout"],
    stack: ["Java", "Kotlin", "Jetpack Compose", "Retrofit"],
    visibility: "public",
    links: { github: "https://github.com/dondonbdon/achieverfarm" },
    color: "#10b981",
    secondaryColor: "#94a3b8",
  },
  {
    slug: "team-john-neara-robocode",
    name: "Robocode Tank Royale Bot",
    subtitle: "Autonomous Combat AI",
    year: 2025,
    era: "2025 · ARCHIVE",
    kind: "archive",
    featured: false,
    orbitRadius: 25.8,
    orbitAngle: 2.05,
    elevation: 1.6,
    bodyRadius: 0.4,
    tagline: "Competitive Java tank AI and tournament host for Robocode Tank Royale.",
    summary: "Autonomous Java combat bot implementing predictive targeting, movement heuristics, and local competition hosting.",
    story: [
      "Built for competitive Robocode Tank Royale arenas, balancing radar sweeps, gun cooling math, and evasive trajectories under strict per-turn microsecond budgets.",
    ],
    highlights: ["Heuristic targeting & evasion", "Full Tank Royale tournament host config"],
    stack: ["Java", "Robocode Tank Royale", "Algorithms"],
    visibility: "public",
    links: { github: "https://github.com/dondonbdon/team-john-neara-robocode" },
    color: "#f59e0b",
    secondaryColor: "#94a3b8",
  },
  {
    slug: "spring-starter",
    name: "spring-starter",
    subtitle: "Production Spring Boot Template",
    year: 2025,
    era: "2025 · ARCHIVE",
    kind: "archive",
    featured: false,
    orbitRadius: 26.5,
    orbitAngle: 2.85,
    elevation: -2.0,
    bodyRadius: 0.4,
    tagline: "Reusable Spring Boot foundation with JWT rotation, Redis token blacklisting, MongoDB, and Docker.",
    summary: "Battle-tested Spring Boot starter blueprint powering multiple downstream backend services.",
    story: [
      "Eliminates boilerplate across Java backends by pre-wiring JWT auth, password reset mailers, scheduled Redis token blacklisting, and Docker Compose orchestration.",
    ],
    highlights: ["JWT + Redis blacklist scheduler", "MongoDB & Docker Compose ready"],
    stack: ["Java", "Spring Boot", "MongoDB", "Redis", "Docker"],
    visibility: "public",
    links: { github: "https://github.com/dondonbdon/spring-starter" },
    color: "#34d399",
    secondaryColor: "#94a3b8",
  },
  {
    slug: "boundless",
    name: "Boundless",
    subtitle: "Community & Campaign Platform",
    year: 2026,
    era: "2026 · ARCHIVE",
    kind: "archive",
    featured: false,
    orbitRadius: 25.0,
    orbitAngle: -1.1,
    elevation: 2.4,
    bodyRadius: 0.4,
    tagline: "Social campaigns, recurring rooms, chat access policies, and a paired Android client.",
    summary: "Java platform and Android SDK for topic rooms, voting, campaigns, and real-time community feeds.",
    story: [
      "Explores rich domain modeling across chat rooms, recurring events, voting mechanics, and custom Android post decorators.",
    ],
    highlights: ["Campaign & room domain engine", "Custom Retrofit Android SDK"],
    stack: ["Java", "Spring Boot", "Android", "Retrofit"],
    visibility: "private",
    color: "#7dd3fc",
    secondaryColor: "#94a3b8",
  },
  {
    slug: "wos-bot",
    name: "wos-bot",
    subtitle: "Discord Alliance Automation",
    year: 2025,
    era: "2025 · ARCHIVE",
    kind: "archive",
    featured: false,
    orbitRadius: 26.0,
    orbitAngle: -0.35,
    elevation: -1.6,
    bodyRadius: 0.4,
    tagline: "Python Discord bot automating alliance schedules, event reminders, and gift code redemption.",
    summary: "Public Python automation bot built for Whiteout Survival alliances before evolving into the full wos-util web suite.",
    story: [
      "Started as a Discord automation companion to eliminate manual gift-code entry and missed alliance event timers.",
    ],
    highlights: ["Automated gift code redemption", "Event countdowns & alliance ops"],
    stack: ["Python", "Discord.py", "Automation"],
    visibility: "public",
    links: { github: "https://github.com/dondonbdon/wos-bot" },
    color: "#bae6fd",
    secondaryColor: "#94a3b8",
  },
  {
    slug: "cs-9618",
    name: "CS 9618 Concepts",
    subtitle: "Algorithm & Data Structure Lab",
    year: 2023,
    era: "2023 · ARCHIVE",
    kind: "archive",
    featured: false,
    orbitRadius: 26.8,
    orbitAngle: -2.0,
    elevation: 1.9,
    bodyRadius: 0.4,
    tagline: "Clean Python implementations of binary trees, recursion, stacks, queues, sorting & search.",
    summary: "Educational Python reference covering CAIE 9618 Paper 4 core data structures and traversal algorithms.",
    story: [
      "A foundational algorithms repository implementing binary tree traversals, OOP patterns, sorting/searching, and file handling from first principles.",
    ],
    highlights: ["Binary tree pre/in/post-order traversals", "Stacks, queues & recursion"],
    stack: ["Python", "Data Structures", "Algorithms"],
    visibility: "public",
    links: { github: "https://github.com/dondonbdon/CS-9618-A-Level-Concepts" },
    color: "#e2e8f0",
    secondaryColor: "#94a3b8",
  },
];

export const allProjects: Project[] = [...featuredProjects, ...archiveProjects];

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}
