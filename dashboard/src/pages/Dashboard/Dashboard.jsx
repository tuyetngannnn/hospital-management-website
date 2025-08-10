// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Navigate, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import "./Dashboard.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { FaTimes } from "react-icons/fa";
const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filterDate, setFilterDate] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  //const [filterTime, setFilterTime] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  //const filterApplied = filterDate || filterDoctor || filterStatus;

  //const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  // eslint-disable-next-line no-unused-vars
  const [appointmentsPerPage, setAppointmentsPerPage] = useState(10); // Số lượng lịch hẹn mỗi trang

  const navigate = useNavigate(); // Sử dụng useNavigate để chuyển hướng

  const closeModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true); // Mở modal khi nhấn vào "Xem chi tiết"
  };

  const handleCreateAppointment = () => {
    navigate("/appointment/adminaddnew"); // Chuyển hướng tới trang addappointment
  };

  const applyFilters = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/appointment/filter",
        {
          params: {
            date: filterDate || undefined,
            doctor: filterDoctor || undefined,
            status: filterStatus || undefined,
          },
          withCredentials: true,
        }
      );

      if (data.success && data.filteredAppointments.length === 0) {
        setFilteredAppointments([]);
      }

      setFilteredAppointments(data.filteredAppointments);
    } catch (error) {
      console.error("Lỗi khi lọc lịch hẹn:", error);
      setFilteredAppointments([]);
    }
  };
  useEffect(() => {
    if (filterDate || filterDoctor || filterStatus) {
      applyFilters();
    } else {
      setFilteredAppointments([]); // Xóa bộ lọc khi không có bộ lọc nào được áp dụng
    }
  }, [filterDate, filterDoctor, filterStatus]);

  // const formatDateToISO = (dateString) => {
  //   const [day, month, year] = dateString.split('/');
  //   return `${year}-${month}-${day}`;  // Đổi thành yyyy-MM-dd
  // };

  // const displayedAppointments = filteredAppointments.length > 0 ? filteredAppointments : appointments;
  const displayedAppointments =
    filterDate || filterDoctor || filterStatus
      ? filteredAppointments
      : appointments;
  const currentAppointments = displayedAppointments; // Hiển thị các lịch hẹn của trang hiện tại

  useEffect(() => {
    if (filterDate || filterDoctor || filterStatus) {
      applyFilters();
    } else {
      setFilteredAppointments([]); // Xóa bộ lọc khi không có bộ lọc nào được áp dụng
    }
  }, [filterDate, filterDoctor, filterStatus]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getall",
          { withCredentials: true }
        );

        // Xử lý sắp xếp lịch hẹn
        const sortedAppointments = data.appointments.sort((a, b) => {
          const currentDate = new Date(); // Ngày hiện tại
          const dateA = new Date(a.appointment_date); // Ngày hẹn của A
          const dateB = new Date(b.appointment_date); // Ngày hẹn của B

          // Kiểm tra nếu ngày đã qua
          const isPastA = dateA < currentDate;
          const isPastB = dateB < currentDate;

          // Sắp xếp: ngày chưa qua trước, ngày gần nhất trước
          if (isPastA && !isPastB) return 1; // A đã qua ngày -> B lên trước
          if (!isPastA && isPastB) return -1; // B đã qua ngày -> A lên trước
          return dateA - dateB; // Nếu cả hai chưa qua hoặc đã qua, so sánh ngày gần nhất
        });

        setAppointments(sortedAppointments);
      } catch (error) {
        setAppointments([]); // Nếu lỗi, đặt lịch hẹn là mảng rỗng
      }
    };

    const fetchTotalAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/count",
          { withCredentials: true }
        );
        setTotalAppointments(data.totalAppointments);
      } catch (error) {
        setTotalAppointments(0);
      }
    };
    const fetchTotalDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors/count",
          { withCredentials: true }
        );
        setTotalDoctors(data.totalDoctors);
      } catch (error) {
        setTotalDoctors(0);
      }
    };
    fetchAppointments();
    fetchTotalAppointments();
    fetchTotalDoctors();
  }, []);

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="body-container">
      <Sidebar />
      <div className="body-content">
        <section className="dashboard page">
          <div className="banner lato-regular">
            <div className="firstBox">
              <img src="/doc.png" alt="docImg" />
              <div className="content">
                <div>
                  <p>Chào mừng bạn đã quay trở lại,</p>
                  <h5>{admin && `${admin.name}`} </h5>
                </div>
              </div>
            </div>
            <div className="secondBox">
              <span>{totalAppointments}</span>
              <p className="lato-regular">Số lượng đặt hẹn</p>
            </div>
            <div className="thirdBox">
              <span>{totalDoctors}</span>
              <p className="lato-regular">Số lượng bác sĩ</p>
            </div>
          </div>

          <div className="banner">
            <h1 className="lato-bold">ĐƠN ĐẶT KHÁM</h1>
            <div className="actions">
              <div className="add-appointment">
                <button
                  onClick={handleCreateAppointment}
                  className="btn-add-service lato-bold"
                >
                  Tạo đơn đặt lịch <span className="plus-icon">+</span>
                </button>
              </div>
              <div className="filter-section">
                <input
                  type="date"
                  onChange={(e) => setFilterDate(e.target.value)}
                  placeholder="Chọn ngày"
                  className="filter-input"
                />
                <input
                  type="text"
                  onChange={(e) => setFilterDoctor(e.target.value)}
                  placeholder="Nhập tên bác sĩ"
                  className="filter-input"
                />
                <select
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-input"
                >
                  <option value="">Chọn trạng thái</option>
                  <option value="Chờ duyệt">Chờ duyệt</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Đã từ chối">Đã từ chối</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                </select>

                <button onClick={applyFilters} className="filter-button">
                  Lọc
                </button>
              </div>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Bệnh nhân</th>
                    <th>Ngày khám</th>
                    <th>Bác sĩ</th>
                    <th>Trạng thái</th>
                    <th>Loại bệnh nhân</th>
                    <th>Xem chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAppointments.length > 0 ? (
                    currentAppointments.map((appointment) => (
                      <tr key={appointment._id}>
                        <td>{appointment.name}</td>
                        <td>
                          {new Date(
                            appointment.appointment_date
                          ).toLocaleDateString("vi-VN")}
                        </td>
                        <td>{appointment.doctor.name}</td>
                        <td>
                          <span
                            className={
                              appointment.status === "Chờ duyệt"
                                ? "value-pending"
                                : appointment.status === "Đã xác nhận"
                                ? "value-accepted"
                                : "value-rejected"
                            }
                          >
                            {appointment.status}
                          </span>
                        </td>
                        <td>
                          {appointment.hasVisited ? (
                            <GoCheckCircleFill className="green" />
                          ) : (
                            <AiFillCloseCircle className="red" />
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleViewDetails(appointment)}
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        style={{ textAlign: "center", padding: "10px" }}
                      >
                        Không có lịch hẹn nào được tìm thấy.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {isModalOpen && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={closeModal} className="close-icon">
              <FaTimes />
            </button>
            <h3 className="modal-title">Thông tin chi tiết lịch hẹn</h3>
            <div className="details-container">
              <p className="label-text">
                <strong>Tên bệnh nhân:</strong> {selectedAppointment.name}
              </p>
              <p className="label-texte">
                <strong>Email:</strong> {selectedAppointment.email}
              </p>
              <p className="label-text">
                <strong>Số điện thoại:</strong> {selectedAppointment.phone}
              </p>
              <p className="label-text">
                <strong>Ngày khám:</strong>{" "}
                {new Date(
                  selectedAppointment.appointment_date
                ).toLocaleDateString("vi-VN")}
              </p>
              <p className="label-text">
                <strong>Giờ khám:</strong>{" "}
                {selectedAppointment.appointment_time}
              </p>
              <p className="label-text">
                <strong>Bác sĩ phụ trách:</strong>{" "}
                {selectedAppointment.doctor.name}
              </p>
              <p className="label-text">
                <strong>Trạng thái:</strong> {selectedAppointment.status}
              </p>

              {/* Hiển thị danh sách dịch vụ */}
              <p className="label-text">
                <strong>Dịch vụ:</strong>
              </p>
              <ul>
                {selectedAppointment.services.map((service, index) => (
                  <li key={index}>
                    - Loại dịch vụ: {service.serviceTypeId?.serviceCateName}{" "}
                    <br />- Tên dịch vụ: {service.serviceId?.serviceName}
                  </li>
                ))}
              </ul>
            </div>
            {/* <button onClick={closeModal} className="close-icon-service">Đóng</button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
