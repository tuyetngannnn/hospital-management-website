import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main.jsx";
import NavbarProfile from "../../components/Navbar/NavbarProfile.jsx";
import "./Record.css";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
const PatientRecords = () => {
  const [records, setRecords] = useState([]);
  const { isAuthenticated } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API để lấy danh sách hồ sơ bệnh án
    const fetchRecords = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/patient/getpatientrecord",
          { withCredentials: true }
        );
        setRecords(data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [isAuthenticated]);
  if (loading) return <p>Đang tải dữ liệu...</p>;

  // Hàm chuyển hướng tới trang xem chi tiết
  const handleViewDetails = (recordId) => {
    navigate(`/user/getdetailpatientrecord/${recordId}`);
  };

  // Hàm lấy màu theo trạng thái
  const getStatusStyle = (status) => {
    switch (status) {
      case "Hoàn thành":
        return { color: "green" };
      case "Chờ tái khám":
        return { color: "#555" };
      default:
        return { color: "#555" };
    }
  };

  return (
    <div>
      <Navbar />

      <div className="patient-record">
        <NavbarProfile />
        <div style={styles.container}>
          <h1 style={styles.header} className="lato-bold">
            DANH SÁCH HỒ SƠ BỆNH ÁN
          </h1>
          {records.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th} className="lato-bold">
                    Mã hồ sơ
                  </th>
                  <th style={styles.th} className="lato-bold">
                    Bác sĩ
                  </th>
                  <th style={styles.th} className="lato-bold">
                    Ngày hẹn
                  </th>
                  <th style={styles.th} className="lato-bold">
                    Thời gian hẹn
                  </th>
                  <th style={styles.th} className="lato-bold">
                    Trạng thái
                  </th>
                  <th style={styles.th} className="lato-bold">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record._id} style={styles.tr}>
                    <td style={styles.td} className="lato-regular">
                      {record.invoiceCode}
                    </td>
                    <td style={styles.td} className="lato-regular">
                      {record.doctorId.name}
                    </td>
                    <td style={styles.td} className="lato-regular">
                      {new Date(record.followUpDate).toLocaleDateString()}{" "}
                    </td>
                    <td style={styles.td} className="lato-regular">
                      {record.appointment_time}
                    </td>
                    <td
                      style={{ ...styles.td, ...getStatusStyle(record.status) }}
                      className="lato-bold"
                    >
                      {record.status}
                    </td>
                    <td style={styles.td}>
                      <button
                        className="lato-regular"
                        style={styles.button}
                        onClick={() => handleViewDetails(record._id)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={styles.noData}>Không có hồ sơ bệnh án nào.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "20px auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    color: "#5790ab",
    marginBottom: "40px",
    fontSize: "35px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    backgroundColor: "#f2f2f2",
    color: "var(--blue)",
    textAlign: "left",
    padding: "10px",
    borderBottom: "2px solid #ddd",
    fontSize: "18px",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  },
  tr: {
    backgroundColor: "#fff",
    transition: "background-color 0.3s",
  },
  trHover: {
    backgroundColor: "#f5f5f5",
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
  buttonHover: {
    backgroundColor: "#274c77",
  },
  noData: {
    textAlign: "center",
    color: "#5790ab",
    fontSize: "18px",
  },
};

export default PatientRecords;
