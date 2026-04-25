import { getApiV1Path } from "./api";

/** Next proxy 502/500 when Nest is down or wrong port — response body is not always JSON. */
async function httpErrorMessage(
  res: Response,
  fallback: string,
  url: string,
): Promise<string> {
  const err = (await res.json().catch(() => ({}))) as { message?: unknown };
  if (typeof err.message === "string") {
    return err.message;
  }
  if (res.status === 401) {
    return "Unauthorized — sign out and sign in again. If this persists, the server JWT secret may have changed.";
  }
  if (res.status === 403) {
    return "Forbidden — you need an admin account for this action.";
  }
  if (res.status >= 500) {
    return `Proxy/API error (${res.status}): The Nest server may be stopped. In another terminal, run \`npm run start:dev\` in the \`visa-adviser-backend\` folder (default port 4000). If the API uses a different port, set \`BACKEND_INTERNAL_URL\` in \`.env.local\`. URL: ${url}`;
  }
  return res.statusText || fallback;
}

function networkErrorMessage(cause: unknown, url: string): string {
  if (cause instanceof TypeError) {
    return `Network / connection failed (${url}). Is the Nest API running? Same-origin use: set BACKEND_INTERNAL_URL in .env.local (default 127.0.0.1:4000) or use NEXT_PUBLIC_API_URL for direct API URL + CORS.`;
  }
  if (cause instanceof Error) {
    return cause.message;
  }
  return "Request failed";
}

export type AuthResponse = {
  accessToken: string;
  tokenType: string;
};

export type RegisterBody = {
  fullName: string;
  email: string;
  password: string;
  referralCode?: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export async function loginRequest(body: LoginBody): Promise<AuthResponse> {
  const url = getApiV1Path("/auth/login");
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw new Error(networkErrorMessage(e, url));
  }
  if (!res.ok) {
    throw new Error(await httpErrorMessage(res, "Login failed", url));
  }
  return res.json() as Promise<AuthResponse>;
}

export async function registerRequest(body: RegisterBody): Promise<AuthResponse> {
  const url = getApiV1Path("/auth/register");
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw new Error(networkErrorMessage(e, url));
  }
  if (!res.ok) {
    throw new Error(
      await httpErrorMessage(res, "Registration failed", url),
    );
  }
  return res.json() as Promise<AuthResponse>;
}

export type DashboardResponse = {
  profile: {
    fullName: string;
    email: string;
    referralCode: string;
    isVerified: boolean;
  };
  totalPoints: number;
  pendingPoints: number;
  expiredPoints: number;
  rank: string;
  rewards: string[];
  progress: {
    toGold: number;
    toPlatinum: number;
    toSuperPlatinum: number;
  };
  referralTree: Array<{
    _id: string;
    fullName: string;
    email: string;
    referralCode: string;
    activePoints: number;
    rank: string;
    createdAt?: string;
  }>;
};

export async function fetchDashboard(
  accessToken: string
): Promise<DashboardResponse> {
  const url = getApiV1Path("/users/me/dashboard");
  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (e) {
    throw new Error(networkErrorMessage(e, url));
  }
  if (!res.ok) {
    throw new Error(
      await httpErrorMessage(res, "Failed to load dashboard", url),
    );
  }
  return res.json() as Promise<DashboardResponse>;
}

export type AdminUserRow = {
  _id: string;
  fullName: string;
  email: string;
  referralCode: string;
  isVerified: boolean;
  verifiedAt?: string | null;
  activePoints: number;
  pendingPoints: number;
  rank: string;
  createdAt?: string;
  parentId?: string | null;
  directReferrals?: string[];
};

export type VisaRegistrationRow = {
  _id: string;
  fullName: string;
  fatherOrHusbandName: string;
  phoneNumber: string;
  whatsappNumber: string;
  dateOfBirth: string;
  email: string;
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
  children: number;
  countriesVisited: string[];
  rejectedVisaCountries: string[];
  visaApprovedButNotVisitedCountries: string[];
  createdAt?: string;
};

export async function fetchAdminUsers(accessToken: string): Promise<AdminUserRow[]> {
  const url = getApiV1Path("/admin/users");
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (e) {
    throw new Error(networkErrorMessage(e, url));
  }
  if (!res.ok) {
    throw new Error(await httpErrorMessage(res, "Failed to load users", url));
  }
  return res.json() as Promise<AdminUserRow[]>;
}

export async function verifyUserAsAdmin(
  accessToken: string,
  userId: string,
): Promise<AdminUserRow> {
  const url = getApiV1Path(`/admin/users/${encodeURIComponent(userId)}/verify`);
  let res: Response;
  try {
    res = await fetch(url, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (e) {
    throw new Error(networkErrorMessage(e, url));
  }
  if (!res.ok) {
    throw new Error(await httpErrorMessage(res, "Verify failed", url));
  }
  return res.json() as Promise<AdminUserRow>;
}

export async function fetchVisaRegistrations(
  accessToken: string,
): Promise<VisaRegistrationRow[]> {
  const url = getApiV1Path("/registration");
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (e) {
    throw new Error(networkErrorMessage(e, url));
  }
  if (!res.ok) {
    throw new Error(
      await httpErrorMessage(res, "Failed to load visa registrations", url),
    );
  }
  return res.json() as Promise<VisaRegistrationRow[]>;
}

export async function deleteVisaRegistration(
  accessToken: string,
  registrationId: string,
): Promise<void> {
  const url = getApiV1Path(`/registration/${encodeURIComponent(registrationId)}`);
  let res: Response;
  try {
    res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (e) {
    throw new Error(networkErrorMessage(e, url));
  }
  if (!res.ok) {
    throw new Error(
      await httpErrorMessage(res, "Failed to delete visa registration", url),
    );
  }
}
