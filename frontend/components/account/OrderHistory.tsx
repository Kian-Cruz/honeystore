"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  LoaderCircle,
  Package,
} from "lucide-react";

import {
  getMyOrders,
  type CustomerOrder,
} from "@/lib/api/orders";
import { formatPrice } from "@/lib/utils/currency";

export default function OrderHistory() {
  const [orders, setOrders] = useState<
    CustomerOrder[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const result = await getMyOrders();
        setOrders(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your orders"
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <LoaderCircle
          size={24}
          className="animate-spin"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-black/10 py-14 text-center">
        <Package
          size={30}
          strokeWidth={1.4}
        />

        <h3 className="mt-4 text-lg font-bold">
          No orders yet
        </h3>

        <p className="mt-2 text-sm text-black/45">
          Orders placed while signed in will
          appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <article
          key={order.id}
          className="border border-black/10 p-5 sm:p-6"
        >
          <div className="flex flex-col gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">
                Order Number
              </p>

              <h3 className="mt-1 font-bold">
                {order.orderNumber}
              </h3>

              <p className="mt-2 text-xs text-black/45">
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
                label={order.paymentStatus}
                muted
              />
            </div>
          </div>

          <div className="py-5">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-5 py-2 text-sm"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span className="shrink-0 font-medium">
                  {formatPrice(
                    item.price * item.quantity
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-black/10 pt-5">
            <span className="text-sm font-semibold">
              Total
            </span>

            <span className="text-lg font-bold">
              {formatPrice(order.total)}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

type StatusBadgeProps = {
  label: string;
  muted?: boolean;
};

function StatusBadge({
  label,
  muted = false,
}: StatusBadgeProps) {
  return (
    <span
      className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${
        muted
          ? "bg-black/5 text-black/55"
          : "bg-black text-white"
      }`}
    >
      {label.replaceAll("_", " ")}
    </span>
  );
}