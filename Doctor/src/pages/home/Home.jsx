// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../../main"; // Đảm bảo import đúng context
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate
// import NavDoctor from "../../components/navbar/NavDoctor";
import "./Home.css"
// import xemchitiet from "../../assets/icon/icons8-info-64.png";
import { FaInfoCircle } from 'react-icons/fa'; // Thêm icon xem chi tiết
import moment from "moment";
import Sidebar from "../../components/sidebar/Sidebar";
const Home = () => {
  const { isAuthenticated } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Khởi tạo navigate
  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/appointment/doctorupdate/${appointmentId}`,
        { status: newStatus },
        { withCredentials: true }
      );
  
      // Cập nhật trạng thái trong danh sách cuộc hẹn mà không cần reload trang
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
      toast.success(response.data.message); // Hiển thị thông báo thành công
      location.reload()
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Cập nhật trạng thái thất bại.");
    }
  };
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/appointment/getpendingappointments",
          { withCredentials: true }
        );
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated]);
   // Hàm để chuyển hướng đến trang chi tiết cuộc hẹn
   const handleViewDetails = (appointmentId) => {
    navigate(`/appointmentdetail/${appointmentId}`); // Sử dụng navigate để chuyển trang
  };
  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="all_doctor">
        {/* <NavDoctor/> */}
        <Sidebar/>
        <div className="nd_doctor">

          <h2>DANH SÁCH CUỘC HẸN</h2>
    
          {appointments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th className="tbn">Tên bệnh nhân</th>
                  <th className="nk">Ngày khám</th>
                  <th className="gk">Giờ khám</th>
                  <th className="tt">Trạng thái</th>
                  <th className="ct">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>

                    <td>{`${appointment.name}`}</td>

                    {/* <td>{appointment.appointment_date}</td> */}
                    <td>{moment(appointment.appointment_date).format("DD/MM/YYYY")}</td>

                    <td>{appointment.appointment_time}</td>
                    <td>
                      {appointment.status === "Pending" ? (
                        <select
                          className={
                            appointment.status === "Pending"
                              ? "value-pending"
                              : appointment.status === "Accepted"
                              ? "value-accepted"
                              : "value-rejected"
                          }
                          value={appointment.status}
                          onChange={(e) =>
                            handleUpdateStatus(appointment._id, e.target.value)
                          }
                        >
                          <option value="Pending" className="value-pending">
                            Chờ xác nhận
                          </option>
                          <option value="Accepted" className="value-accepted">
                            Xác nhận
                          </option>
                          <option value="Rejected" className="value-rejected">
                            Hủy
                          </option>
                        </select>
                      ) : (
                        <span
                          className={
                            appointment.status === "Accepted"
                              ? "value-accepted"
                              : "value-rejected"
                          }
                        >
                          {appointment.status}
                        </span>
                      )}
                    </td>
                    <td >
                      <FaInfoCircle className="icon_doctor"  onClick={() => handleViewDetails(appointment._id)}/>
                      {/* <img src={xemchitiet} onClick={() => handleViewDetails(appointment._id)}/> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Danh sách lịch hẹn trống</p>
          )}
        </div>
      </div>
    </div>
  );
};


export default Home;
