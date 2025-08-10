import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../../components/sidebar/Sidebar";
import "./AppointmentDetail.css";
import moment from "moment";

const AppointmentDetails = () => {
  const { id: appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/appointment/getappointment/${appointmentId}`,
          {
            withCredentials: true,
          }
        );
        setAppointment(data.appointment);
      } catch (err) {
        setError("Error loading appointment details.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointmentDetails();
  }, [appointmentId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  const handleUpdateStatus = async (newStatus) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/doctorupdate/${appointmentId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      setAppointment((prev) => ({ ...prev, status: newStatus }));
      console.log(data.message);
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi update", error);
      toast.error("Failed to update appointment status.");
    }
  };
  return (
    <div>
      <div className="detail_doctor">
        <Sidebar />
        <div className="nd_detail">
          <h1>Chi tiết cuộc hẹn</h1>

          <div className="muc-detail-bs">
            <label>Tên bệnh nhân</label>
            <div className="value-detail-bs"> {appointment.name}</div>
          </div>

          <div className="gop-muc">
            <div className="muc-detail-bs">
              <label> Email</label>
              <div className="value-detail-bs"> {appointment.email}</div>
            </div>

            <div className="muc-detail-bs">
              <label> Số điện thoại</label>
              <div className="value-detail-bs"> {appointment.phone}</div>
            </div>
          </div>

          <div className="gop-muc">
            <div className="muc-detail-bs">
              <label> Ngày sinh</label>
              <div className="value-detail-bs">
                {" "}
                {moment(appointment.dob).format("DD/MM/YYYY")}
              </div>
            </div>

            <div className="muc-detail-bs">
              <label> Giới tính</label>
              <div className="value-detail-bs">{appointment.gender}</div>
            </div>
          </div>

          <div className="gop-muc">
            <div className="muc-detail-bs">
              <label> Ngày khám </label>
              <div className="value-detail-bs">
                {moment(appointment.appointment_date).format("DD/MM/YYYY")}
              </div>
            </div>

            <div className="muc-detail-bs">
              <label> Giờ khám </label>
              <div className="value-detail-bs">
                {appointment.appointment_time}
              </div>
            </div>
          </div>

          <div className="muc-detail-bs">
            <label>Loại dịch vụ</label>
            <div className="value-detail-bs-service">
              {appointment.services && appointment.services.length > 0 ? (
                <ul>
                  {appointment.services.map((service, index) => (
                    <li key={index}>
                      {service.serviceTypeId?.serviceCateName}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Không có loại dịch vụ</p>
              )}
            </div>
          </div>

          <div className="muc-detail-bs">
            <label>Dịch vụ</label>
            <div className="value-detail-bs-service">
              {appointment.services && appointment.services.length > 0 ? (
                <ul>
                  {appointment.services.map((service, index) => (
                    <li key={index}>
                      {service.serviceId?.serviceName}
                      <br />
                      {service.serviceId?.servicePrice.toLocaleString()} VNĐ
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Không có dịch vụ</p>
              )}
            </div>
          </div>

          <div className="muc-detail-bs">
            <label> Địa chỉ</label>
            <div className="value-detail-bs">{appointment.address}</div>
          </div>

          <div className="hahahaha">
            <button
              className="btn-xn-huy"
              onClick={() => handleUpdateStatus("Đã từ chối")}
              disabled={appointment.status !== "Chờ duyệt"}
            >
              Hủy
            </button>
            <button
              className="btn-xn-huy"
              onClick={() => handleUpdateStatus("Đã xác nhận")}
              disabled={appointment.status !== "Chờ duyệt"}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
