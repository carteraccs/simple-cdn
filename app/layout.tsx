import type { Metadata } from "next";
import { siteConfig, resolvedTagline } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${siteConfig.name} CDN`,
  description: resolvedTagline(),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
