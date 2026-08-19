import { getCustomerToken } from "./customer-auth";

export type PaymentMethod =
  | "COD"
  | "KBZPAY"
  | "WAVEPAY"
  | "BANK_TRANSFER";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type CreateOrderInput = {
  customerName: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  township?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  paymentProofUrl?: string;
  paymentReference?: string;
  items: {
    productId: string;
    quantity: number;
  }[];
};

export type OrderItem = {
  id: string;
  orderId?: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
};

export type CreatedOrder = {
  id: string;
  userId: string | null;
  orderNumber: string;
  customerName: string;
  email: string | null;
  phone: string;
  address: string;
  city: string;
  township: string | null;
  notes: string | null;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentProofUrl: string | null;
  paymentReference: string | null;
  paidAt: string | null;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type CustomerOrder = CreatedOrder;

function getApiUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api"
  );
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

export async function createOrder(
  order: CreateOrderInput
): Promise<CreatedOrder> {
  const token = getCustomerToken();

  const response = await fetch(
    `${getApiUrl()}/orders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
      body: JSON.stringify(order),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }

  return response.json();
}

export async function getMyOrders(): Promise<
  CustomerOrder[]
> {
  const token = getCustomerToken();

  if (!token) {
    throw new Error(
      "Please sign in to view your orders"
    );
  }

  const response = await fetch(
    `${getApiUrl()}/orders/my-orders`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }

  return response.json();
}

export async function trackOrder(
  orderNumber: string,
  phone: string
): Promise<CustomerOrder> {
  const response = await fetch(
    `${getApiUrl()}/orders/track`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderNumber: orderNumber
          .trim()
          .toUpperCase(),
        phone: phone.trim(),
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