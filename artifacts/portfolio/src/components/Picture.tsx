export interface Pic {
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
}

type PictureProps = {
  pic: Pic;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  decoding?: "async" | "sync" | "auto";
  sizes?: string;
};

/**
 * Renders a responsive <picture> with WebP sources + original-format fallback,
 * produced at build time by vite-imagetools (`?format=webp;jpg&as=picture`).
 */
export function Picture({
  pic,
  alt,
  className,
  loading = "lazy",
  fetchPriority,
  decoding = "async",
  sizes,
}: PictureProps) {
  return (
    <picture>
      {Object.entries(pic.sources).map(([type, srcSet]) => {
        const mimeType = type.includes("/")
          ? type
          : `image/${type === "jpg" ? "jpeg" : type}`;

        return (
          <source
            key={type}
            type={mimeType}
            srcSet={srcSet}
            sizes={sizes}
          />
        );
      })}
      <img
        src={pic.img.src}
        width={pic.img.w}
        height={pic.img.h}
        alt={alt}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
      />
    </picture>
  );
}
