import { useState } from "react";
import "./App.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(?:\+?84|0)\d{9}$/;
const passwordUppercaseRegex = /[A-Z]/;
const passwordNumberRegex = /\d/;
const passwordSpecialRegex = /[^A-Za-z0-9]/;

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
  };

  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.setItem("shop-online-user", JSON.stringify(user));
  }

  return user;
}

export default function LoginModal({ onClose }) {
  const [mode, setMode] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const closeModal = () => {
    onClose?.();
    setMode("login");
    setLoginEmail("");
    setLoginPassword("");
    setSignupUsername("");
    setSignupEmail("");
    setSignupPassword("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const normalizedMail = normalizeAccountValue(loginEmail);

      if (!normalizedMail || !loginPassword) {
        alert("Vui lòng nhập tài khoản và mật khẩu!");
        return;
      }

      if (!isValidAccountValue(normalizedMail)) {
        alert("Email hoặc số điện thoại không hợp lệ!");
        return;
      }

      if (!isStrongPassword(loginPassword)) {
        alert("Mật khẩu không đúng định dạng!");
        return;
      }

      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mail: normalizedMail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // Lưu thông tin người dùng
      localStorage.setItem("shop-online-user", JSON.stringify(data.user));

      alert(data.message);
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối đến server!");
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupUsername,
          mail: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message); // Đăng ký thành công
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối đến server!");
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="modal-close" onClick={closeModal}>
          ×
        </span>
        {mode === "login" ? (
          <>
            <h3
              style={{
                marginBottom: "24px",
                fontSize: "22px",
                fontWeight: 800,
              }}
            >
              Đăng Nhập G2G
            </h3>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Email hoặc Tên đăng nhập</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email hoặc số điện thoại"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: "8px" }}>
                <label>Mật khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <div style={{ textAlign: "right", marginBottom: "24px" }}>
                <a
                  href="#forgot"
                  style={{ fontSize: "12px", color: "var(--brand-red)" }}
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Mã khôi phục đã gửi!");
                  }}
                >
                  Quên mật khẩu?
                </a>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px" }}
              >
                Đăng Nhập
              </button>
            </form>
            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
                fontSize: "13px",
                color: "var(--text-secondary)",
              }}
            >
              Chưa có tài khoản?{" "}
              <span
                style={{
                  color: "var(--brand-red)",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onClick={() => setMode("signup")}
              >
                Đăng ký ngay
              </span>
            </div>
          </>
        ) : (
          <>
            <h3
              style={{
                marginBottom: "24px",
                fontSize: "22px",
                fontWeight: 800,
              }}
            >
              Tạo Tài Khoản Mới
            </h3>
            <form onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label>Tên hiển thị</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: gamer_pro102"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Địa chỉ Email</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email hoặc số điện thoại"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu (Tối thiểu 6 ký tự)</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  minLength="6"
                  required
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "24px",
                  alignItems: "flex-start",
                }}
              >
                <input
                  type="checkbox"
                  id="termsAgree"
                  required
                  style={{ marginTop: "3px" }}
                />
                <label
                  htmlFor="termsAgree"
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.4,
                    cursor: "pointer",
                  }}
                >
                  Tôi đồng ý với các điều khoản hoạt động và cam kết bảo vệ
                  thông tin của G2G Marketplace.
                </label>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px" }}
              >
                Đăng Ký Tài Khoản
              </button>
            </form>
            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
                fontSize: "13px",
                color: "var(--text-secondary)",
              }}
            >
              Đã có tài khoản?{" "}
              <span
                style={{
                  color: "var(--brand-red)",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onClick={() => setMode("login")}
              >
                Đăng nhập
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
