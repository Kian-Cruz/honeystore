import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#111111] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-2xl font-black tracking-[-0.04em]"
            >
              HONEYSTORE
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/50">
              A curated reseller store for clothing,
              Crocs, skincare, makeup, and everyday
              essentials.
            </p>

            <Link
              href="/track-order"
              className="mt-6 inline-flex h-11 items-center border border-white/25 px-5 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Track Your Order
            </Link>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
              Shop
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <FooterLink href="/products">
                New Arrivals
              </FooterLink>

              <FooterLink href="/categories/fashion">
                Clothing
              </FooterLink>

              <FooterLink href="/categories/footwear">
                Footwear
              </FooterLink>

              <FooterLink href="/categories/beauty">
                Beauty
              </FooterLink>

              <FooterLink href="/brands">
                Brands
              </FooterLink>

              <FooterLink href="/sale">
                Sale
              </FooterLink>
            </div>
          </div>

          {/* Customer care */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
              Customer Care
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <FooterLink href="/account">
                My Account
              </FooterLink>

              <FooterLink href="/track-order">
                Track Order
              </FooterLink>

              <FooterLink href="/wishlist">
                Wishlist
              </FooterLink>

              <FooterLink href="/cart">
                Shopping Bag
              </FooterLink>

              <FooterLink href="/shipping">
                Shipping
              </FooterLink>

              <FooterLink href="/returns">
                Returns
              </FooterLink>

              <FooterLink href="/contact">
                Contact
              </FooterLink>
            </div>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
              Information
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <FooterLink href="/about">
                About Us
              </FooterLink>

              <FooterLink href="/privacy">
                Privacy Policy
              </FooterLink>

              <FooterLink href="/terms">
                Terms & Conditions
              </FooterLink>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 border-t border-white/10" />

        {/* Bottom */}
        <div className="flex flex-col gap-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 HONEYSTORE. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <span>Clothing</span>
            <span>Crocs</span>
            <span>Skincare</span>
            <span>Makeup</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
};

function FooterLink({
  href,
  children,
}: FooterLinkProps) {
  return (
    <Link
      href={href}
      className="text-sm text-white/70 transition hover:text-white"
    >
      {children}
    </Link>
  );
}