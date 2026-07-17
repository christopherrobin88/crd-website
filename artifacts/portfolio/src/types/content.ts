export type ContentBlock =
  | { type: "cover"; asset: string }
  | { type: "page"; asset: string; group?: string }
  | { type: "spread"; left: string; right: string; group?: string };

export interface ProjectContent {
  slug: string;
  cover: ContentBlock;
  sequence: ContentBlock[];
  reviewed: boolean;
}
