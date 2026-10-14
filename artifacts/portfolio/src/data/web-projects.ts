export interface WebProject {
  id: string;
  title: string;
  discipline: string;
  description: string;
  introduction: string;
  status: string;
  liveUrl?: string;
  desktop: string;
  previewVideo?: string;
  mobile: string;
  details: { title: string; body: string; image?: string; alt?: string }[];
}

// Portfolio presentations supplied by Christopher, 12 October 2026.
// A screenshot demonstrates design work; it does not establish a live domain.
export const webProjects: WebProject[] = [
  {
    id: "riette-gara",
    title: "Riette Gara",
    discipline: "Artist website",
    description: "An online gallery for a Cape Town painter, built so the paintings come first and enquiring about a piece is easy.",
    introduction: "A website for Riette Gara's original oil paintings. The experience takes its cues from a gallery: quiet surroundings, room to look and a clear route to enquire about a piece.",
    status: "Live website",
    liveUrl: "https://www.riettegara.com/",
    desktop: "/work/web/riette-gara-desktop.webp",
    previewVideo: "/work/web/riette-gara-gallery-motion.mp4",
    mobile: "/work/web/riette-gara-mobile.webp",
    details: [
      { title: "An entrance, then the work.", body: "A restrained opening introduces the artist before the gallery moves into collections. Serif typography and a warm, dark canvas frame the work without competing with it." },
      { title: "A gallery with breathing room.", body: "Paintings are presented with their titles, medium, dimensions and availability. The same attention to pacing and captions that shapes an editorial spread carries onto the screen.", image: "/work/web/riette-gara-gallery.webp", alt: "Riette Gara gallery showing framed oil paintings with artwork details" },
      { title: "From viewing to enquiring.", body: "A dedicated enquiry view provides a clear next step for someone interested in an original painting or a commission.", image: "/work/web/riette-gara-enquiry.webp", alt: "Riette Gara enquiry view with contact information and a painting enquiry form" },
    ],
  },
  {
    id: "made-by-mike",
    title: "Made by Mike",
    discipline: "Maker website",
    description: "A showcase for handcrafted timber lighting, built around the warmth of the wood and the maker behind it.",
    introduction: "A website for handcrafted timber lighting. Product photography, generous typography and a simple structure bring the character of the pieces into focus.",
    status: "Built and launching soon.",
    desktop: "/work/web/made-by-mike-desktop.webp",
    previewVideo: "/work/web/made-by-mike-motion.mp4",
    mobile: "/work/web/made-by-mike-mobile.webp",
    details: [
      { title: "Let the material lead.", body: "The opening pairs a timber pendant with a short, expressive headline. The warm light and grain provide the visual character; the surrounding design gives them room." },
      { title: "A clear path through the collection.", body: "The lighting, making process and other work have distinct places in the navigation. A direct invitation to discuss a piece keeps the next step easy to find. The prototype uses clearly labelled concept imagery." },
      { title: "Considered on a smaller screen.", body: "The mobile layout gives the product its own space before the headline, description and collection link. The hierarchy changes with the screen while the identity holds together." },
    ],
  },
  {
    id: "behelm-web",
    title: "Behelm",
    discipline: "Consultancy website",
    description: "A monochrome website presentation for private security consulting, with a precise visual language.",
    introduction: "A website presentation for Behelm's private security consulting offer. Cape Town imagery, structured typography and navigation details establish a measured, discreet presence.",
    status: "Website design presentation",
    desktop: "/work/web/behelm-desktop.webp",
    mobile: "/work/web/behelm-mobile.webp",
    details: [
      { title: "Authority through restraint.", body: "A monochrome palette and direct headline make the offer clear. Fine grid lines and navigational references add detail around the photography rather than crowding the message." },
      { title: "Identity in context.", body: "The website shows the latest compass-style mark. The earlier BH monogram and logo system study are documented separately in the brand portfolio." },
    ],
  },
];
