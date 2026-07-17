---
name: "Christopher Robin Design"
category: Brands
surface: web
colors:
  parchment: "#f4ecd9"
  parchment-surface: "#f4ecd9"
  dark-slate: "#202a30"
  darker-slate: "#273642"
  mustard: "#c39b46"
  olive-primary: "#86a05c"
  olive-light: "#9cb15d"
  olive-deep: "#5c8165"
---

# Christopher Robin Design

> Category: Brands
> Surface: web

*Design that grows from strategy, craft and experience.*

## Color Palette

| Role | Name | Hex | Usage |
| --- | --- | --- | --- |
| background | Parchment | `#f4ecd9` | page canvas — warm cream |
| foreground | Dark Slate | `#202a30` | primary ink, massive H1 anchors, navigation |
| accent | Mustard | `#c39b46` | italic emphasis words, hairline rules, CTA buttons |
| motif | Olive Primary | `#86a05c` | botanical foliage assets, secondary highlights |

## Typography
- **Display:** Playfair Display — weights 400, 600, 800, 900 (must include italic variants)
- **Body:** DM Sans — weights 400, 600, 700

## Voice & Tone

- **Adjectives:** Editorial, Calm, Human, Precise, Confident
- **Tone:** Quiet confidence. Avoids hype, jargon and marketing clichés in favour of thoughtful, intelligent communication — editorial rather than advertising, strategic rather than trendy, calm rather than loud.

### Messaging pillars
- Design that grows from strategy, craft and experience.
- Good design is half the job. Delivering it, correctly, every time, is the other half.
- One system from brief to delivery.

### Vocabulary
- **Use:** craft, discipline, delivery, system, consistency
- **Avoid:** game-changing, cutting-edge, world-class, disruptive, excessive exclamation marks

## Imagery

- **Style:** Restrained editorial photography and fine botanical line illustration set on a warm parchment ground — no generic stock-photo lifestyle imagery.
- **Subjects:** magazine cover photography, botanical/leaf linework illustration, editorial spreads, retail and packaging product photography, studio/founder portraiture
- **Treatment:** Cropped tight, presented in bordered parchment mounts with soft drop shadows; leaf motifs anchor page corners and the footer, reinforcing the studio's 'grows' metaphor.
- **Avoid:** generic stock photography, flat corporate iconography, gradient-heavy tech imagery

## Layout

- **Radius:** 0px
- **Border weight:** 1px
- **Spacing:** 4px base unit (Tailwind default); generous 96-160px vertical section padding

## Posture Rules
- **Fluid Scales:** Use CSS clamp() for all heading typography to ensure smooth viewport scaling.
- **Editorial Measure:** Force a max-width of 65ch on all paragraph body copy.
- **Micro-Motion:** Utilize modern CSS `animation-timeline: view()` for native, buttery-smooth scroll reveals on botanical assets and case study images. 
- Zero border-radius — sharp, editorial square corners on all elements.