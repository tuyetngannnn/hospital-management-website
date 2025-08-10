import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import './AddNewAdmin.css';

const AddNewAdmin = () => {
  const { isAuthenticated } = useContext(Context);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();

  const handleAddNewAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/user/admin/addnew",
        { name, email, phone, dob, gender, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
  
      toast.success(res.data.message); // Hiển thị thông báo thành công
      navigateTo("/");
  
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setDob("");
      setGender("");
      setPassword("");
    } catch (error) {
      console.log(error); // Log lỗi để kiểm tra
      // Kiểm tra lỗi có trong response hay không
      if (error.response) {
        toast.error(error.response.data.message); // Hiển thị thông báo lỗi từ backend
      } else {
        toast.error("Đã xảy ra lỗi!");
      }
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-manager-content">
        <section className="add-new-admin-form">
          <h1 className="add-new-admin-title">TẠO MỚI TÀI KHOẢN QUẢN TRỊ VIÊN</h1>
          <form onSubmit={handleAddNewAdmin}>
            {/* Dòng đầu tiên (1 ô nhập) */}
            <div className="form-group ">
              <label className="label-text required">Tên</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Dòng thứ hai (2 ô nhập) */}
            <div className="form-row">
              <div className="form-group">
                <label className="label-text required">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="label-text required">Số điện thoại</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Dòng tiếp theo (ngày sinh) */}
            <div className="form-group">
              <label className="label-text required">Ngày sinh</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>

            {/* Dòng tiếp theo (giới tính và mật khẩu) */}
            <div className="form-row">
              <div className="form-group">
                <label className="label-text required">Giới tính</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label-text required">Mật khẩu</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="btn-add-new">
              {/* Nút thêm admin */}
              <button type="submit" className="form-button lato-bold">
                TẠO TÀI KHOẢN
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AddNewAdmin;
