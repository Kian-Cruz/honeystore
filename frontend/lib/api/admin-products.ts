import { getAdminToken } from "./auth";

export type ProductInput = {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  category:
    | "fashion"
    | "footwear"
    | "beauty";
  subcategory?: string | null;
  brand: string;
  image: string;
  images: string[];
  stock: number;
  featured: boolean;
  newArrival: boolean;
  active: boolean;
};

function getApiUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api"
  );
}

function getAuthHeaders() {
  const token = getAdminToken();

  if (!token) {
    throw new Error(
      "Please sign in as an administrator"
    );
  }

  return {
    "Content-Type": "application/json",
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
    "The request could not be completed"
  );
}

export async function createProduct(
  product: ProductInput
) {
  const response = await fetch(
    `${getApiUrl()}/products`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }

  return response.json();
}

export async function updateProduct(
  id: string,
  product: Partial<ProductInput>
) {
  const response = await fetch(
    `${getApiUrl()}/products/${id}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }

  return response.json();
}

export async function deleteProduct(
  id: string
) {
  const response = await fetch(
    `${getApiUrl()}/products/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }

  return response.json();
}