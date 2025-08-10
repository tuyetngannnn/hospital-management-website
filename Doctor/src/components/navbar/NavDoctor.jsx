// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from "react";
import './NavDoctor.css';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";

const NavDoctor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await axios
      .get("http://localhost:4000/api/v1/user/doctor/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
        navigate("/login")

      })
      .catch((err) => {
        console.error(err)
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="navbar-doctor">
        {isAuthenticated}
      {/* Thay đổi icon khi menu mở/đóng */}
      <div className="menu-icon-doctor" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      <ul className={isOpen ? "open" : ""}>
        <li>
          <NavLink
            to="/doctor/createpatientrecord"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Danh sách tái khám
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/home"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Danh sách chờ xác nhận
          </NavLink>
        </li>

        <li>
          <NavLink
            to="../accepted-appointments"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Lịch hẹn đã xác nhận
          </NavLink>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-btn">
            Đăng xuất
          </button>
        </li>
      </ul>
    </div>
  );
};

export default NavDoctor;
