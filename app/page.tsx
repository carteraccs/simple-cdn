import { Router } from "lucide-react";
import { siteConfig, resolvedTagline } from "@/lib/config";

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-8 text-center">
      <Router className="mb-8 h-16 w-16 text-[#177245]" strokeWidth={1.75} aria-hidden="true" />

      <h1 className="text-4xl font-bold tracking-tight text-ink">{siteConfig.name} CDN</h1>

      <p className="mt-4 max-w-sm text-lg leading-relaxed text-muted">{resolvedTagline()}</p>
    </main>
  );
}
