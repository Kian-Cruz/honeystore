import { getAdminToken } from "./auth";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type PaymentMethod =
  | "COD"
  | "KBZPAY"
  | "WAVEPAY"
  | "BANK_TRANSFER";

export type AdminOrderItem = {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
};

export type AdminOrderCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
};

export type AdminOrder = {
  id: string;
  userId: string | null;
  user?: AdminOrderCustomer | null;
  orderNumber: string;
  customerName: string;
  email: string | null;
  phone: string;
  address: string;
  city: string;
  township: string | null;
  notes: string | null;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference: string | null;
  paymentProofUrl: string | null;
  paidAt: string | null;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  total: number;
  items: AdminOrderItem[];
  createdAt: string;
  updatedAt: string;
};

function getApiUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api"
  );
}

function getAuthorizationHeader() {
  const token = getAdminToken();

  if (!token) {
    throw new Error(
      "Please sign in as an administrator"
    );
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

async function getErrorMessage(
  response: Response
): Promise<string> {
  const result = await response
    .json()
    .catch(() => null);

  if (Array.isArray(result?.message)) {
    return result.message.join(", ");
  }

  return (
    result?.message ??
    "Unable to complete the request"
  );
}

export async function getAdminOrders(): Promise<
  AdminOrder[]
> {
  const response = await fetch(
    `${getApiUrl()}/orders`,
    {
      cache: "no-store",
      headers: getAuthorizationHeader(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }

  return response.json();
}

export async function updateAdminOrderStatus(
  id: string,
  status: OrderStatus,
  paymentStatus: PaymentStatus
): Promise<AdminOrder> {
  const response = await fetch(
    `${getApiUrl()}/orders/${id}/status`,
    {
      method: "PATCH",
      headers: {
        ...getAuthorizationHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        paymentStatus,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }

  return response.json();
}