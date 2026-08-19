"use client";

import Link from "next/link";
import {
  type FormEvent,
  type ReactNode,
  useState,
} from "react";
import {
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";

import PaymentInstructions from "@/components/checkout/PaymentInstructions";
import {
  createOrder,
  type CreatedOrder,
  type PaymentMethod,
} from "@/lib/api/orders";
import { formatPrice } from "@/lib/utils/currency";
import { useCartStore } from "@/stores/cartStore";

const FREE_SHIPPING_THRESHOLD = 200000;
const STANDARD_SHIPPING_FEE = 5000;

const inputClass =
  "h-12 w-full border border-black/20 bg-white px-4 text-sm outline-none transition focus:border-black";

export default function CheckoutPage() {
  const items = useCartStore(
    (state) => state.items
  );

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("COD");

  const [
    paymentReference,
    setPaymentReference,
  ] = useState("");

  const [createdOrder, setCreatedOrder] =
    useState<CreatedOrder | null>(null);

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const subtotal = items.reduce(
    (total, item) =>
      total +
      item.product.price * item.quantity,
    0
  );

  const shipping =
    subtotal === 0 ||
    subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE;

  const total = subtotal + shipping;

  function selectPaymentMethod(
    method: PaymentMethod
  ) {
    setPaymentMethod(method);
    setPaymentReference("");
    setError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      items.length === 0 ||
      isSubmitting
    ) {
      return;
    }

    if (
      paymentMethod !== "COD" &&
      !paymentReference.trim()
    ) {
      setError(
        "Enter your payment transaction reference before placing the order."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setError("");
    setIsSubmitting(true);

    const formData = new FormData(
      event.currentTarget
    );

    const firstName = String(
      formData.get("firstName") ?? ""
    ).trim();

    const lastName = String(
      formData.get("lastName") ?? ""
    ).trim();

    const mainAddress = String(
      formData.get("address") ?? ""
    ).trim();

    const address2 = String(
      formData.get("address2") ?? ""
    ).trim();

    const orderPayload = {
      customerName:
        `${firstName} ${lastName}`.trim(),
      email:
        String(
          formData.get("email") ?? ""
        ).trim() || undefined,
      phone: String(
        formData.get("phone") ?? ""
      ).trim(),
      address: address2
        ? `${mainAddress}, ${address2}`
        : mainAddress,
      city: String(
        formData.get("city") ?? ""
      ).trim(),
      township:
        String(
          formData.get("township") ?? ""
        ).trim() || undefined,
      notes:
        String(
          formData.get("notes") ?? ""
        ).trim() || undefined,
      paymentMethod,
      paymentReference:
        paymentMethod === "COD"
          ? undefined
          : paymentReference.trim(),
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    try {
      const order = await createOrder(
        orderPayload
      );

      setCreatedOrder(order);

      useCartStore.setState({
        items: [],
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to place your order"
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (createdOrder) {
    const isManualPayment =
      paymentMethod !== "COD";

    return (
      <main className="bg-white text-black">
        <section className="mx-auto flex min-h-[650px] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2
              size={36}
              strokeWidth={1.6}
              className="text-green-700"
            />
          </div>

          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
            Order received
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em]">
            Thank you for your order
          </h1>

          <p className="mt-4 text-sm leading-7 text-black/50">
            {isManualPayment
              ? "Your order has been saved and your payment is awaiting verification."
              : "Your order has been saved successfully. Payment will be collected during delivery."}
          </p>

          <div className="mt-8 w-full border border-black/10 bg-[#f7f7f7] p-6 text-left">
            <SummaryRow
              label="Order Number"
              value={createdOrder.orderNumber}
            />

            <div className="my-4 border-t border-black/10" />

            <SummaryRow
              label="Order Total"
              value={formatPrice(
                createdOrder.total
              )}
            />

            <div className="my-4 border-t border-black/10" />

            <SummaryRow
              label="Order Status"
              value={createdOrder.status}
            />

            <div className="my-4 border-t border-black/10" />

            <SummaryRow
              label="Payment"
              value={
                isManualPayment
                  ? "Pending verification"
                  : "Cash on delivery"
              }
            />

            {isManualPayment &&
              paymentReference && (
                <>
                  <div className="my-4 border-t border-black/10" />

                  <SummaryRow
                    label="Payment Reference"
                    value={paymentReference}
                  />
                </>
              )}
          </div>

          {isManualPayment && (
            <div className="mt-5 w-full border-l-2 border-[#d90000] bg-[#f7f7f7] px-5 py-4 text-left">
              <p className="text-xs leading-6 text-black/55">
                The store will check your payment before
                processing the order. Keep your payment
                receipt until the order is confirmed.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/account"
              className="inline-flex h-12 items-center justify-center border border-black px-7 text-sm font-semibold transition hover:bg-black hover:text-white"
            >
              View My Orders
            </Link>

            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center bg-black px-8 text-sm font-semibold text-white transition hover:bg-black/80"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="bg-white text-black">
        <section className="mx-auto flex min-h-[650px] max-w-xl flex-col items-center justify-center px-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f4f4f4]">
            <ShoppingBag
              size={32}
              strokeWidth={1.5}
            />
          </div>

          <h1 className="mt-7 text-4xl font-bold tracking-[-0.03em]">
            Your cart is empty
          </h1>

          <p className="mt-4 text-sm leading-7 text-black/50">
            Add at least one product before
            continuing to checkout.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex h-12 items-center bg-black px-7 text-sm font-semibold text-white transition hover:bg-black/80"
          >
            Browse Products
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white text-black">
      <section className="border-b border-black/10 bg-[#f7f7f7]">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
            HONEYSTORE Checkout
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            Complete Your Order
          </h1>

          <p className="mt-3 text-sm text-black/50">
            Enter your delivery details and choose your
            payment method.
          </p>
        </div>
      </section>

      {error && (
        <section className="border-b border-red-200 bg-red-50">
          <div className="mx-auto max-w-[1440px] px-4 py-4 text-sm text-red-700 sm:px-6 lg:px-8">
            {error}
          </div>
        </section>
      )}

      <form onSubmit={handleSubmit}>
        <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
            <div className="space-y-10">
              <CheckoutSection
                step="Step 1"
                title="Contact Information"
              >
                <div className="grid gap-5">
                  <FormField
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required={false}
                  />

                  <FormField
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    placeholder="09xxxxxxxxx"
                    autoComplete="tel"
                    minLength={7}
                  />
                </div>
              </CheckoutSection>

              <CheckoutSection
                step="Step 2"
                title="Shipping Address"
              >
                <div className="grid gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      id="firstName"
                      label="First Name"
                      autoComplete="given-name"
                    />

                    <FormField
                      id="lastName"
                      label="Last Name"
                      autoComplete="family-name"
                    />
                  </div>

                  <FormField
                    id="address"
                    label="Address"
                    placeholder="Street address"
                    autoComplete="street-address"
                  />

                  <FormField
                    id="address2"
                    label="Apartment / Unit"
                    placeholder="Optional"
                    required={false}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      id="city"
                      label="City"
                      autoComplete="address-level1"
                    />

                    <FormField
                      id="township"
                      label="Township"
                      autoComplete="address-level2"
                      required={false}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="mb-2 block text-sm font-medium"
                    >
                      Country
                    </label>

                    <select
                      id="country"
                      name="country"
                      defaultValue="myanmar"
                      className={inputClass}
                    >
                      <option value="myanmar">
                        Myanmar
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className="mb-2 block text-sm font-medium"
                    >
                      Order Notes
                    </label>

                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      placeholder="Optional delivery instructions"
                      className="w-full resize-none border border-black/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                    />
                  </div>
                </div>
              </CheckoutSection>

              <CheckoutSection
                step="Step 3"
                title="Shipping Method"
              >
                <div className="flex items-center justify-between gap-5 border border-black p-5">
                  <div>
                    <p className="text-sm font-semibold">
                      Standard Delivery
                    </p>

                    <p className="mt-1 text-xs leading-5 text-black/45">
                      Delivery time will be confirmed with
                      your order.
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-semibold">
                    {shipping === 0
                      ? "Free"
                      : formatPrice(shipping)}
                  </span>
                </div>

                {subtotal <
                  FREE_SHIPPING_THRESHOLD && (
                  <p className="mt-3 text-xs text-black/45">
                    Free shipping for orders of{" "}
                    {formatPrice(
                      FREE_SHIPPING_THRESHOLD
                    )}{" "}
                    or more.
                  </p>
                )}
              </CheckoutSection>

              <CheckoutSection
                step="Step 4"
                title="Payment Method"
              >
                <div className="space-y-3">
                  <PaymentOption
                    value="KBZPAY"
                    title="KBZPay"
                    description="Transfer to the displayed KBZPay account."
                    selected={
                      paymentMethod === "KBZPAY"
                    }
                    onSelect={
                      selectPaymentMethod
                    }
                  />

                  <PaymentOption
                    value="WAVEPAY"
                    title="WavePay"
                    description="Transfer to the displayed WavePay account."
                    selected={
                      paymentMethod === "WAVEPAY"
                    }
                    onSelect={
                      selectPaymentMethod
                    }
                  />

                  <PaymentOption
                    value="BANK_TRANSFER"
                    title="Bank Transfer"
                    description="Transfer directly to the displayed bank account."
                    selected={
                      paymentMethod ===
                      "BANK_TRANSFER"
                    }
                    onSelect={
                      selectPaymentMethod
                    }
                  />

                  <PaymentOption
                    value="COD"
                    title="Cash on Delivery"
                    description="Pay in cash when the order is delivered."
                    selected={
                      paymentMethod === "COD"
                    }
                    onSelect={
                      selectPaymentMethod
                    }
                  />
                </div>

                <div className="mt-6">
                  <PaymentInstructions
                    paymentMethod={paymentMethod}
                    total={total}
                    paymentReference={
                      paymentReference
                    }
                    onPaymentReferenceChange={
                      setPaymentReference
                    }
                  />
                </div>
              </CheckoutSection>
            </div>

            <aside className="lg:sticky lg:top-[150px] lg:self-start">
              <div className="border border-black/10 bg-[#f7f7f7] p-6 sm:p-7">
                <h2 className="text-xl font-bold">
                  Order Summary
                </h2>

                <div className="mt-6 max-h-[340px] space-y-5 overflow-y-auto">
                  {items.map((item) => {
                    const itemTotal =
                      item.product.price *
                      item.quantity;

                    return (
                      <div
                        key={item.product.id}
                        className="flex justify-between gap-5 border-b border-black/10 pb-5"
                      >
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-black/40">
                            {item.product.brand ||
                              "HONEYSTORE"}
                          </p>

                          <p className="mt-1 text-sm font-medium">
                            {item.product.name}
                          </p>

                          <p className="mt-2 text-xs text-black/45">
                            Quantity:{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-semibold">
                          {formatPrice(itemTotal)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-4">
                  <SummaryRow
                    label="Subtotal"
                    value={formatPrice(subtotal)}
                  />

                  <SummaryRow
                    label="Shipping"
                    value={
                      shipping === 0
                        ? "Free"
                        : formatPrice(shipping)
                    }
                  />

                  <div className="border-t border-black/10 pt-4">
                    <div className="flex justify-between gap-5">
                      <span className="font-semibold">
                        Total
                      </span>

                      <span className="text-xl font-bold">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 h-12 w-full bg-black text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Placing Order..."
                    : paymentMethod === "COD"
                      ? "Place Order"
                      : "Submit Payment & Order"}
                </button>

                <p className="mt-4 text-center text-[11px] leading-5 text-black/40">
                  {paymentMethod === "COD"
                    ? "Payment will be collected during delivery."
                    : "Your payment will be manually verified before the order is processed."}
                </p>

                <Link
                  href="/cart"
                  className="mt-5 block text-center text-xs font-medium underline underline-offset-4"
                >
                  Return to Cart
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </form>
    </main>
  );
}

type CheckoutSectionProps = {
  step: string;
  title: string;
  children: ReactNode;
};

function CheckoutSection({
  step,
  title,
  children,
}: CheckoutSectionProps) {
  return (
    <section>
      <div className="border-b border-black/10 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/40">
          {step}
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          {title}
        </h2>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  required?: boolean;
};

function FormField({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  minLength,
  required = true,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium"
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        className={inputClass}
      />
    </div>
  );
}

type PaymentOptionProps = {
  value: PaymentMethod;
  title: string;
  description: string;
  selected: boolean;
  onSelect: (
    method: PaymentMethod
  ) => void;
};

function PaymentOption({
  value,
  title,
  description,
  selected,
  onSelect,
}: PaymentOptionProps) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-4 border p-5 transition ${
        selected
          ? "border-black bg-black/[0.02]"
          : "border-black/20"
      }`}
    >
      <input
        type="radio"
        name="payment"
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
        className="mt-1 h-4 w-4 accent-black"
      />

      <div>
        <p className="text-sm font-semibold">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-black/45">
          {description}
        </p>
      </div>
    </label>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({
  label,
  value,
}: SummaryRowProps) {
  return (
    <div className="flex justify-between gap-5 text-sm">
      <span className="text-black/50">
        {label}
      </span>

      <span className="break-all text-right font-medium">
        {value}
      </span>
    </div>
  );
}