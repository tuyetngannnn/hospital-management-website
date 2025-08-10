import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../../main";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import moment from "moment";
import "./FollowUpAppointments.css"

const FollowUpAppointments = () => {
  const { isAuthenticated } = useContext(Context);
  const [followUpAppointments, setFollowUpAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch data từ API
  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/followupappointment/getfollowupappointment",
          { withCredentials: true }
        );

        // Sắp xếp dữ liệu theo ngày tái khám (ngày gần nhất lên trên)
        const sortedAppointments = response.data.data.sort((a, b) => {
          const dateA = new Date(a.followUpDate);
          const dateB = new Date(b.followUpDate);
          return dateA - dateB; // Sắp xếp tăng dần
        });

        setFollowUpAppointments(sortedAppointments);
      } catch (error) {
        console.error("Error fetching follow-up appointments:", error);
        toast.error("Lỗi khi lấy lịch tái khám");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchFollowUps();
    }
  }, [isAuthenticated]);

  // Chuyển hướng đến chi tiết lịch hẹn
  const handleViewDetails = (followUpAppointmentId) => {
    navigate(`/doctor/detailfollowupappointment/${followUpAppointmentId}`);
  };
  // Chuyển hướng đến trang tạo bệnh án
  const handleCreateRecord = (followUpAppointmentId) => {
    navigate(`/doctor/createpatientrecord/${followUpAppointmentId}`);
  };
  if (loading) return <p>Đang tải danh sách tái khám...</p>;

  return (
    <div>

      <div className="followup">

        <Sidebar/>

          <div className="nd-followup">

          
            <h2>Danh sách tái khám</h2>

            {followUpAppointments.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th className="mhd">Mã hóa đơn</th>
                    <th className="tbn-1">Tên bệnh nhân</th>
                    <th className="ndk">Ngày đã khám</th>
                    <th className="ndk">Giờ đã khám</th>
                    <th className="ntk">Ngày tái khám</th>
                    <th className="tt-1">Trạng thái</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {followUpAppointments.map((followUpAppointment) => (
                    <tr key={followUpAppointment._id}>
                      <td>{followUpAppointment.patientRecordId?.invoiceCode}</td>
                      <td>
                        {followUpAppointment.patientRecordId?.patientName || "N/A"}
                      </td>

                      <td>
                        {moment(followUpAppointment.patientRecordId?.appointment_date || "N/A").format("DD/MM/YYYY")}
                      </td>

                      <td>
                        {followUpAppointment.patientRecordId?.appointment_time || "N/A"}
                      </td>

                      <td>
                        {new Date(followUpAppointment.followUpDate).toLocaleDateString()}
                      </td>

                      <td>{followUpAppointment.status}</td>

                      <td>
                        <button
                        className="btn-see-detail"
                          onClick={() => handleViewDetails(followUpAppointment._id)}
                        >
                          Xem Chi Tiết
                        </button>
                        <button
                        className="create-detail"
                          onClick={() => handleCreateRecord(followUpAppointment._id)}
                        >
                          Tạo hồ sơ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          ) : (
            <p>Danh sách tái khám trống.</p>
          )}
            </div>
        </div>
    </div>
  );
};

export default FollowUpAppointments;
