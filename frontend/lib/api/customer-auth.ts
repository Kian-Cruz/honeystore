export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
};

type CustomerAuthResponse = {
  accessToken: string;
  user: Customer;
};

export type RegisterCustomerInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

const TOKEN_KEY =
  "honeystore_customer_token";

const CUSTOMER_KEY =
  "honeystore_customer";

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

function saveCustomerSession(
  response: CustomerAuthResponse
) {
  localStorage.setItem(
    TOKEN_KEY,
    response.accessToken
  );

  localStorage.setItem(
    CUSTOMER_KEY,
    JSON.stringify(response.user)
  );
}

export async function registerCustomer(
  input: RegisterCustomerInput
): Promise<CustomerAuthResponse> {
  const response = await fetch(
    `${getApiUrl()}/customers/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }

  const result: CustomerAuthResponse =
    await response.json();

  saveCustomerSession(result);

  return result;
}

export async function loginCustomer(
  email: string,
  password: string
): Promise<CustomerAuthResponse> {
  const response = await fetch(
    `${getApiUrl()}/customers/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }

  const result: CustomerAuthResponse =
    await response.json();

  saveCustomerSession(result);

  return result;
}

export function getCurrentCustomer():
  | Customer
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedCustomer =
    localStorage.getItem(CUSTOMER_KEY);

  if (!storedCustomer) {
    return null;
  }

  try {
    return JSON.parse(
      storedCustomer
    ) as Customer;
  } catch {
    return null;
  }
}

export function getCustomerToken():
  | string
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function logoutCustomer() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CUSTOMER_KEY);
}