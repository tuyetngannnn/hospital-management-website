import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import "./DetailFollowUpAppointment.css"
// import moment from "moment";

const DetailFollowUpAppointment = () => {
  const { followUpAppointmentId } = useParams(); // Lấy ID từ URL
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch dữ liệu chi tiết lịch hẹn
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/followupappointment/detailfollowupappointment/${followUpAppointmentId}`,
          { withCredentials: true }
        );
        setAppointmentDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        toast.error("Không thể lấy thông tin chi tiết lịch hẹn.");
      } finally {
        setLoading(false);
      }
    };

    if (followUpAppointmentId) {
      fetchDetails();
    }
  }, [followUpAppointmentId]);
  // Chuyển hướng đến trang tạo bệnh án
  const handleCreateRecord = (followUpAppointmentId) => {
    navigate(`/doctor/createpatientrecord/${followUpAppointmentId}`);
  };
  if (loading) return <p>Đang tải thông tin chi tiết...</p>;

  if (!appointmentDetails) return <p>Không tìm thấy thông tin lịch hẹn.</p>;

  // Dữ liệu từ API
  const { patientRecordId, followUpDate, status } = appointmentDetails;

  return (
    <div >
      <div className="detail-follow-up">
        <Sidebar/>

          <div className="nd-detail-follow-up">

            <h1>Chi tiết lịch hẹn tái khám</h1>

            <div className="muc-detail-follow-up">
              <label>Mã hóa đơn</label>
              <div className="value-detail-follow-up"> {patientRecordId?.invoiceCode || "Không có mã"}</div>
            </div>

            <div className="muc-detail-follow-up">
              <label>Tên bệnh nhân</label>
              <div className="value-detail-follow-up"> {patientRecordId?.patientName || "Không có thông tin"}</div>
            </div>

            <div className="muc-detail-follow-up">
              <label>Số điện thoại</label>
              <div className="value-detail-follow-up"> {patientRecordId?.phone || "Không có thông tin"}</div>
            </div>
           
            <div className="muc-detail-follow-up">
              <label>Email  </label>
              <div className="value-detail-follow-up"> {patientRecordId?.email || "Không có thông tin"}</div>
            </div>
          
            <div className="muc-detail-follow-up">
              <label>Ngày tái khám  </label>
              <div className="value-detail-follow-up"> {new Date(followUpDate).toLocaleDateString()}</div>
            </div>

            <div className="muc-detail-follow-up">
              <label>Giờ tái khám  </label>
              <div className="value-detail-follow-up"> {patientRecordId?.appointment_time || "Không có thông tin"}</div>
            </div>
         
            <div className="muc-detail-follow-up">
              <label>Trạng thái </label>
              <div className="value-detail-follow-up"> {status}</div>
            </div>

            <div className="muc-detail-follow-up">
              <label>Địa chỉ </label>
              <div className="value-detail-follow-up"> {patientRecordId?.address || "Không có thông tin"}</div>
            </div>
            
            <div className="muc-detail-follow-up">
              <label>Mô tả </label>
              <div className="value-detail-follow-up">  {patientRecordId?.description || "Không có mô tả"}</div>
            </div>
          

            <label className="thy">Dịch vụ đã chọn</label>
            {patientRecordId?.services?.length > 0 ? (
              <div>
                <table className="detail-service-folow">
                  <thead>
                    <tr>
                      <th>Loại dịch vụ</th>
                      <th>Dịch vụ</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientRecordId.services.map((service, index) => (
                      <tr key={index}>
                        <td>{service.serviceTypeId.serviceCateName}</td>
                        <td>{service.serviceId.serviceName}</td>
                        <td>{service.servicePrice.toLocaleString()} VNĐ</td>
                        <td>{service.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table >
                <div className="btn-save-folow" >

                  <button onClick={() => handleCreateRecord(followUpAppointmentId)}>
                    Tạo phiếu tái khám
                  </button>
                </div>
              </div>
            ) : (
              <p>Không có dịch vụ nào.</p>
            )}

            
            {/* {patientRecordId?.services?.length > 0 ? (
              <ul>
                {patientRecordId.services.map((service, index) => (
                  <li key={index}>
                    <strong>Loại dịch vụ:</strong>{" "}
                    {service.serviceTypeId.serviceCateName} <br />
                    <strong>Dịch vụ:</strong> {service.serviceId.serviceName} <br />
                    <strong>
                      Giá:
                    </strong> {service.servicePrice.toLocaleString()} VNĐ <br />
                    <strong>Số lượng:</strong> {service.quantity}
                  </li>
                ))}
                <button onClick={() => handleCreateRecord(followUpAppointmentId)}>
                  Tạo phiếu tái khám
                </button>
              </ul>
            ) : (
              <p>Không có dịch vụ nào.</p>
            )} */}
          </div>
      </div>
    </div>
  );
};

export default DetailFollowUpAppointment;
