export function SketchLine({ className = "" }: { className?: string }) {
  return <svg viewBox="0 0 260 24" className={`crd-sketch-line ${className}`} aria-hidden="true">
    <path pathLength="1" d="M4 12 C54 7 91 15 134 10 S210 9 254 13" />
    <path pathLength="1" d="M10 17 C62 14 117 18 169 14 S220 15 248 17" />
  </svg>;
}

export function SketchArrow({ className = "" }: { className?: string }) {
  return <svg viewBox="0 0 130 65" className={`crd-sketch-arrow ${className}`} aria-hidden="true">
    <path d="M6 53 C19 9 67 6 111 28 M97 12 L114 29 L91 32" />
    <path d="M10 53 C23 12 66 10 105 28" opacity=".25" />
  </svg>;
}
