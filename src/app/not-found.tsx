import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-8xl font-serif text-brand-charcoal">404</h1>
          <p className="text-lg text-brand-charcoal/60">Page not found</p>
          <p className="text-sm text-brand-charcoal/40">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Link href="/" className="btn-primary inline-block px-10 py-4">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
