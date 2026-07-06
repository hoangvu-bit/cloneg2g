import { useMemo, useState } from "react";
import "./App.css";
import { submitSellerRegistration } from "./auth.js";

export default function RegisterSeller({ user, onBack, onConfirm }) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const displayName = useMemo(
    () => user?.displayName || user?.name || user?.mail || "Người dùng",
    [user],
  );

  const handleConfirm = async () => {
    if (!acceptedTerms) {
      return;
    }

    try {
      setSubmitting(true);
      const updatedUser = await submitSellerRegistration();
      onConfirm?.(updatedUser);
    } catch (error) {
      alert(error.message || "Không thể đăng ký người bán");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-seller-page">
      <div className="container register-seller-shell">
        <div className="register-seller-card">
          <div className="register-seller-header">
            <button
              type="button"
              className="register-seller-back"
              onClick={onBack}
            >
              ← Quay lại
            </button>
            <div className="register-seller-title-group">
              <span className="register-seller-kicker">Đăng ký người bán</span>
              <h1>Chào {displayName}</h1>
              <p>
                Chấp nhận điều khoản của chúng tôi để chuyển tài khoản từ role
                user sang role seller.
              </p>
            </div>
          </div>

          <div className="register-seller-terms-box">
            <h2>Điều khoản đăng ký</h2>
            <ul>
              <li>Cam kết cung cấp sản phẩm hoặc dịch vụ đúng mô tả.</li>
              <li>Không gian lận, không bán hàng vi phạm quy định.</li>
              <li>Tuân thủ quy trình giao dịch và hỗ trợ khách hàng.</li>
            </ul>

            <label
              className="register-seller-checkbox-row"
              htmlFor="seller-terms"
            >
              <input
                id="seller-terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <span>Tôi đã đọc và đồng ý với điều khoản của chúng tôi.</span>
            </label>
          </div>

          <button
            type="button"
            className="btn btn-primary register-seller-confirm"
            disabled={!acceptedTerms || submitting}
            onClick={handleConfirm}
          >
            {submitting ? "Đang xác nhận..." : "Xác nhận đăng ký"}
          </button>
        </div>
      </div>
    </div>
  );
}
