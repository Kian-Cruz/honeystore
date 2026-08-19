import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, PackageCheck, Truck } from "lucide-react";

import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/lib/api/products";


const mainCategories = [
  {
    title: "Clothing",
    subtitle: "Everyday essentials",
    href: "/categories/fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050",
  },
  {
    title: "Crocs",
    subtitle: "Comfort for every day",
    href: "/categories/footwear/crocs",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
  },
  {
    title: "Skincare",
    subtitle: "Daily beauty care",
    href: "/categories/beauty/skincare",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03",
  },
  {
    title: "Makeup",
    subtitle: "Beauty favorites",
    href: "/categories/beauty/makeup",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
  },
];

export default async function Home() {
  const products = await getProducts();

const newArrivalProducts = products
  .filter((product) => product.newArrival)
  .slice(0, 4);

const featuredProducts = products
  .filter((product) => product.featured)
  .slice(0, 4);

const newArrivals =
  newArrivalProducts.length > 0
    ? newArrivalProducts
    : products.slice(0, 4);

const popularProducts =
  featuredProducts.length > 0
    ? featuredProducts
    : products.slice(0, 4);
  return (
    <main className="bg-white text-black">

      {/* HERO */}
      <section className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[620px] overflow-hidden bg-[#f4f4f4] lg:grid-cols-2">

          <div className="flex items-center px-8 py-16 sm:px-12 lg:px-16">
            <div className="max-w-xl">

              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
                New Arrivals
              </p>

              <h1 className="mt-5 text-5xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Everyday style.
                <span className="block">
                  Everyday comfort.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-black/60">
                Shop selected clothing, Crocs, skincare, makeup,
                and other everyday favorites in one place.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center gap-2 bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/80"
                >
                  Shop New Arrivals
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/categories"
                  className="inline-flex h-12 items-center border border-black px-6 text-sm font-semibold transition hover:bg-black hover:text-white"
                >
                  Browse Categories
                </Link>
              </div>

            </div>
          </div>

          <div className="relative min-h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1445205170230-053b83016050"
              alt="Fashion collection"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

        </div>
      </section>


      {/* SERVICE STRIP */}
      <section className="border-y border-black/10">
        <div className="mx-auto grid max-w-[1440px] divide-y divide-black/10 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">

          <div className="flex items-center gap-4 py-6 sm:px-6">
            <BadgeCheck size={22} strokeWidth={1.6} />

            <div>
              <p className="text-sm font-semibold">
                Carefully Selected Products
              </p>

              <p className="mt-1 text-xs text-black/50">
                Clothing, footwear and beauty
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 py-6 sm:px-6">
            <Truck size={22} strokeWidth={1.6} />

            <div>
              <p className="text-sm font-semibold">
                Reliable Delivery
              </p>

              <p className="mt-1 text-xs text-black/50">
                Convenient shipping options
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 py-6 sm:px-6">
            <PackageCheck size={22} strokeWidth={1.6} />

            <div>
              <p className="text-sm font-semibold">
                Easy Shopping
              </p>

              <p className="mt-1 text-xs text-black/50">
                Simple ordering from start to finish
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* SHOP BY CATEGORY */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8">

        <div className="mb-10 flex items-end justify-between">

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
              Shop by Category
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Find what you need
            </h2>
          </div>

          <Link
            href="/categories"
            className="hidden items-center gap-2 text-sm font-semibold sm:flex"
          >
            View All
            <ArrowRight size={16} />
          </Link>

        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {mainCategories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#f2f2f2]">

                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />

              </div>

              <div className="pt-4">
                <h3 className="text-lg font-semibold">
                  {category.title}
                </h3>

                <p className="mt-1 text-sm text-black/50">
                  {category.subtitle}
                </p>
              </div>

            </Link>
          ))}

        </div>

      </section>


      {/* NEW ARRIVALS */}
      <section className="bg-[#f7f7f7]">
        <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8">

          <div className="mb-10 flex items-end justify-between">

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
                Just In
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                New Arrivals
              </h2>
            </div>

            <Link
              href="/products"
              className="hidden items-center gap-2 text-sm font-semibold sm:flex"
            >
              Shop All
              <ArrowRight size={16} />
            </Link>

          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

        </div>
      </section>


      {/* FASHION PROMO */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden bg-black text-white lg:grid-cols-[1.15fr_0.85fr]">

          <div className="relative min-h-[600px]">
            <Image
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b"
              alt="Clothing collection"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>

          <div className="flex items-center px-8 py-16 sm:px-12 lg:px-14">

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                Clothing Collection
              </p>

              <h2 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.03em] sm:text-5xl">
                Simple pieces.
                <span className="block">
                  Easy to wear.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-white/60">
                Browse everyday clothing essentials, easy basics,
                and comfortable pieces for your daily wardrobe.
              </p>

              <Link
                href="/categories/fashion"
                className="mt-8 inline-flex h-12 items-center gap-2 bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/85"
              >
                Shop Clothing
                <ArrowRight size={16} />
              </Link>
            </div>

          </div>

        </div>
      </section>


      {/* CROCS FEATURE */}
      <section className="bg-[#f5f5f5]">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">

          <div className="flex items-center px-8 py-20 sm:px-12 lg:px-16">

            <div className="max-w-lg">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
                Footwear
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                Comfort for every day.
              </h2>

              <p className="mt-6 text-sm leading-7 text-black/55">
                Explore casual footwear and Crocs styles made
                for easy, comfortable everyday wear.
              </p>

              <Link
                href="/categories/footwear/crocs"
                className="mt-8 inline-flex items-center gap-2 border-b border-black pb-1 text-sm font-semibold"
              >
                Shop Crocs
                <ArrowRight size={15} />
              </Link>
            </div>

          </div>

          <div className="relative min-h-[560px]">
            <Image
              src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
              alt="Casual footwear"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

        </div>
      </section>


      {/* BEAUTY FEATURE */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2">

          <div className="relative min-h-[580px] bg-[#f0ece8]">
            <Image
              src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b"
              alt="Skincare products"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="flex items-center bg-[#efe8e3] px-8 py-16 sm:px-12 lg:px-16">

            <div className="max-w-lg">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
                Beauty
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                Everyday beauty essentials.
              </h2>

              <p className="mt-6 text-sm leading-7 text-black/55">
                Shop skincare, makeup, body care, and beauty
                favorites for your daily routine.
              </p>

              <Link
                href="/categories/beauty"
                className="mt-8 inline-flex h-12 items-center gap-2 bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/80"
              >
                Shop Beauty
                <ArrowRight size={16} />
              </Link>
            </div>

          </div>

        </div>
      </section>


      {/* POPULAR PRODUCTS */}
      <section className="border-t border-black/10">
        <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8">

          <div className="mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
              Popular Now
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Customer favorites
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {popularProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

        </div>
      </section>


      {/* BRAND SHOP */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-20 text-center sm:px-6 lg:px-8">

          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Shop by Brand
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            Brands you already know
          </h2>

          <div className="mx-auto mt-12 grid max-w-4xl border border-white/20 sm:grid-cols-3">

            <Link
              href="/brands/uniqlo"
              className="flex min-h-[150px] items-center justify-center border-b border-white/20 text-2xl font-bold transition hover:bg-white hover:text-black sm:border-b-0 sm:border-r"
            >
              UNIQLO
            </Link>

            <Link
              href="/brands/crocs"
              className="flex min-h-[150px] items-center justify-center border-b border-white/20 text-2xl font-bold transition hover:bg-white hover:text-black sm:border-b-0 sm:border-r"
            >
              CROCS
            </Link>

            <Link
              href="/brands"
              className="flex min-h-[150px] items-center justify-center text-xl font-semibold transition hover:bg-white hover:text-black"
            >
              BEAUTY BRANDS
            </Link>

          </div>

        </div>
      </section>


      {/* NEWSLETTER */}
      <section className="border-b border-black/10">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
              Stay Updated
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em]">
              New products and offers.
            </h2>

            <p className="mt-3 text-sm text-black/50">
              Get updates about new arrivals, restocks, and promotions.
            </p>
          </div>

          <form className="flex border-b border-black">
            <input
              type="email"
              placeholder="Email address"
              className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-black/35"
            />

            <button
              type="submit"
              className="text-xs font-semibold uppercase tracking-[0.1em]"
            >
              Subscribe
            </button>
          </form>

        </div>
      </section>

    </main>
  );
}