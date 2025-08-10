// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Modal from "react-modal";
import { Context } from "../../main.jsx"; // Lấy Context từ file chính
import NavbarProfile from "../../components/Navbar/NavbarProfile.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./AppointmentHistory.css";

// Thiết lập Modal mặc định
Modal.setAppElement("#root");

const AppointmentHistory = () => {
  // Lấy userId từ Context
  const { user } = useContext(Context);
  const userId = user._id;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Lịch hẹn được chọn
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái Modal

  useEffect(() => {
    const fetchAppointmentData = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/v1/appointment/historyappointments/${userId}`,
            { withCredentials: true }
          );
          console.log("API Response:", response.data);

          if (response.data && response.data.length > 0) {
            setAppointments(response.data);
          } else {
            setAppointments([]);
          }
        } catch (err) {
          console.error("API Error:", err);
          setError("Không thể lấy thông tin lịch hẹn.");
        }
        setLoading(false);
      } else {
        setError("Không có ID người dùng.");
        setLoading(false);
      }
    };

    if (userId) {
      fetchAppointmentData();
    } else {
      setLoading(false);
      setError("Không tìm thấy thông tin người dùng.");
    }
  }, [userId]);

  // Hiển thị trạng thái tải
  if (loading) {
    return <div>Đang tải...</div>;
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return <div>{error}</div>;
  }

  // Nếu không có lịch hẹn
  if (!appointments || appointments.length === 0) {
    return <div>Không có lịch hẹn.</div>;
  }
  // Hiển thị danh sách lịch hẹn dưới dạng bảng
  return (
    <div>
      <Navbar />
      <div className="all_profile">
        <NavbarProfile />
        <div className="appointment-history">
          <h2 className="text-lg font-bold mb-4">Lịch Sử Khám Của Bạn</h2>
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">STT</th>
                <th className="border border-gray-300 px-4 py-2">Người Đặt</th>
                <th className="border border-gray-300 px-4 py-2">
                  Bác Sĩ Khám
                </th>
                <th className="border border-gray-300 px-4 py-2">Ngày Đặt</th>
                <th className="border border-gray-300 px-4 py-2">Giờ Đặt</th>
                <th className="border border-gray-300 px-4 py-2">Trạng Thái</th>
                <th className="border border-gray-300 px-4 py-2">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={appointment._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {appointment.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {appointment.doctor?.name || "Không rõ"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(appointment.appointment_date).toLocaleDateString(
                      "vi-VN"
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {appointment.appointment_time}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {appointment.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setIsModalOpen(true);
                      }}
                    >
                      Xem Chi Tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal hiển thị thông tin chi tiết */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Chi Tiết Lịch Hẹn"
            className="ReactModal__Content p-6 w-1/2 mx-auto mt-20 outline-none"
            overlayClassName="ReactModal__Overlay"
          >
            {selectedAppointment && (
              <div>
                <h3 className="text-lg font-bold mb-4">Chi Tiết Lịch Hẹn</h3>
                <p>
                  <strong>Người Đặt:</strong> {selectedAppointment.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedAppointment.email}
                </p>
                <p>
                  <strong>Số Điện Thoại:</strong>{" "}
                  {selectedAppointment.patientId?.phone || "Không rõ"}
                </p>
                <p>
                  <strong>Bác Sĩ Phụ Trách:</strong>{" "}
                  {selectedAppointment.doctor?.name || "Không rõ"}
                </p>
                <div className="mt-4">
                  {selectedAppointment.services &&
                  selectedAppointment.services.length > 0 ? (
                    <div>
                      <h4 className="text-md font-semibold mb-2">
                        Danh Sách Dịch Vụ
                      </h4>
                      <ul className="list-disc pl-6">
                        {selectedAppointment.services.map((service, index) => (
                          <li key={index} className="mb-2">
                            <p>
                              <strong>Loại Dịch Vụ:</strong>{" "}
                              {service.serviceTypeId?.serviceCateName ||
                                "Không rõ"}
                            </p>
                            <p>
                              <strong>Tên Dịch Vụ:</strong>{" "}
                              {service.serviceId?.serviceName || "Không rõ"}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>Không có thông tin dịch vụ.</p>
                  )}
                </div>
                <p>
                  <strong>Ngày Khám:</strong>{" "}
                  {new Date(
                    selectedAppointment.appointment_date
                  ).toLocaleDateString("vi-VN")}
                </p>
                <p>
                  <strong>Giờ Đặt:</strong>{" "}
                  {selectedAppointment.appointment_time}
                </p>
                <p>
                  <strong>Trạng Thái:</strong> {selectedAppointment.status}
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppointmentHistory;
