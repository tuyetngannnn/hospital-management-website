import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../main";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CompletedFollowUp = () => {
  const { isAuthenticated } = useContext(Context);
  const [followUpRecords, setFollowUpRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch data từ API
  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/followupappointment/getcreatedfollowupappointment",
          { withCredentials: true }
        );
        setFollowUpRecords(response.data.data); // Gán danh sách từ API vào state
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
  const handleViewDetails = (patientRecordId) => {
    navigate(`/doctor/detailpatientrecord/${patientRecordId}`);
  };

  if (loading) return <p>Đang tải danh sách tái khám...</p>;

  return (
    <div className="follow-up-appointments">
      <h1>Danh sách đã tái khám</h1>
      {followUpRecords.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Mã hóa đơn</th>
              <th>Tên bệnh nhân</th>
              <th>Ngày tái khám</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {followUpRecords.map((record) => (
              <tr key={record._id}>
                <td>{record.patientRecordId.invoiceCode || "N/A"}</td>
                <td>{record.patientRecordId.patientName || "N/A"}</td>
                <td>{record.actualFollowUpDate || "N/A"}</td>
                <td>{record.status || "N/A"}</td>
                <td>
                  <button
                    onClick={() =>
                      handleViewDetails(record.patientRecordId._id)
                    }
                  >
                    Xem Chi Tiết
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
  );
};

export default CompletedFollowUp;
