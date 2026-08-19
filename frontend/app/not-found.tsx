import Link from "next/link";
import {
  ArrowLeft,
  Home,
  Search,
  ShoppingBag,
} from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="min-h-[70vh] bg-white text-black">
      <section className="mx-auto flex min-h-[70vh] max-w-[1440px] items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid w-full gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          {/* Message */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
              HONEYSTORE
            </p>

            <p className="mt-6 text-[90px] font-black leading-none tracking-[-0.08em] text-black sm:text-[130px]">
              404
            </p>

            <h1 className="mt-6 text-3xl font-bold tracking-[-0.03em] sm:text-5xl">
              Page not found
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-black/50">
              The page you are looking for may have been
              moved, removed, or the address might be
              incorrect.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center gap-2 bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/80"
              >
                <Home
                  size={17}
                  strokeWidth={1.7}
                />

                Return Home
              </Link>

              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center gap-2 border border-black px-6 text-sm font-semibold transition hover:bg-black hover:text-white"
              >
                <ShoppingBag
                  size={17}
                  strokeWidth={1.7}
                />

                Shop Products
              </Link>
            </div>
          </div>

          {/* Navigation card */}
          <div className="border border-black/10 bg-[#f7f7f7] p-7 sm:p-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40">
              Continue Shopping
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em]">
              Find what you need
            </h2>

            <div className="mt-7 divide-y divide-black/10 border-y border-black/10">
              <NavigationLink
                href="/search"
                icon={<Search size={18} strokeWidth={1.7} />}
                title="Search"
                description="Search all HONEYSTORE products"
              />

              <NavigationLink
                href="/products"
                icon={
                  <ShoppingBag
                    size={18}
                    strokeWidth={1.7}
                  />
                }
                title="New Arrivals"
                description="Browse the latest products"
              />

              <NavigationLink
                href="/brands"
                icon={
                  <ArrowLeft
                    size={18}
                    strokeWidth={1.7}
                  />
                }
                title="Shop by Brand"
                description="Explore products by brand"
              />
            </div>

            <p className="mt-6 text-xs leading-5 text-black/40">
              If you followed a store link, return to the
              previous page and try again.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

type NavigationLinkProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

function NavigationLink({
  href,
  icon,
  title,
  description,
}: NavigationLinkProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 py-5"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-white transition group-hover:bg-black group-hover:text-white">
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block text-sm font-semibold">
          {title}
        </span>

        <span className="mt-1 block text-xs text-black/45">
          {description}
        </span>
      </span>

      <span className="ml-auto text-lg transition group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}