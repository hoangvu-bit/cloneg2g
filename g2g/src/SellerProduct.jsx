import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { fetchRecentProducts, submitProductListing } from "./auth.js";

const initialForm = {
  title: "",
  description: "",
  price: "",
  quantity: "",
  imageUrl: "",
};

export default function SellerProduct({ user, onBack }) {
  const [form, setForm] = useState(initialForm);
  const [recentListings, setRecentListings] = useState([]);
  const [loadingRecentListings, setLoadingRecentListings] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("info");
  const [submitting, setSubmitting] = useState(false);
  const noticeRef = useRef(null);

  const displayName = useMemo(
    () => user?.displayName || user?.name || user?.mail || "Người bán",
    [user],
  );

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.price.trim() ||
      !form.quantity.trim() ||
      !form.description.trim()
    ) {
      setNoticeType("error");
      setNotice("Vui lòng nhập đầy đủ Title, Description, Price và Quantity.");
      return;
    }

    try {
      setSubmitting(true);
      await submitProductListing({
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        quantity: Number(form.quantity),
        imageUrl: form.imageUrl.trim(),
      });
      setNoticeType("success");
      setNotice(
        `Đăng bài thành công: "${form.title.trim()}" đã được lưu vào database.`,
      );
      setForm(initialForm);
      await loadRecentProducts();
    } catch (error) {
      setNoticeType("error");
      setNotice(error?.message || "Không thể đăng sản phẩm");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (notice && noticeRef.current) {
      noticeRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [notice]);

  const loadRecentProducts = async () => {
    try {
      setLoadingRecentListings(true);
      const products = await fetchRecentProducts();
      setRecentListings(products);
    } catch (error) {
      setNoticeType("error");
      setNotice(error?.message || "Không thể tải các bài đăng gần đây");
    } finally {
      setLoadingRecentListings(false);
    }
  };

  useEffect(() => {
    loadRecentProducts();
  }, []);

  return (
    <div className="seller-product-page">
      <div className="container seller-product-shell">
        <div className="seller-product-hero">
          <button
            type="button"
            className="seller-product-back"
            onClick={onBack}
          >
            ← Quay lại
          </button>
          <div>
            <span className="seller-product-kicker">Khu vực người bán</span>
            <h1>Đăng sản phẩm của bạn</h1>
            <p>
              Xin chào {displayName}. Trang này chỉ dành cho tài khoản có role
              seller để tạo bản nháp đăng bán sản phẩm.
            </p>
          </div>
        </div>

        {notice && (
          <div
            ref={noticeRef}
            className={`seller-product-notice seller-product-notice--${noticeType}`}
          >
            {notice}
          </div>
        )}

        <div className="seller-product-layout">
          <form className="seller-product-card" onSubmit={handleSubmit}>
            <div className="seller-product-card-header">
              <h2>Thông tin sản phẩm</h2>
              <p>Nhập đúng dữ liệu theo schema backend Products.</p>
            </div>

            <div className="seller-product-grid">
              <div className="form-group seller-span-2">
                <label htmlFor="seller-title">Title</label>
                <input
                  id="seller-title"
                  className="form-control"
                  placeholder="Ví dụ: Tài khoản Valorant Radiant 2 Act..."
                  value={form.title}
                  onChange={handleChange("title")}
                />
              </div>

              <div className="form-group">
                <label htmlFor="seller-price">Price</label>
                <input
                  id="seller-price"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="150000"
                  value={form.price}
                  onChange={handleChange("price")}
                />
              </div>

              <div className="form-group">
                <label htmlFor="seller-quantity">Quantity</label>
                <input
                  id="seller-quantity"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="10"
                  value={form.quantity}
                  onChange={handleChange("quantity")}
                />
              </div>

              <div className="form-group seller-span-2">
                <label htmlFor="seller-description">Description</label>
                <textarea
                  id="seller-description"
                  className="form-control"
                  rows="5"
                  placeholder="Mô tả chi tiết về sản phẩm, bảo hành, thời gian giao..."
                  value={form.description}
                  onChange={handleChange("description")}
                />
              </div>

              <div className="form-group seller-span-2">
                <label htmlFor="seller-image">ImageUrl</label>
                <input
                  id="seller-image"
                  className="form-control"
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={handleChange("imageUrl")}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary seller-product-submit"
              disabled={submitting}
            >
              {submitting ? "Đang đăng bài..." : "Đăng bài vào database"}
            </button>
          </form>

          <aside className="seller-product-sidebar">
            <div className="seller-product-preview-card">
              <h3>Xem trước</h3>
              <div className="seller-product-preview-title">
                {form.title || "Title sẽ hiển thị ở đây"}
              </div>
              <div className="seller-product-preview-price">
                {form.price ? Number(form.price).toLocaleString("vi-VN") : "0"}₫
              </div>
              <p>
                {form.description || "Description của bạn sẽ xuất hiện ở đây."}
              </p>
            </div>

            <div className="seller-product-preview-card">
              <h3>Các bài đăng gần đây</h3>
              {loadingRecentListings ? (
                <div className="seller-product-empty">
                  Đang tải dữ liệu từ database...
                </div>
              ) : recentListings.length === 0 ? (
                <div className="seller-product-empty">
                  Chưa có bài đăng nào trong database.
                </div>
              ) : (
                <div className="seller-product-list">
                  {recentListings.map((listing) => (
                    <article
                      key={listing.id}
                      className="seller-product-list-item"
                    >
                      <div className="seller-product-list-item-top">
                        <strong>{listing.title}</strong>
                        <span>
                          {Number(listing.price).toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                      <div className="seller-product-list-item-meta">
                        <span>Seller: {listing.sellerName || "Người bán"}</span>
                        <span>Quantity: {listing.quantity}</span>
                        <span>
                          ImageUrl: {listing.imageUrl ? "Có" : "Trống"}
                        </span>
                      </div>
                      <p>{listing.createdAt || ""}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
