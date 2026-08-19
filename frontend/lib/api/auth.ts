type LoginResponse = {
  accessToken: string;
  admin: {
    email: string;
    role: "admin";
  };
};

const TOKEN_KEY = "honeystore_admin_token";

function getApiUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api"
  );
}

export async function loginAdmin(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(
    `${getApiUrl()}/auth/login`,
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
    const result = await response
      .json()
      .catch(() => null);

    throw new Error(
      result?.message ??
        "Invalid email or password"
    );
  }

  const result: LoginResponse =
    await response.json();

  localStorage.setItem(
    TOKEN_KEY,
    result.accessToken
  );

  return result;
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function isAdminLoggedIn(): boolean {
  return Boolean(getAdminToken());
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
}