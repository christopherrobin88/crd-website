import { SiteNav } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { Work } from "@/components/Work";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useWorkScrollRestoration } from "@/hooks/use-work-return";

export default function WorkPage() {
  usePageMeta("/work");
  useWorkScrollRestoration();

  return (
    <div className="min-h-screen text-foreground">
      <SiteNav />
      <div className="pt-28 md:pt-36">
        <Work />
      </div>
      <SiteFooter />
    </div>
  );
}
