import { useState } from "react";

function Test() {
  const [address, setAddress] = useState("Nhấn nút để lấy vị trí...");

  const getLocation = () => {
    if (!navigator.geolocation) {
      setAddress("Trình duyệt không hỗ trợ định vị");
      return;
    }

    // Cấu hình để lấy vị trí chính xác nhất (GPS)
    const options = {
      enableHighAccuracy: true, // Ép dùng GPS nếu có
      timeout: 10000, // Chờ tối đa 10s
      maximumAge: 0, // Không dùng dữ liệu cũ
    };

    setAddress("Đang xác định vị trí chính xác...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Gửi tọa độ lên Backend để lấy tên địa chỉ (Reverse Geocoding)
          const response = await fetch("http://localhost:5000/save-location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude }),
          });

          const data = await response.json();
          setAddress(data.address);
        } catch (err) {
          setAddress("Lỗi kết nối đến server backend.");
        }
      },
      (error) => {
        setAddress("Bạn đã từ chối quyền truy cập vị trí.");
      },
      options,
    );
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Công cụ xác định vị trí</h2>
      <button
        onClick={getLocation}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Lấy vị trí hiện tại
      </button>
      <p style={{ marginTop: "20px", fontWeight: "bold", color: "#2c3e50" }}>
        {address}
      </p>
    </div>
  );
}

export default Test;
