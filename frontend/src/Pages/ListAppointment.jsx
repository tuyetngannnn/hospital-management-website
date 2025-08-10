import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../main.jsx";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { isAuthenticated } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Khởi tạo navigate

  useEffect(() => {
    // Gọi API để lấy danh sách hồ sơ bệnh án
    const fetchRecords = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/patient/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments); // Truy cập đúng vào "appointments"
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchRecords();
    }
  }, [isAuthenticated]);

  // Hàm chuyển hướng tới trang xem chi tiết
  const handleViewDetails = (id) => {
    navigate(`/user/getdetailpatientrecord/${id}`);
  };

  if (loading) return <p style={styles.loadingText}>Đang tải dữ liệu...</p>;
  if (!loading && appointments.length === 0)
    return <p style={styles.noData}>Không có hồ sơ bệnh án nào.</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header} className="lato-bold">
        DANH SÁCH LỊCH SỬ LỊCH KHÁM
      </h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th} className="lato-bold">
              Bệnh nhân
            </th>
            <th style={styles.th}>Ngày hẹn</th>
            <th style={styles.th}>Thời gian hẹn</th>
            <th style={styles.th}>Địa chỉ</th>
            <th style={styles.th}>Trạng thái</th>
            <th style={styles.th}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment._id} style={styles.appointmentItem}>
              <td style={styles.td}>{appointment.name}</td>
              <td style={styles.td}>{appointment.appointment_date}</td>
              <td style={styles.td}>{appointment.appointment_time}</td>
              <td style={styles.td}>{appointment.address || "Chưa rõ"}</td>
              <td style={styles.td}>{appointment.status}</td>
              <td style={styles.td}>
                <button
                  style={styles.button}
                  onClick={() => handleViewDetails(appointment._id)}
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1100px",
    margin: "20px auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    fontSize: "35px",
    textAlign: "center",
    color: "#5790ab",
    marginBottom: "25px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    backgroundColor: "#f2f2f2",
    color: "#333",
    textAlign: "left",
    padding: "12px 8px",
    borderBottom: "2px solid #ddd",
    fontSize: "18px",
  },
  td: {
    padding: "12px 8px",
    borderBottom: "1px solid #ddd",
    fontSize: "14px",
    color: "#555",
  },
  button: {
    padding: "6px 12px",
    backgroundColor: "#5790ab",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "15px",
    textAlign: "center",
    transition: "background-color 0.3s",
  },
  noData: {
    textAlign: "center",
    color: "#5790ab",
    fontSize: "18px",
  },
};

export default Appointments;
