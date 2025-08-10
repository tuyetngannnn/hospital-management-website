// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../../main";
import axios from "axios";
import './AddNewDoctor.css'
import Sidebar from "../../components/Sidebar/Sidebar";

const AddNewDoctor = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [docAvatar, setDocAvatar] = useState("");
  const [docAvatarPreview, setDocAvatarPreview] = useState("");
  const [Introduceyourself, setIntroduceyourself] = useState("");
  const navigateTo = useNavigate();

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocAvatarPreview(reader.result);
      setDocAvatar(file);
    };
  };

  const handleAddNewDoctor = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("Introduceyourself", Introduceyourself);
      formData.append("docAvatar", docAvatar);
      
      // Gửi yêu cầu thêm bác sĩ mới
      const res = await axios.post("http://localhost:4000/api/v1/user/doctor/addnew", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      // Hiển thị thông báo thành công nếu bác sĩ được tạo thành công
      toast.success(res.data.message);
      setIsAuthenticated(true);
      navigateTo("/");
  
      // Reset form sau khi tạo tài khoản thành công
      setName("");
      setEmail("");
      setPhone("");
      setDob("");
      setGender("");
      setPassword("");
      setIntroduceyourself("");
      
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo tài khoản bác sĩ");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="doctor-manager-content-1">
        <section className="page">
          <section className="container add-doctor-form">
            <h1 className="lato-bold">TẠO MỚI TÀI KHOẢN BÁC SĨ</h1>
            <form onSubmit={handleAddNewDoctor}>
              <div className="first-wrapper">
                <div>
                  <img
                    src={
                      docAvatarPreview ? `${docAvatarPreview}` : "/docHolder.jpg"
                    }
                    alt="Doctor Avatar"
                  />
                  <input type="file" onChange={handleAvatar} />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Tên bác sĩ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <input
                    type={"date"}
                    placeholder="Ngày sinh"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Mô tả bác sĩ"
                    value={Introduceyourself}
                    onChange={(e) => setIntroduceyourself(e.target.value)}
                  />
                  <button type="submit" className="lato-bold">TẠO TÀI KHOẢN</button>
                </div>
              </div>
            </form>
          </section>
        </section>
      </div>
    </div>
  );
};

export default AddNewDoctor;
