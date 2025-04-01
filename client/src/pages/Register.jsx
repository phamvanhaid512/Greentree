import React, { useState, useRef } from "react";
import styles from "../styles/register.module.css";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [Err, SetErr] = useState(null);
  const navigate = useNavigate();

  const un = useRef();
  const em = useRef();
  const p = useRef();
  const pw = useRef();
  const rpw = useRef();

  const FormRegister = () => {
    const username = un.current.value;
    const email = em.current.value;
    const phone = p.current.value;
    const password = pw.current.value;
    const repassword = rpw.current.value;

    if (!username || !email || !phone || !password || !repassword) {
      return SetErr("Vui lòng nhập đầy đủ thông tin");
    }
    if (repassword !== password) {
      return SetErr("Nhập lại mật khẩu không đúng");
    }

    let url = `http://localhost:3000/dangky`;
    let tt = { username, email, phone, password };
    let opt = {
      method: "POST",
      body: JSON.stringify(tt),
      headers: { "Content-Type": "application/json" },
    };

    fetch(url, opt)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("email", email); // Lưu email để xác minh OTP
          localStorage.setItem("username", username);
          localStorage.setItem("phone", phone);
          localStorage.setItem("password", password);
          navigate("/xacminh-otp"); // Chuyển sang trang OTP
        } else {
          SetErr(data.thongbao || "Đăng ký thất bại");
        }
      });
  };

  return (
    <section>
      <div className={styles.Form_register}>
        <div className={styles.container_formrg}>
          <div className={styles.tabs}>
            <Link to={"/dangnhap"}>Đăng Nhập</Link>
            <Link to={"/dangky"} className={styles.active}>
              Đăng Ký
            </Link>
          </div>
          <h2>Đăng Ký</h2>
          <p className={styles.error}>{Err}</p>
          <form>
            <div className={styles["input-group"]}>
              <span className={styles.icon}>👤</span>
              <input type="text" placeholder="Họ và tên" ref={un} required />
            </div>
            <div className={styles["input-group"]}>
              <span className={styles.icon}>📧</span>
              <input type="email" placeholder="Email" ref={em} required />
            </div>
            <div className={styles["input-group"]}>
              <span className={styles.icon}>📞</span>
              <input
                type="number"
                placeholder="Số điện thoại"
                ref={p}
                required
              />
            </div>
            <div className={styles["input-group"]}>
              <span className={styles.icon}>🔒</span>
              <input type="password" placeholder="Mật khẩu" ref={pw} required />
            </div>
            <div className={styles["input-group"]}>
              <span className={styles.icon}>🔑</span>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                ref={rpw}
                required
              />
            </div>
            <button type="button" onClick={FormRegister}>
              Đăng Ký
            </button>
          </form>
          <p>
            Bạn đã có tài khoản? <Link to="/dangnhap">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
