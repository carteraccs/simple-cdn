export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "Simple",
  tagline: "A lightweight, self-hostable content delivery network.",
} as const;

export function resolvedTagline(): string {
  return siteConfig.tagline.replace(/\{name\}/g, siteConfig.name);
}
