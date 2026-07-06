const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(?:\+?84|0)\d{9}$/;
const passwordUppercaseRegex = /[A-Z]/;
const passwordNumberRegex = /\d/;
const passwordSpecialRegex = /[^A-Za-z0-9]/;

const USER_STORAGE_KEY = "shop-online-user";
const TOKEN_STORAGE_KEY = "shop-online-token";

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
    throw new Error("Vui lòng nhập tài khoản và mật khẩu!");
  }

  if (!isValidAccountValue(normalizedMail)) {
    throw new Error("Nhập email hợp lệ hoặc số điện thoại hợp lệ");
  }

  if (!isStrongPassword(password)) {
    throw new Error(
      "Mật khẩu phải có ít nhất 8 ký tự, có chữ hoa, số và ký tự đặc biệt",
    );
  }

  const res = await fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mail: normalizedMail, password }),
  });

  const data = await res
    .json()
    .catch(() => ({ message: "Server không trả JSON hợp lệ" }));

  if (!res.ok) {
    throw new Error(data?.message || "Có lỗi xảy ra");
  }

  const user = {
    mail: data?.user?.mail || normalizedMail,
    displayName: data?.user?.name || data?.user?.mail || normalizedMail,
    role: data?.user?.role || "user",
  };

  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    if (data?.access_token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
    }
  }

  return { user, accessToken: data?.access_token || null };
}

export async function submitSellerRegistration() {
  if (typeof window === "undefined" || !window.localStorage) {
    throw new Error("Không tìm thấy phiên đăng nhập");
  }

  const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);

  if (!token) {
    throw new Error("Vui lòng đăng nhập trước khi đăng ký người bán");
  }

  const res = await fetch("http://127.0.0.1:5000/register-seller", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res
    .json()
    .catch(() => ({ message: "Server không trả JSON hợp lệ" }));

  if (!res.ok) {
    throw new Error(data?.message || "Không thể đăng ký người bán");
  }

  const user = {
    mail: data?.user?.mail,
    displayName: data?.user?.name || data?.user?.mail,
    role: data?.user?.role || "seller",
    id: data?.user?.id,
  };

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  return user;
}
