import { prerenderToNodeStream } from "react-dom/static";
import App from "./App";
import "./index.css";

export { routeMetaList, metaForPath, canonicalUrl, absoluteImageUrl } from "./lib/meta";

/**
 * react-dom/static's prerender (React 19) waits for Suspense to resolve, so
 * lazy route components render their real content — renderToString rendered
 * the Suspense fallback (nothing) for every route except the eager homepage.
 */
export async function render(path: string): Promise<string> {
  const { prelude } = await prerenderToNodeStream(<App path={path} />);
  return await new Promise<string>((resolve, reject) => {
    let html = "";
    prelude.on("data", (chunk: Buffer) => {
      html += chunk.toString();
    });
    prelude.on("end", () => resolve(html));
    prelude.on("error", reject);
  });
}
