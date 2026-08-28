import type { Project, NavLink } from "./types";

import { prisma } from "./prisma";

/* ---------- Navigation ---------- */
export const navigation: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Work",
    href: "/portfolio",
    children: [
      { label: "MUSIC VIDEOS", href: "/portfolio/music-videos" },
      { label: "COMMERCIALS", href: "/portfolio/commercials" },
      { label: "FILMS", href: "/portfolio/films" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/* ---------- Projects ---------- */
export const projects: Project[] = [
  // ── Music Videos ──────────────────────────────────
  {
    slug: "midnight-drive",
    title: "Midnight Drive",
    client: "Luna Ray",
    category: "MUSICVIDEO",
    thumbnail: "https://picsum.photos/seed/kaset-midnight/800/450",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://picsum.photos/seed/md-g1/600/400",
      "https://picsum.photos/seed/md-g2/600/400",
      "https://picsum.photos/seed/md-g3/600/400",
      "https://picsum.photos/seed/md-g4/600/400",
      "https://picsum.photos/seed/md-g5/600/400",
      "https://picsum.photos/seed/md-g6/600/400",
    ],
    cardType: "WIDE",
    year: 2025,
    description:
      "A cinematic music video exploring neon-lit streets after dark. Shot on location across three cities with anamorphic lenses.",
  },
  {
    slug: "neon-dreams",
    title: "Neon Dreams",
    client: "The Electric",
    category: "MUSICVIDEO",
    thumbnail: "https://picsum.photos/seed/kaset-neon/600/600",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://picsum.photos/seed/nd-g1/600/400",
      "https://picsum.photos/seed/nd-g2/600/400",
      "https://picsum.photos/seed/nd-g3/600/400",
      "https://picsum.photos/seed/nd-g4/600/400",
      "https://picsum.photos/seed/nd-g5/600/400",
      "https://picsum.photos/seed/nd-g6/600/400",
    ],
    cardType: "SQUARE",
    year: 2025,
    description:
      "Electric energy and pulsating visuals in this high-energy concert performance video. Featuring multi-cam stage setups.",
  },
  {
    slug: "gravity",
    title: "Gravity",
    client: "Sara Moon",
    category: "MUSICVIDEO",
    thumbnail: "https://picsum.photos/seed/kaset-gravity/800/450",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://picsum.photos/seed/gv-g1/600/400",
      "https://picsum.photos/seed/gv-g2/600/400",
      "https://picsum.photos/seed/gv-g3/600/400",
      "https://picsum.photos/seed/gv-g4/600/400",
      "https://picsum.photos/seed/gv-g5/600/400",
      "https://picsum.photos/seed/gv-g6/600/400",
    ],
    cardType: "WIDE",
    year: 2024,
    description:
      "An ethereal exploration of weightlessness and connection. Underwater and wirework stunts combined with slow-motion cinematography.",
  },
  {
    slug: "wildfire",
    title: "Wildfire",
    client: "Blaze",
    category: "MUSICVIDEO",
    thumbnail: "https://picsum.photos/seed/kaset-wildfire/600/600",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://picsum.photos/seed/wf-g1/600/400",
      "https://picsum.photos/seed/wf-g2/600/400",
      "https://picsum.photos/seed/wf-g3/600/400",
      "https://picsum.photos/seed/wf-g4/600/400",
      "https://picsum.photos/seed/wf-g5/600/400",
      "https://picsum.photos/seed/wf-g6/600/400",
    ],
    cardType: "SQUARE",
    year: 2024,
    description:
      "Raw desert energy meets controlled pyrotechnics. A visual story of untamed spirit and burning passion.",
  },
  {
    slug: "crystal-clear",
    title: "Crystal Clear",
    client: "DJ Prism",
    category: "MUSICVIDEO",
    thumbnail: "https://picsum.photos/seed/kaset-crystal/600/600",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://picsum.photos/seed/cc-g1/600/400",
      "https://picsum.photos/seed/cc-g2/600/400",
      "https://picsum.photos/seed/cc-g3/600/400",
      "https://picsum.photos/seed/cc-g4/600/400",
      "https://picsum.photos/seed/cc-g5/600/400",
      "https://picsum.photos/seed/cc-g6/600/400",
    ],
    cardType: "SQUARE",
    year: 2024,
    description:
      "Refracted light and prismatic visuals. A dance-driven narrative shot through custom glass and crystal rigs.",
  },
  {
    slug: "echoes",
    title: "Echoes",
    client: "The Void",
    category: "MUSICVIDEO",
    thumbnail: "https://picsum.photos/seed/kaset-echoes/800/450",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://picsum.photos/seed/ec-g1/600/400",
      "https://picsum.photos/seed/ec-g2/600/400",
      "https://picsum.photos/seed/ec-g3/600/400",
      "https://picsum.photos/seed/ec-g4/600/400",
      "https://picsum.photos/seed/ec-g5/600/400",
      "https://picsum.photos/seed/ec-g6/600/400",
    ],
    cardType: "WIDE",
    year: 2023,
    description:
      "Dark atmospheric visuals in abandoned industrial spaces. A haunting piece driven by shadow and sound.",
  },

  // ── COMMERCIALs ───────────────────────────────────
  {
    slug: "run-beyond",
    title: "Run Beyond",
    client: "Nike",
    category: "COMMERCIAL",
    thumbnail: "https://picsum.photos/seed/kaset-nike/800/450",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://picsum.photos/seed/rb-g1/600/400",
      "https://picsum.photos/seed/rb-g2/600/400",
      "https://picsum.photos/seed/rb-g3/600/400",
      "https://picsum.photos/seed/rb-g4/600/400",
      "https://picsum.photos/seed/rb-g5/600/400",
      "https://picsum.photos/seed/rb-g6/600/400",
    ],
    cardType: "WIDE",
    year: 2025,
    description:
      "A campaign spot celebrating athletes who push limits. Shot across mountain trails and urban cityscapes.",
  },
  {
    slug: "galaxy-launch",
    title: "Galaxy S30 Launch",
    client: "Samsung",
    category: "COMMERCIAL",
    thumbnail: "https://picsum.photos/seed/kaset-samsung/600/600",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://picsum.photos/seed/gl-g1/600/400",
      "https://picsum.photos/seed/gl-g2/600/400",
      "https://picsum.photos/seed/gl-g3/600/400",
      "https://picsum.photos/seed/gl-g4/600/400",
      "https://picsum.photos/seed/gl-g5/600/400",
      "https://picsum.photos/seed/gl-g6/600/400",
    ],
    cardType: "SQUARE",
    year: 2025,
    description:
      "Product launch FILM for Samsungs flagship. Macro cinematography and motion-control rigs showcase every detail.",
  },
  {
    slug: "summer-vibes",
    title: "Summer Vibes",
    client: "Coca-Cola",
    category: "COMMERCIAL",
    thumbnail: "https://picsum.photos/seed/kaset-coke/800/450",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://picsum.photos/seed/sv-g1/600/400",
      "https://picsum.photos/seed/sv-g2/600/400",
      "https://picsum.photos/seed/sv-g3/600/400",
      "https://picsum.photos/seed/sv-g4/600/400",
      "https://picsum.photos/seed/sv-g5/600/400",
      "https://picsum.photos/seed/sv-g6/600/400",
    ],
    cardType: "WIDE",
    year: 2024,
    description:
      "Sun-drenched coastal campaign capturing the spirit of summer. High-speed camera work and drone aerials.",
  },
  {
    slug: "electric-dreams",
    title: "Electric Dreams",
    client: "Mercedes-Benz",
    category: "COMMERCIAL",
    thumbnail: "https://picsum.photos/seed/kaset-merc/600/600",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://picsum.photos/seed/ed-g1/600/400",
      "https://picsum.photos/seed/ed-g2/600/400",
      "https://picsum.photos/seed/ed-g3/600/400",
      "https://picsum.photos/seed/ed-g4/600/400",
      "https://picsum.photos/seed/ed-g5/600/400",
      "https://picsum.photos/seed/ed-g6/600/400",
    ],
    cardType: "SQUARE",
    year: 2024,
    description:
      "Luxury EV campaign blending cutting-edge CGI environments with real-world driving footage.",
  },

  // ── FILMs ─────────────────────────────────────────
  {
    slug: "the-last-frame",
    title: "The Last Frame",
    client: "Independent",
    category: "FILM",
    thumbnail: "https://picsum.photos/seed/kaset-lastframe/800/450",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://picsum.photos/seed/lf-g1/600/400",
      "https://picsum.photos/seed/lf-g2/600/400",
      "https://picsum.photos/seed/lf-g3/600/400",
      "https://picsum.photos/seed/lf-g4/600/400",
      "https://picsum.photos/seed/lf-g5/600/400",
      "https://picsum.photos/seed/lf-g6/600/400",
    ],
    cardType: "WIDE",
    year: 2024,
    description:
      "A short FILM about a cinematographer revisiting the locations of their most iconic shots. Winner of multiple festival awards.",
  },
  {
    slug: "between-shadows",
    title: "Between Shadows",
    client: "Independent",
    category: "FILM",
    thumbnail: "https://picsum.photos/seed/kaset-shadows/600/600",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://picsum.photos/seed/bs-g1/600/400",
      "https://picsum.photos/seed/bs-g2/600/400",
      "https://picsum.photos/seed/bs-g3/600/400",
      "https://picsum.photos/seed/bs-g4/600/400",
      "https://picsum.photos/seed/bs-g5/600/400",
      "https://picsum.photos/seed/bs-g6/600/400",
    ],
    cardType: "SQUARE",
    year: 2023,
    description:
      "A noir documentary following street photographers who work only in the hour before dawn.",
  },
];

/* ---------- Query helpers (PascalCase per convention) ---------- */

export async function CreateProject() {
  prisma.project.createMany({
    data: projects,
  });
}

export function GetProjectsByCategory(
  category: Project["category"],
): Project[] {
  return projects.filter((project) => project.category === category);
}

export function GetProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function GetFeaturedProjects(count: number = 4): Project[] {
  return projects.slice(0, count);
}

export function GetAllSlugs(): string[] {
  return projects.map((project) => project.slug);
}
