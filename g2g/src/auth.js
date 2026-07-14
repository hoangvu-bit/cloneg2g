const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(?:\+?84|0)\d{9}$/;
const passwordUppercaseRegex = /[A-Z]/;
const passwordNumberRegex = /\d/;
const passwordSpecialRegex = /[^A-Za-z0-9]/;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";
const VALID_ROLES = new Set(["user", "seller", "admin"]);

function normalizeRole(role) {
  const normalized = `${role || "user"}`.trim().toLowerCase();
  if (["regular", "customer", "member"].includes(normalized)) {
    return "user";
  }
  return VALID_ROLES.has(normalized) ? normalized : "user";
}

function getCookie(name) {
  if (typeof document === "undefined") {
    return "";
  }
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1] || "";
}

async function apiFetch(path, options = {}) {
  const method = options.method || "GET";
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (!["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase())) {
    headers["X-CSRF-Token"] = decodeURIComponent(getCookie("csrf_token"));
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method,
    credentials: "include",
    headers,
  });

  const data = await res
    .json()
    .catch(() => ({ message: "Server khong tra JSON hop le" }));

  if (!res.ok) {
    throw new Error(data?.message || data?.error || "Co loi xay ra");
  }

  return data;
}

export async function fetchCurrentUser() {
  const data = await apiFetch("/profile");
  const user = data?.user;
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    mail: user.mail,
    displayName: user.name || user.mail,
    name: user.name,
    role: normalizeRole(user.role),
    balance: user.balance || 0,
  };
}

export const normalizeAccountValue = (value = "") =>
  value.replace(/[\s-]/g, "").trim();

export const isValidAccountValue = (value = "") => {
  const normalized = normalizeAccountValue(value);
  return emailRegex.test(normalized) || phoneRegex.test(normalized);
};

export const isStrongPassword = (value = "") =>
  value.length >= 8 &&
  passwordUppercaseRegex.test(value) &&
  passwordNumberRegex.test(value) &&
  passwordSpecialRegex.test(value);

export async function submitLogin({ mail, password }) {
  const normalizedMail = normalizeAccountValue(mail);

  if (!normalizedMail || !password) {
    throw new Error("Vui lÃ²ng nháº­p tÃ i khoáº£n vÃ  máº­t kháº©u!");
  }

  if (!isValidAccountValue(normalizedMail)) {
    throw new Error("Nháº­p email há»£p lá»‡ hoáº·c sá»‘ Ä‘iá»‡n thoáº¡i há»£p lá»‡");
  }

  if (!isStrongPassword(password)) {
    throw new Error(
      "Máº­t kháº©u pháº£i cÃ³ Ã­t nháº¥t 8 kÃ½ tá»±, cÃ³ chá»¯ hoa, sá»‘ vÃ  kÃ½ tá»± Ä‘áº·c biá»‡t",
    );
  }

  const data = await apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ mail: normalizedMail, password }),
  });

  const user = {
    mail: data?.user?.mail || normalizedMail,
    displayName: data?.user?.name || data?.user?.mail || normalizedMail,
    role: normalizeRole(data?.user?.role),
  };

  return { user, accessToken: null };
}

export async function submitSellerRegistration() {
  if (typeof window === "undefined" || !window.localStorage) {
    throw new Error("KhÃ´ng tÃ¬m tháº¥y phiÃªn Ä‘Äƒng nháº­p");
  }

  const data = await apiFetch("/register-seller", {
    method: "POST",
  });

  const user = {
    mail: data?.user?.mail,
    displayName: data?.user?.name || data?.user?.mail,
    role: normalizeRole(data?.user?.role || "user"),
    id: data?.user?.id,
  };

  return user;
}

export async function submitProductListing({
  title,
  description,
  price,
  quantity,
  imageUrl,
}) {
  if (typeof window === "undefined" || !window.localStorage) {
    throw new Error("KhÃ´ng tÃ¬m tháº¥y phiÃªn Ä‘Äƒng nháº­p");
  }

  const data = await apiFetch("/products", {
    method: "POST",
    body: JSON.stringify({
      title,
      description,
      price,
      quantity,
      image: imageUrl,
    }),
  });

  return data;
}

export async function fetchRecentProducts() {
  const data = await apiFetch("/products");
  return data?.products || [];
}

export async function fetchPaymentRequests(status = "pending") {
  const data = await apiFetch(
    `/admin/payment-requests?status=${encodeURIComponent(status)}`,
  );
  return data?.payment_requests || [];
}

export async function approvePaymentRequest(paymentRequestId) {
  return apiFetch(`/admin/payment-requests/${paymentRequestId}/approve`, {
    method: "POST",
  });
}
