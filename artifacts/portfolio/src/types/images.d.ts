// vite-imagetools `as=picture` import shape
declare module "*as=picture" {
  const value: {
    sources: Record<string, string>;
    img: { src: string; w: number; h: number };
  };
  export default value;
}
