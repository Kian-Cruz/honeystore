"use client";

import Link from "next/link";
import {
  type FormEvent,
  useState,
} from "react";
import {
  LoaderCircle,
  PackageSearch,
  Search,
} from "lucide-react";

import {
  trackOrder,
  type CustomerOrder,
  type OrderStatus,
} from "@/lib/api/orders";
import { formatPrice } from "@/lib/utils/currency";

const orderSteps: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export default function TrackOrderPage() {
  const [order, setOrder] =
    useState<CustomerOrder | null>(null);

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const formData = new FormData(
      event.currentTarget
    );

    const orderNumber = String(
      formData.get("orderNumber") ?? ""
    ).trim();

    const phone = String(
      formData.get("phone") ?? ""
    ).trim();

    setError("");
    setOrder(null);
    setIsLoading(true);

    try {
      const result = await trackOrder(
        orderNumber,
        phone
      );

      setOrder(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to find the order"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-[70vh] bg-[#f7f7f7] text-black">
      {/* Header */}
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
            HONEYSTORE
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            Track Your Order
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/50">
            Enter your order number and the phone number
            used during checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8">
        {/* Search form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8"
        >
          <div className="grid gap-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <div>
              <label
                htmlFor="orderNumber"
                className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50"
              >
                Order Number
              </label>

              <input
                id="orderNumber"
                name="orderNumber"
                type="text"
                required
                maxLength={100}
                placeholder="HS-..."
                autoComplete="off"
                className="h-12 w-full border border-black/20 bg-white px-4 text-sm uppercase outline-none transition placeholder:normal-case placeholder:text-black/30 focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50"
              >
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                required
                maxLength={30}
                placeholder="09xxxxxxxxx"
                autoComplete="tel"
                className="h-12 w-full border border-black/20 bg-white px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-12 items-center justify-center gap-2 bg-black px-7 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Search size={17} />
              )}

              {isLoading
                ? "Searching..."
                : "Track Order"}
            </button>
          </div>

          <p className="mt-4 text-[11px] leading-5 text-black/40">
            You can find the order number on the
            confirmation screen after checkout.
          </p>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Initial state */}
        {!order && !error && !isLoading && (
          <div className="mt-8 bg-white py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f4f4]">
              <PackageSearch
                size={28}
                strokeWidth={1.5}
              />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Find your order
            </h2>

            <p className="mt-2 text-sm text-black/45">
              Your latest order information will appear
              here.
            </p>
          </div>
        )}

        {/* Order result */}
        {order && (
          <div className="mt-8 space-y-6">
            <section className="bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-5 border-b border-black/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">
                    Order Number
                  </p>

                  <h2 className="mt-1 break-all text-xl font-bold">
                    {order.orderNumber}
                  </h2>

                  <p className="mt-2 text-xs text-black/45">
                    Placed{" "}
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge
                    label={order.status}
                  />

                  <StatusBadge
                    label={`Payment: ${order.paymentStatus}`}
                  />
                </div>
              </div>

              {/* Order progress */}
              <OrderProgress
                status={order.status}
              />

              <div className="mt-8 grid gap-8 border-t border-black/10 pt-7 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-bold">
                    Delivery Information
                  </h3>

                  <div className="mt-3 space-y-1 text-sm leading-6 text-black/55">
                    <p>{order.customerName}</p>
                    <p>{order.phone}</p>
                    <p>{order.address}</p>

                    <p>
                      {order.township
                        ? `${order.township}, `
                        : ""}
                      {order.city}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold">
                    Payment Information
                  </h3>

                  <div className="mt-3 space-y-3">
                    <DetailRow
                      label="Method"
                      value={formatStatus(
                        order.paymentMethod
                      )}
                    />

                    <DetailRow
                      label="Status"
                      value={formatStatus(
                        order.paymentStatus
                      )}
                    />

                    {order.paymentReference && (
                      <DetailRow
                        label="Reference"
                        value={
                          order.paymentReference
                        }
                      />
                    )}

                    {order.paidAt && (
                      <DetailRow
                        label="Paid At"
                        value={new Date(
                          order.paidAt
                        ).toLocaleString()}
                      />
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Items */}
            <section className="bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold">
                Order Items
              </h2>

              <div className="mt-5 divide-y divide-black/10 border-y border-black/10">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-5 py-5"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm font-semibold transition hover:underline"
                      >
                        {item.name}
                      </Link>

                      <p className="mt-1 text-xs text-black/45">
                        {formatPrice(item.price)} ×{" "}
                        {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold">
                      {formatPrice(
                        item.price *
                          item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="ml-auto mt-6 max-w-sm space-y-3">
                <SummaryRow
                  label="Subtotal"
                  value={formatPrice(
                    order.subtotal
                  )}
                />

                <SummaryRow
                  label="Shipping"
                  value={
                    order.shippingFee === 0
                      ? "Free"
                      : formatPrice(
                          order.shippingFee
                        )
                  }
                />

                <div className="border-t border-black/10 pt-3">
                  <SummaryRow
                    label="Total"
                    value={formatPrice(
                      order.total
                    )}
                    strong
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

type OrderProgressProps = {
  status: OrderStatus;
};

function OrderProgress({
  status,
}: OrderProgressProps) {
  if (status === "CANCELLED") {
    return (
      <div className="mt-7 border-l-2 border-red-600 bg-red-50 px-4 py-3">
        <p className="text-sm font-semibold text-red-700">
          This order has been cancelled.
        </p>
      </div>
    );
  }

  const currentIndex =
    orderSteps.indexOf(status);

  return (
    <div className="mt-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">
        Order Progress
      </p>

      <div className="mt-5 grid grid-cols-5 gap-1">
        {orderSteps.map((step, index) => {
          const completed =
            index <= currentIndex;

          return (
            <div
              key={step}
              className="min-w-0"
            >
              <div
                className={`h-1.5 ${
                  completed
                    ? "bg-black"
                    : "bg-black/10"
                }`}
              />

              <p
                className={`mt-2 truncate text-[8px] font-semibold uppercase tracking-[0.04em] sm:text-[10px] ${
                  completed
                    ? "text-black"
                    : "text-black/30"
                }`}
              >
                {formatStatus(step)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatStatus(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

type StatusBadgeProps = {
  label: string;
};

function StatusBadge({
  label,
}: StatusBadgeProps) {
  return (
    <span className="inline-flex h-7 items-center border border-black/15 bg-[#f7f7f7] px-3 text-[9px] font-bold uppercase tracking-[0.08em]">
      {formatStatus(label)}
    </span>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({
  label,
  value,
}: DetailRowProps) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
  strong?: boolean;
};

function SummaryRow({
  label,
  value,
  strong = false,
}: SummaryRowProps) {
  return (
    <div
      className={`flex items-center justify-between gap-5 ${
        strong
          ? "text-base font-bold"
          : "text-sm"
      }`}
    >
      <span
        className={
          strong
            ? ""
            : "text-black/50"
        }
      >
        {label}
      </span>

      <span>{value}</span>
    </div>
  );
}