import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Context } from "../../main.jsx";
import "./Record.css";
import { assets } from "../../assets/assets.js";
const DetailPatientRecords = () => {
  const { isAuthenticated } = useContext(Context);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    // Gọi API để lấy danh sách hồ sơ bệnh án
    const fetchRecords = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/patient/getdetailpatientrecord/${id}`,
          { withCredentials: true }
        );
        setRecord(data.data);
        console.log(data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [isAuthenticated, id]);
  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!record) return <p>Không tìm thấy hồ sơ bệnh án.</p>;

  return (
    <div className="patient-record-detail">
      <section className="bio-dental-care">
        <img src={assets.logo} alt="logo" />
        <div className="bio-content">
          <h3 className="lato-bold"> NHA KHOA MOUTAIN VIEW</h3>
          <h3 className="lato-regular"> +84 1234567</h3>
          <h3 className="lato-regular">
            {" "}
            828 Sư Vạn Hạnh, phường 13, quận 10 , Thành phố Hồ Chí Minh
          </h3>
        </div>
      </section>
      <section className="record-patient-detail">
        <h5 className="lato-bold">CHI TIẾT HỒ SƠ BỆNH ÁN</h5>
        <div className="record-pateint-detail-container">
          <ul className="patient-infor-detail">
            <li className="lato-bold">
              Mã hồ sơ:
              <span className="lato-regular">{record.invoiceCode} </span>
            </li>
            <li className="lato-bold">
              Tên bệnh nhân:
              <span className="lato-regular">{record.patientName}</span>
            </li>
            <li className="lato-bold">
              Thời gian hẹn:
              <span className="lato-regular">{record.appointment_time}</span>
            </li>
            <li className="lato-bold">
              Số điện thoại:
              <span className="lato-regular">{record.phone}</span>{" "}
            </li>
            <li className="lato-bold">
              Địa chỉ:
              <span className="lato-regular">
                {record.address || "Không xác định"}{" "}
              </span>
            </li>
          </ul>
          <ul className="patient-booking">
            <li className="lato-bold">
              Bác sĩ:
              <span className="lato-regular">
                {record.doctorId?.name || "Không xác định"}
              </span>
            </li>
            <li className="lato-bold">
              Ngày đã khám:
              <span className="lato-regular">{record.appointment_date}</span>
            </li>

            <li className="lato-bold">
              Ngày tái khám:
              <span className="lato-regular">
                {new Date(record.followUpDate).toLocaleDateString()}{" "}
              </span>
            </li>
            <li className="lato-bold">
              Trạng thái:
              <span className="lato-regular">{record.status} </span>
            </li>
          </ul>
        </div>
      </section>
      <section className="pateint-service-detail">
        {record.services?.length > 0 ? (
          <table>
            <thead>
              <tr className="lato-bold">
                <th>Loại dịch vụ</th>
                <th>Dịch vụ</th>
                <th>Giá</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {record.services.map((service) => (
                <tr key={service._id} className="lato-regular">
                  <td>
                    {service.serviceTypeId?.serviceCateName || "Không xác định"}
                  </td>
                  <td>{service.serviceId?.serviceName || "Không xác định"}</td>
                  <td>{service.servicePrice?.toLocaleString()} VND</td>
                  <td className="quantity-detail">{service.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có dịch vụ nào.</p>
        )}
      </section>
      <section className="record-total">
        <div className="notes">
          <input
            className="lato-bold"
            placeholder="GHI CHÚ"
            type="text"
          ></input>
        </div>
        <div className="total-detail">
          <h2 className="lato-regular">TỔNG CỘNG</h2>
          <h2 className="lato-bold">
            {record.totalPrice.toLocaleString()} VNĐ
          </h2>
        </div>
      </section>
      <Link to="/" className="backHome lato-bold">
        Quay về Trang chủ
      </Link>
    </div>
  );
};

export default DetailPatientRecords;
