"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";
import {
  LogOut,
  Package,
  ReceiptText,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import {
  getCurrentCustomer,
  logoutCustomer,
  type Customer,
} from "@/lib/api/customer-auth";
import {
  getMyOrders,
  type CustomerOrder,
} from "@/lib/api/orders";
import { formatPrice } from "@/lib/utils/currency";

export default function AccountPage() {
  const router = useRouter();

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [orders, setOrders] = useState<
    CustomerOrder[]
  >([]);

  const [isChecking, setIsChecking] =
    useState(true);

  const [isLoadingOrders, setIsLoadingOrders] =
    useState(true);

  const [ordersError, setOrdersError] =
    useState("");

  useEffect(() => {
    async function loadAccount() {
      const currentCustomer =
        getCurrentCustomer();

      if (!currentCustomer) {
        router.replace("/login");
        return;
      }

      setCustomer(currentCustomer);
      setIsChecking(false);

      try {
        setIsLoadingOrders(true);
        setOrdersError("");

        const customerOrders =
          await getMyOrders();

        setOrders(customerOrders);
      } catch (error) {
        setOrdersError(
          error instanceof Error
            ? error.message
            : "Unable to load your orders"
        );
      } finally {
        setIsLoadingOrders(false);
      }
    }

    void loadAccount();
  }, [router]);

  function handleLogout() {
    logoutCustomer();
    router.replace("/login");
    router.refresh();
  }

  if (isChecking || !customer) {
    return (
      <main className="flex min-h-[600px] items-center justify-center">
        <p className="text-sm text-black/45">
          Loading your account...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#f7f7f7] px-4 py-14 text-black">
      <section className="mx-auto max-w-4xl">
        {/* Account information */}
        <div className="bg-white p-7 sm:p-10">
          <div className="flex flex-col gap-6 border-b border-black/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#f4f4f4]">
                <UserRound
                  size={27}
                  strokeWidth={1.5}
                />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40">
                  HONEYSTORE Account
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-[-0.03em]">
                  {customer.name}
                </h1>

                <p className="mt-1 text-sm text-black/45">
                  {customer.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-11 items-center justify-center gap-2 border border-black px-5 text-sm font-semibold transition hover:bg-black hover:text-white"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>

          <div className="grid gap-8 py-8 sm:grid-cols-2">
            <AccountDetail
              label="Full Name"
              value={customer.name}
            />

            <AccountDetail
              label="Email Address"
              value={customer.email}
            />

            <AccountDetail
              label="Phone Number"
              value={
                customer.phone ||
                "Not provided"
              }
            />

            <AccountDetail
              label="Member Since"
              value={new Date(
                customer.createdAt
              ).toLocaleDateString()}
            />
          </div>

          <div className="border-t border-black/10 pt-8">
            <h2 className="text-xl font-bold">
              Quick Links
            </h2>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex h-11 items-center gap-2 bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80"
              >
                <ShoppingBag size={16} />
                Shop Products
              </Link>

              <Link
                href="/wishlist"
                className="inline-flex h-11 items-center border border-black px-5 text-sm font-semibold transition hover:bg-black hover:text-white"
              >
                View Wishlist
              </Link>
            </div>
          </div>
        </div>

        {/* Order history */}
        <div className="mt-8 bg-white p-7 sm:p-10">
          <div className="flex flex-col gap-3 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40">
                Purchase History
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                My Orders
              </h2>
            </div>

            {!isLoadingOrders &&
              !ordersError && (
                <p className="text-sm text-black/45">
                  {orders.length}{" "}
                  {orders.length === 1
                    ? "order"
                    : "orders"}
                </p>
              )}
          </div>

          {isLoadingOrders && (
            <div className="py-16 text-center">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-black/15 border-t-black" />

              <p className="mt-4 text-sm text-black/45">
                Loading your orders...
              </p>
            </div>
          )}

          {!isLoadingOrders &&
            ordersError && (
              <div className="py-14 text-center">
                <p className="text-sm text-red-700">
                  {ordersError}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                  className="mt-5 inline-flex h-10 items-center justify-center border border-black px-5 text-sm font-semibold transition hover:bg-black hover:text-white"
                >
                  Try Again
                </button>
              </div>
            )}

          {!isLoadingOrders &&
            !ordersError &&
            orders.length === 0 && (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f4f4]">
                  <Package
                    size={27}
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  No orders yet
                </h3>

                <p className="mt-2 text-sm text-black/45">
                  Orders placed while signed in will
                  appear here.
                </p>

                <Link
                  href="/products"
                  className="mt-6 inline-flex h-11 items-center justify-center bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/80"
                >
                  Start Shopping
                </Link>
              </div>
            )}

          {!isLoadingOrders &&
            !ordersError &&
            orders.length > 0 && (
              <div className="mt-6 space-y-5">
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                  />
                ))}
              </div>
            )}
        </div>
      </section>
    </main>
  );
}

type AccountDetailProps = {
  label: string;
  value: string;
};

function AccountDetail({
  label,
  value,
}: AccountDetailProps) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

type OrderCardProps = {
  order: CustomerOrder;
};

function OrderCard({
  order,
}: OrderCardProps) {
  return (
    <article className="border border-black/10">
      {/* Order heading */}
      <div className="flex flex-col gap-5 bg-[#f7f7f7] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <ReceiptText
            size={20}
            strokeWidth={1.6}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/40">
              Order Number
            </p>

            <p className="mt-1 break-all text-sm font-bold">
              {order.orderNumber}
            </p>

            <p className="mt-1 text-xs text-black/45">
              {new Date(
                order.createdAt
              ).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusBadge
            label={order.status}
            type="order"
          />

          <StatusBadge
            label={order.paymentStatus}
            type="payment"
          />
        </div>
      </div>

      {/* Products */}
      <div className="divide-y divide-black/10 px-5">
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
                Quantity: {item.quantity}
              </p>

              <p className="mt-1 text-xs text-black/45">
                {formatPrice(item.price)} each
              </p>
            </div>

            <p className="shrink-0 text-sm font-semibold">
              {formatPrice(
                item.price * item.quantity
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-black/10 p-5">
        <div className="ml-auto max-w-sm space-y-3">
          <OrderSummaryRow
            label="Subtotal"
            value={formatPrice(order.subtotal)}
          />

          <OrderSummaryRow
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
            <OrderSummaryRow
              label="Total"
              value={formatPrice(order.total)}
              strong
            />
          </div>
        </div>
      </div>
    </article>
  );
}

type StatusBadgeProps = {
  label: string;
  type: "order" | "payment";
};

function StatusBadge({
  label,
  type,
}: StatusBadgeProps) {
  const normalizedLabel =
    label.toUpperCase();

  let className =
    "border-black/15 bg-white text-black";

  if (
    normalizedLabel === "PAID" ||
    normalizedLabel === "DELIVERED" ||
    normalizedLabel === "CONFIRMED"
  ) {
    className =
      "border-green-200 bg-green-50 text-green-700";
  }

  if (
    normalizedLabel === "CANCELLED" ||
    normalizedLabel === "FAILED"
  ) {
    className =
      "border-red-200 bg-red-50 text-red-700";
  }

  if (
    normalizedLabel === "PENDING" ||
    normalizedLabel === "PROCESSING"
  ) {
    className =
      "border-amber-200 bg-amber-50 text-amber-700";
  }

  return (
    <span
      className={`inline-flex h-7 items-center border px-3 text-[9px] font-bold uppercase tracking-[0.1em] ${className}`}
    >
      {type === "payment"
        ? `Payment: ${label}`
        : label}
    </span>
  );
}

type OrderSummaryRowProps = {
  label: string;
  value: string;
  strong?: boolean;
};

function OrderSummaryRow({
  label,
  value,
  strong = false,
}: OrderSummaryRowProps) {
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