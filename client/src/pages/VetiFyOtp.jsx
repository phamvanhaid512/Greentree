import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/verify.module.css";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const email = localStorage.getItem("email"); // Lấy email từ localStorage

  const handleVerifyOTP = () => {
    if (!otp) {
      setError("Vui lòng nhập mã OTP");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/xacminhotp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
        username: localStorage.getItem("username"),
        phone: localStorage.getItem("phone"),
        password: localStorage.getItem("password"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Xác minh thành công! Hãy đăng nhập.");

          // 🛑 Xóa thông tin user khỏi localStorage sau khi xác minh thành công
          localStorage.removeItem("email");
          localStorage.removeItem("username");
          localStorage.removeItem("phone");
          localStorage.removeItem("password");

          navigate("/dangnhap");
        } else {
          setError(data.thongbao || "Xác minh OTP thất bại");
        }
      })
      .catch((err) => {
        setError("Có lỗi xảy ra, vui lòng thử lại");
        console.error(err);
      });
  };

  return (
    <section className={styles.verify_container}>
      <div className={styles.verify_box}>
        <h2>Xác Minh OTP</h2>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="number"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleVerifyOTP}>Xác Minh</button>
      </div>
    </section>
  );
}
