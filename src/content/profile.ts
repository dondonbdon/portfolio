export interface SocialLink {
  label: string;
  href: string;
  handle: string;
}

export interface Profile {
  name: string;
  handle: string;
  monogram: string;
  title: string;
  tagline: string;
  bio: string[];
  location: string;
  email: string;
  availability: string;
  skills: {
    group: string;
    items: string[];
  }[];
  socials: SocialLink[];
}

export const profile: Profile = {
  name: "Brandon",
  handle: "@dondonbdon",
  monogram: "BDN",
  title: "Systems, Mobile & Full-Stack Engineer",
  tagline:
    "Building multi-platform ecosystems — from bare-metal STM32 firmware and native Android/iOS apps to reactive Spring backends and AI pipelines.",
  bio: [
    "My engineering journey started in 2023 shipping native Android apps on Firebase — live streaming, ephemeral cameras, local marketplaces, and an early super-app prototype called Swift.",
    "Since then, that curiosity expanded across the full stack: bare-metal C on STM32 microcontrollers, event-driven Kafka payment infrastructure, Next.js + Spring WebFlux platforms, AI document knowledge graphs, and multi-country mobility & delivery ecosystems.",
    "Every project in this galaxy represents a real system engineered end-to-end — each one orbiting closer to the core as the architecture matured.",
  ],
  location: "Harare / Remote",
  email: "hello@dondonbdon.dev", // Update with your preferred contact email
  availability: "Open to ambitious engineering & product collaborations",
  skills: [
    {
      group: "Mobile & Client",
      items: ["Kotlin", "Jetpack Compose", "Swift / iOS", "Next.js", "TypeScript", "Three.js / R3F"],
    },
    {
      group: "Backend & Distributed",
      items: ["Java 25", "Spring WebFlux", "Apache Kafka", "MongoDB", "Redis", "Firebase"],
    },
    {
      group: "AI, Data & Embedded",
      items: ["RAG & Vector Search", "OCR Pipelines", "STM32 HAL (C)", "Docker", "GLSL Shaders"],
    },
  ],
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/dondonbdon",
      handle: "github.com/dondonbdon",
    },
  ],
};
