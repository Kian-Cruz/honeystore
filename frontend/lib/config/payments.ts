export type ManualPaymentMethod =
  | "KBZPAY"
  | "WAVEPAY"
  | "BANK_TRANSFER";

export type PaymentAccount = {
  method: ManualPaymentMethod;
  title: string;
  accountName: string;
  accountNumber: string;
  instructions: string;
  qrImage: string | null;
};

export const paymentAccounts: Record<
  ManualPaymentMethod,
  PaymentAccount
> = {
  KBZPAY: {
    method: "KBZPAY",
    title: "KBZPay",
    accountName: "YOUR ACCOUNT NAME",
    accountNumber: "09XXXXXXXXX",
    instructions:
      "Transfer the exact order total using KBZPay, then upload your payment screenshot.",
    qrImage: null,
  },

  WAVEPAY: {
    method: "WAVEPAY",
    title: "WavePay",
    accountName: "YOUR ACCOUNT NAME",
    accountNumber: "09XXXXXXXXX",
    instructions:
      "Transfer the exact order total using WavePay, then upload your payment screenshot.",
    qrImage: null,
  },

  BANK_TRANSFER: {
    method: "BANK_TRANSFER",
    title: "Bank Transfer",
    accountName: "YOUR ACCOUNT NAME",
    accountNumber: "YOUR BANK ACCOUNT NUMBER",
    instructions:
      "Transfer the exact order total to this bank account, then upload your payment receipt.",
    qrImage: null,
  },
};

export function isManualPaymentMethod(
  method: string
): method is ManualPaymentMethod {
  return (
    method === "KBZPAY" ||
    method === "WAVEPAY" ||
    method === "BANK_TRANSFER"
  );
}

export function getPaymentAccount(
  method: string
): PaymentAccount | null {
  if (!isManualPaymentMethod(method)) {
    return null;
  }

  return paymentAccounts[method];
}