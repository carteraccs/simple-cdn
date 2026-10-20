import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getContentNode, listAllContentPaths } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export function generateStaticParams() {
  return listAllContentPaths().map((segments) => ({ slug: segments }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const node = getContentNode(slug);
  return { title: node ? `${node.title} — ${siteConfig.name} CDN` : siteConfig.name };
}

export default async function ContentPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const node = getContentNode(slug);
  if (!node) notFound();

  const parentHref = node.segments.length > 1 ? `/${node.segments.slice(0, -1).join("/")}` : "/";
  const eyebrow = node.segments.length > 1 ? node.segments.slice(0, -1).join(" / ") : siteConfig.name;

  return (
    <main className="mx-auto max-w-3xl px-8 py-16">
      <Link href={parentHref} className="text-sm text-accent hover:underline">
        ← Back
      </Link>

      <p className="mt-4 text-sm font-medium uppercase tracking-wide text-muted">{eyebrow}</p>
      <h1 className="mt-1 text-3xl font-bold text-ink">{node.title}</h1>
      {node.description && <p className="mt-3 text-lg text-muted">{node.description}</p>}

      {node.assets.length > 0 && (
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {node.assets.map((asset) => {
            const preview = asset.svgUrl ?? asset.imageUrl!;
            const imageLabel = asset.imageUrl ? asset.imageUrl.split(".").pop()?.toUpperCase() : null;
            return (
              <div
                key={asset.name}
                className="flex flex-col rounded-xl border border-gray-100 bg-gray-50 p-4"
              >
                <a
                  href={preview}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open image"
                  className="flex aspect-square items-center justify-center rounded-lg transition hover:opacity-80"
                >
                  <Image src={preview} alt="" width={120} height={120} className="h-full w-full object-contain" />
                </a>
                <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                  {asset.svgUrl && (
                    <a
                      href={asset.svgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Copy this link to embed the image"
                      className="rounded-full border border-gray-200 px-2.5 py-1 font-medium text-muted hover:border-accent hover:text-accent"
                    >
                      SVG
                    </a>
                  )}
                  {asset.imageUrl && (
                    <a
                      href={asset.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Copy this link to embed the image"
                      className="rounded-full border border-gray-200 px-2.5 py-1 font-medium text-muted hover:border-accent hover:text-accent"
                    >
                      {imageLabel}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {node.children.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Contents</h2>
          <ul className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-100">
            {node.children.map((child) => (
              <li key={child.slug}>
                <Link
                  href={`/${[...node.segments, child.slug].join("/")}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50"
                >
                  <span className="font-medium text-ink">{child.title}</span>
                  <span className="text-muted">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {node.assets.length === 0 && node.children.length === 0 && (
        <p className="mt-10 text-muted">
          Nothing here yet.{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">
            content/{node.segments.join("/")}/
          </code>
          .
        </p>
      )}
    </main>
  );
}
