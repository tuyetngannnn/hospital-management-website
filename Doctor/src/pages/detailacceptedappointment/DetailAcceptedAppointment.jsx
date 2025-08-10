import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import "./DetailAcceptedAppointment.css"
import moment from "moment";

const DetailAcceptedAppointment = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/appointment/getappointment/${id}`,
          { withCredentials: true }
        );
        setAppointment(response.data.appointment);
        toast.success("Dữ liệu đã được tải thành công!");
      } catch (err) {
        console.error("Error fetching appointment details:", err);
        setError("Không thể tải chi tiết cuộc hẹn.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [id]);

  if (loading) return <p>Đang tải chi tiết cuộc hẹn...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="detail-accepted">

       <Sidebar />

        {appointment && (

          <div className="nd-detail-accepted">

            <h1>Chi tiết cuộc hẹn</h1>

            <div className="muc-detail-accepted">
              <label>Tên bệnh nhân</label>
              <div className="value-detail-accepted"> {appointment.name}</div>
            </div>

            <div className="gop-muc-accepted">
              <div className="muc-detail-accepted">
                <label> Ngày sinh</label>
                <div className="value-detail-accepted">{" "}  {moment(appointment.dob).format("DD/MM/YYYY")}</div>
              </div>
              
              <div className="muc-detail-accepted">
                <label> Giới tính</label>
                <div className="value-detail-accepted"> {appointment.gender}</div>
              </div>
            </div>

            <div className="gop-muc-accepted">
              <div className="muc-detail-accepted">
                <label>Email</label>
                <div className="value-detail-accepted">{" "}  {moment(appointment.dob).format("DD/MM/YYYY")}</div>
              </div>
              
              <div className="muc-detail-accepted">
                <label> Số điện thoại</label>
                <div className="value-detail-accepted"> {appointment.gender}</div>
              </div>
            </div>
            
            <div className="gop-muc-accepted">
                <div className="muc-detail-accepted">
                  <label> Ngày hẹn </label>
                  <div className="value-detail-accepted">{moment(appointment.appointment_date).format("DD/MM/YYYY")}</div>
                </div>
                
                <div className="muc-detail-accepted">
                  <label> Giờ hẹn </label>
                  <div className="value-detail-accepted">{appointment.appointment_time}</div>
                </div>
              </div>

              <div className="gop-muc-accepted">
                <div className="muc-detail-accepted">
                  <label> Bác sĩ </label>
                  <div className="value-detail-accepted">{appointment.doctor?.name}</div>
                </div>
                
                <div className="muc-detail-accepted">
                  <label> Trạng thái </label>
                  <div className="value-detail-accepted">{appointment.status}</div>
                </div>
              </div>

              <div className="muc-detail-accepted">
                <label>Địa chỉ</label>
                <div className="value-detail-accepted"> {appointment.address}</div>
              </div>
           

           
              <label className="thy">Dịch vụ:</label>
              {appointment.services?.length > 0 ? (
                <table className="detail-service">
                  <thead>
                    <tr>
                      <th>Loại dịch vụ</th>
                      <th>Tên dịch vụ</th>
                      <th>Giá dịch vụ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointment.services.map((service, index) => (
                      <tr key={index}>
                        <td>{service.serviceTypeId?.serviceCateName || "N/A"}</td>
                        <td>{service.serviceId?.serviceName || "N/A"}</td>
                        <td>{service.serviceId?.servicePrice || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Không có dịch vụ nào.</p>
              )}

        
                {/* <h3>Dịch vụ:</h3>
                {appointment.services?.length > 0 ? (
                  <ul>
                    {appointment.services.map((service, index) => (
                      <li key={index}>
                        <p>
                          <strong>Loại dịch vụ:</strong>{" "}
                          {service.serviceTypeId?.serviceCateName || "N/A"}
                        </p>
                        <p>
                          <strong>Tên dịch vụ</strong>{" "}
                          {service.serviceId?.serviceName || "N/A"}
                        </p>
                        <p>
                          <strong>Giá dịch vụ:</strong>{" "}
                          {service.serviceId?.servicePrice || "N/A"}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Không có dịch vụ nào.</p>
                )} */}

                <div className="btn-save">
                    <Link to={`/create-patient-record/${appointment._id}`}>
                    <button>Tạo Hóa Đơn</button>
                  </Link>
                </div>
           
          </div>
          )}
      </div>
    </div>
  );
};

export default DetailAcceptedAppointment;
