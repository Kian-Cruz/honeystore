"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  CreditCard,
  ExternalLink,
  LoaderCircle,
  Package,
  RefreshCw,
} from "lucide-react";

import {
  getAdminOrders,
  updateAdminOrderStatus,
  type AdminOrder,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/api/admin-orders";
import { formatPrice } from "@/lib/utils/currency";

const orderStatuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const paymentStatuses: PaymentStatus[] = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<
    AdminOrder[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [savingId, setSavingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  async function loadOrders() {
    setError("");
    setIsLoading(true);

    try {
      const result = await getAdminOrders();
      setOrders(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load orders"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  function updateLocalOrder(
    id: string,
    changes: Partial<AdminOrder>
  ) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === id
          ? {
              ...order,
              ...changes,
            }
          : order
      )
    );
  }

  async function handleSave(
    order: AdminOrder
  ) {
    setError("");
    setSavingId(order.id);

    try {
      const updated =
        await updateAdminOrderStatus(
          order.id,
          order.status,
          order.paymentStatus
        );

      updateLocalOrder(order.id, updated);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update order"
      );

      await loadOrders();
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-black">
      {/* Header */}
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
              HONEYSTORE Admin
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em]">
              Orders
            </h1>

            <p className="mt-3 text-sm text-black/50">
              Review customer orders, verify payments,
              and update delivery status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadOrders()}
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center gap-2 border border-black px-5 text-sm font-semibold transition hover:bg-black hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-8">
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </div>
      )}

      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <LoaderCircle
              size={28}
              className="animate-spin"
            />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center bg-white text-center">
            <Package
              size={36}
              strokeWidth={1.4}
            />

            <h2 className="mt-5 text-2xl font-bold">
              No orders yet
            </h2>

            <p className="mt-2 text-sm text-black/45">
              New customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const paymentProofUrl =
                getSafePaymentProofUrl(
                  order.paymentProofUrl
                );

              const requiresVerification =
                order.paymentMethod !== "COD";

              return (
                <article
                  key={order.id}
                  className="bg-white p-5 sm:p-7"
                >
                  {/* Order heading and controls */}
                  <div className="flex flex-col gap-5 border-b border-black/10 pb-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">
                        Order Number
                      </p>

                      <h2 className="mt-1 text-lg font-bold">
                        {order.orderNumber}
                      </h2>

                      <p className="mt-2 text-xs text-black/45">
                        {new Date(
                          order.createdAt
                        ).toLocaleString()}
                      </p>

                      {order.userId && (
                        <span className="mt-3 inline-flex border border-green-200 bg-green-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-green-700">
                          Registered Customer
                        </span>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:min-w-[480px]">
                      <div>
                        <label
                          htmlFor={`order-status-${order.id}`}
                          className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em] text-black/45"
                        >
                          Order Status
                        </label>

                        <select
                          id={`order-status-${order.id}`}
                          value={order.status}
                          disabled={
                            order.status ===
                            "CANCELLED"
                          }
                          onChange={(event) =>
                            updateLocalOrder(
                              order.id,
                              {
                                status:
                                  event.target
                                    .value as OrderStatus,
                              }
                            )
                          }
                          className="h-11 w-full border border-black/20 bg-white px-3 text-sm outline-none focus:border-black disabled:bg-black/5"
                        >
                          {orderStatuses.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {formatStatus(status)}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor={`payment-status-${order.id}`}
                          className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em] text-black/45"
                        >
                          Payment Status
                        </label>

                        <select
                          id={`payment-status-${order.id}`}
                          value={
                            order.paymentStatus
                          }
                          onChange={(event) =>
                            updateLocalOrder(
                              order.id,
                              {
                                paymentStatus:
                                  event.target
                                    .value as PaymentStatus,
                              }
                            )
                          }
                          className="h-11 w-full border border-black/20 bg-white px-3 text-sm outline-none focus:border-black"
                        >
                          {paymentStatuses.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {formatStatus(status)}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-8 py-6 lg:grid-cols-[1fr_340px]">
                    {/* Products */}
                    <div>
                      <h3 className="text-sm font-bold">
                        Products
                      </h3>

                      <div className="mt-4 space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start justify-between gap-5 border-b border-black/10 pb-4"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                {item.name}
                              </p>

                              <p className="mt-1 text-xs text-black/45">
                                {formatPrice(
                                  item.price
                                )}{" "}
                                × {item.quantity}
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
                    </div>

                    <div className="space-y-6">
                      {/* Customer */}
                      <div>
                        <h3 className="text-sm font-bold">
                          Customer
                        </h3>

                        <div className="mt-3 space-y-1 text-sm leading-6 text-black/55">
                          <p>
                            {order.customerName}
                          </p>

                          <p>{order.phone}</p>

                          {order.email && (
                            <p className="break-all">
                              {order.email}
                            </p>
                          )}

                          <p>{order.address}</p>

                          <p>
                            {order.township
                              ? `${order.township}, `
                              : ""}
                            {order.city}
                          </p>
                        </div>
                      </div>

                      {/* Payment details */}
                      <div className="border border-black/10 bg-[#f7f7f7] p-4">
                        <div className="flex items-center gap-2">
                          <CreditCard
                            size={17}
                            strokeWidth={1.6}
                          />

                          <h3 className="text-sm font-bold">
                            Payment Details
                          </h3>
                        </div>

                        <div className="mt-4 space-y-4">
                          <PaymentDetail
                            label="Method"
                            value={formatStatus(
                              order.paymentMethod
                            )}
                          />

                          <PaymentDetail
                            label="Status"
                            value={formatStatus(
                              order.paymentStatus
                            )}
                          />

                          {requiresVerification && (
                            <PaymentDetail
                              label="Transaction Reference"
                              value={
                                order.paymentReference ||
                                "Not provided"
                              }
                              warning={
                                !order.paymentReference
                              }
                            />
                          )}

                          {order.paidAt && (
                            <PaymentDetail
                              label="Paid At"
                              value={new Date(
                                order.paidAt
                              ).toLocaleString()}
                            />
                          )}

                          {paymentProofUrl && (
                            <div>
                              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40">
                                Payment Proof
                              </p>

                              <a
                                href={
                                  paymentProofUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex h-9 items-center gap-2 border border-black bg-white px-3 text-xs font-semibold transition hover:bg-black hover:text-white"
                              >
                                <ExternalLink
                                  size={14}
                                />
                                View Receipt
                              </a>
                            </div>
                          )}

                          {requiresVerification &&
                            !paymentProofUrl && (
                              <div className="border-l-2 border-amber-500 bg-amber-50 px-3 py-2">
                                <p className="text-[11px] leading-5 text-amber-800">
                                  No payment screenshot
                                  has been uploaded. Verify
                                  the transaction reference
                                  before marking this
                                  payment as paid.
                                </p>
                              </div>
                            )}

                          {order.paymentMethod ===
                            "COD" && (
                            <div className="border-l-2 border-black bg-white px-3 py-2">
                              <p className="text-[11px] leading-5 text-black/55">
                                Collect payment when the
                                order is delivered.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Notes */}
                      {order.notes && (
                        <div>
                          <h3 className="text-sm font-bold">
                            Notes
                          </h3>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-black/55">
                            {order.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Totals and save */}
                  <div className="flex flex-col gap-5 border-t border-black/10 pt-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-2 text-sm">
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

                      <SummaryRow
                        label="Total"
                        value={formatPrice(
                          order.total
                        )}
                        strong
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        void handleSave(order)
                      }
                      disabled={
                        savingId === order.id
                      }
                      className="h-11 bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingId === order.id
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function getSafePaymentProofUrl(
  value: string | null
): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function formatStatus(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

type PaymentDetailProps = {
  label: string;
  value: string;
  warning?: boolean;
};

function PaymentDetail({
  label,
  value,
  warning = false,
}: PaymentDetailProps) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40">
        {label}
      </p>

      <p
        className={`mt-1 break-all text-sm font-medium ${
          warning
            ? "text-amber-700"
            : "text-black"
        }`}
      >
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
    <div className="flex min-w-[260px] justify-between gap-8">
      <span className="text-black/45">
        {label}
      </span>

      <span
        className={
          strong
            ? "font-bold"
            : "font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}