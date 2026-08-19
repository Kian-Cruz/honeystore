"use client";

import Image from "next/image";
import {
  Banknote,
  CheckCircle2,
  Copy,
  QrCode,
} from "lucide-react";
import { useState } from "react";

import {
  getPaymentAccount,
  isManualPaymentMethod,
} from "@/lib/config/payments";
import { formatPrice } from "@/lib/utils/currency";

type PaymentInstructionsProps = {
  paymentMethod: string;
  total: number;
  paymentReference: string;
  onPaymentReferenceChange: (
    value: string
  ) => void;
};

export default function PaymentInstructions({
  paymentMethod,
  total,
  paymentReference,
  onPaymentReferenceChange,
}: PaymentInstructionsProps) {
  const [copied, setCopied] = useState(false);

  if (paymentMethod === "COD") {
    return (
      <div className="border border-black/10 bg-[#f7f7f7] p-5">
        <div className="flex items-start gap-3">
          <Banknote
            size={21}
            strokeWidth={1.6}
            className="mt-0.5 shrink-0"
          />

          <div>
            <h3 className="text-sm font-semibold">
              Cash on Delivery
            </h3>

            <p className="mt-2 text-xs leading-6 text-black/55">
              Pay {formatPrice(total)} in cash when your
              order is delivered.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isManualPaymentMethod(paymentMethod)) {
    return null;
  }

  const account =
    getPaymentAccount(paymentMethod);

  if (!account) {
    return null;
  }

  async function copyAccountNumber() {
    try {
      await navigator.clipboard.writeText(
        account!.accountNumber
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="border border-black/10 bg-[#f7f7f7] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <QrCode
          size={21}
          strokeWidth={1.6}
          className="mt-0.5 shrink-0"
        />

        <div>
          <h3 className="text-sm font-semibold">
            Pay with {account.title}
          </h3>

          <p className="mt-2 text-xs leading-6 text-black/55">
            {account.instructions}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/40">
              Account Name
            </p>

            <p className="mt-1 text-sm font-semibold">
              {account.accountName}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/40">
              Account Number
            </p>

            <div className="mt-1 flex items-center gap-3">
              <p className="break-all text-sm font-semibold">
                {account.accountNumber}
              </p>

              <button
                type="button"
                onClick={copyAccountNumber}
                className="inline-flex h-8 shrink-0 items-center gap-1.5 border border-black/15 bg-white px-3 text-[11px] font-semibold transition hover:border-black"
              >
                {copied ? (
                  <CheckCircle2
                    size={14}
                    strokeWidth={1.7}
                  />
                ) : (
                  <Copy
                    size={14}
                    strokeWidth={1.7}
                  />
                )}

                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/40">
              Amount to Transfer
            </p>

            <p className="mt-1 text-xl font-bold">
              {formatPrice(total)}
            </p>
          </div>
        </div>

        {account.qrImage && (
          <div className="w-full sm:w-[180px]">
            <div className="relative aspect-square overflow-hidden border border-black/10 bg-white">
              <Image
                src={account.qrImage}
                alt={`${account.title} payment QR`}
                fill
                className="object-contain p-2"
                sizes="180px"
              />
            </div>

            <p className="mt-2 text-center text-[10px] text-black/40">
              Scan to pay
            </p>
          </div>
        )}
      </div>

      {!account.qrImage && (
        <div className="mt-5 border border-dashed border-black/20 bg-white px-4 py-3">
          <p className="text-xs leading-5 text-black/50">
            QR payment is not available yet. Use the account
            number above to complete the transfer.
          </p>
        </div>
      )}

      <div className="mt-6">
        <label
          htmlFor="paymentReference"
          className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/50"
        >
          Transaction Reference
        </label>

        <input
          id="paymentReference"
          type="text"
          value={paymentReference}
          onChange={(event) =>
            onPaymentReferenceChange(
              event.target.value
            )
          }
          placeholder="Enter transaction ID or reference"
          maxLength={150}
          className="mt-2 h-12 w-full border border-black/20 bg-white px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black"
        />

        <p className="mt-2 text-[11px] leading-5 text-black/40">
          Enter the reference shown in your payment
          application so the store can verify your payment.
        </p>
      </div>

      <div className="mt-5 border-l-2 border-[#d90000] bg-white px-4 py-3">
        <p className="text-xs leading-5 text-black/55">
          Your order will remain pending until the store
          confirms the payment. Do not send money to any
          account other than the one displayed here.
        </p>
      </div>
    </div>
  );
}