export type ProjectCategory = "MUSICVIDEO" | "COMMERCIAL" | "FILM";
export type CardType = "SQUARE" | "WIDE";

export interface Project {
  id?: string;
  slug: string;
  title: string;
  client: string;
  category: ProjectCategory;
  thumbnail?: string | null;
  youtubeUrl?: string | null;
  gallery: string[];
  cardType: CardType;
  year?: number | null;
  description?: string | null;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}
