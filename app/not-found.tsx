import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
      <h1 className="text-2xl font-bold text-ink">Not found</h1>
      <p className="mt-2 text-muted">There's nothing here yet.</p>
      <Link href="/" className="mt-6 text-accent hover:underline">
        Back to home
      </Link>
    </main>
  );
}
