// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../../main";
import axios from "axios";
import loginbs from "../../assets/imgs/login_bs.png";
import Password from "../../components/input/Password.jsx"; // Giả sử bạn đã tạo component Password
import "./Login.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, role: "Doctor" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      // Kiểm tra nếu res và res.data tồn tại
      if (res && res.data) {
        toast.success(res.data.message);
        setIsAuthenticated(true);
        navigateTo("/"); // Điều hướng về trang Home
        setEmail("");
        setPassword("");
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      // Kiểm tra xem lỗi có chứa response hay không
      const errorMessage = error.response?.data?.message || "Login failed!";
      toast.error(errorMessage);
    }
  };
  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <section className="login_doctor">
        <div className="image_doctor">
          <img src={loginbs} alt="login" />
        </div>

        <div className="login_form_doctor">
          <h1>ĐĂNG NHẬP BÁC SĨ</h1>

          <form onSubmit={handleLogin}>
            <p>
              Email
              <span style={{ color: "red", fontSize: "28px" }}>*</span>
            </p>
            <input
              className="input_doctor"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <p>
              Mật khẩu
              <span style={{ color: "red", fontSize: "28px" }}>*</span>
            </p>
            <Password
              className="password_doctor"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="btn_login-doctor">
              ĐĂNG NHẬP
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
