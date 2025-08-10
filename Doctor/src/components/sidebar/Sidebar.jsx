// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../main";
import {

  FaTasks ,
  FaCheckSquare ,
  FaUserShield,
  FaClipboardList,
  
} from "react-icons/fa";
import { RiLogoutBoxFill} from "react-icons/ri";
 // Import các icon
import { NavLink } from "react-router-dom"; // Import NavLink từ react-router-dom
import "./Sidebar.css";
import logo from "../../assets/imgs/img_logo.png";



const Sidebar = () => {
  const {  setIsAuthenticated } = useContext(Context);


  const handleLogout = async () => {
    await axios
    .get("http://localhost:4000/api/v1/user/doctor/logout", {
      withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };
  
  return (

    <div className="sidebar-bs">
      <div className="logo-bs">
        <img src={logo} alt="Logo" />
      </div>
      <ul className="menu-bs">
        {/* <li className="menu-item-bs">
          <NavLink
            to="/home" // Đường dẫn đến Trang chủ
            className={({ isActive }) =>
              isActive ? "menu-link-bs active" : "menu-link-bs"
            }
          >
            <FaThLarge className="icon-bs" />
            <span>Trang chủ</span>
          </NavLink>
        </li> */}

        <li className="menu-item-bs">
          <NavLink
            to="/" // Đường dẫn đến Bác sĩ
            className={({ isActive }) =>
              isActive ? "menu-link-bs active" : "menu-link-bs"
            }
          >
            <FaClipboardList  className="icon-bs" />
            <span>Danh sách chờ xác nhận</span>
          </NavLink>
        </li>
        <li className="menu-item-bs">
          <NavLink
            to="/accepted-appointments"
            className={({ isActive }) =>
              isActive ? "menu-link-bs active" : "menu-link-bs"
            }
          >
            <FaCheckSquare  className="icon-bs" />
            <span>Lịch hẹn đã xác nhận</span>
          </NavLink>
        </li>
        <li className="menu-item-bs">
          <NavLink
            to="/doctor/getfollowupappointment" 
            className={({ isActive }) =>
              isActive ? "menu-link-bs active" : "menu-link-bs"
            }
          >
            <FaUserShield className="icon-bs" />
            <span>Danh sách chờ tái khám</span>
          </NavLink>
        </li>
        <li className="menu-item-bs">
          <NavLink
            to="/doctor/getcompletedpatientrecord" 
            className={({ isActive }) =>
              isActive ? "menu-link-bs active" : "menu-link-bs"
            }
          >
            <FaTasks  className="icon-bs" />
            <span>Danh sách đã tái khám</span>
          </NavLink>
        </li>

      

        <li className="menu-item-bs" onClick={handleLogout}>
          <div className="menu-link-bs">
            <RiLogoutBoxFill className="icon-bs" />
            <span>Đăng xuất</span>
          </div>
        </li>
      </ul>
    </div>
    
  );
};


export default Sidebar;




