import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Context } from "../../main";
import { toast } from "react-toastify";
import Sidebar from "../../components/sidebar/Sidebar";
import "./AcceptedAppointment.css"
import moment from "moment";

const AcceptedAppointments = () => {
  const { isAuthenticated } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const handleUpdateStatus = async (appointmentId, newStatus) => {
  //   try {
  //     const response = await axios.put(
  //       `http://localhost:4000/api/v1/appointment/doctorupdate/${appointmentId}`,
  //       { status: newStatus },
  //       { withCredentials: true }
  //     );

  //     // Cập nhật trạng thái trong danh sách appointments
  //     setAppointments((prevAppointments) =>
  //       prevAppointments.map((appointment) =>
  //         appointment._id === appointmentId
  //           ? { ...appointment, status: newStatus }
  //           : appointment
  //       )
  //     );

  //     toast.success(response.data.message); // Hiển thị thông báo thành công
  //     location.reload();
  //   } catch (error) {
  //     console.error("Failed to update status:", error);
  //     toast.error("Cập nhật trạng thái thất bại."); // Thông báo lỗi
  //   }
  // };

  useEffect(() => {
    const fetchAcceptedAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/appointment/getacceptedappointments",
          { withCredentials: true }
        );

        // Lấy danh sách cuộc hẹn và sắp xếp
        const sortedAppointments = response.data.appointments.sort((a, b) => {
          const today = new Date().toISOString().split("T")[0]; // Ngày hôm nay dạng YYYY-MM-DD

          // Ưu tiên ngày hôm nay
          if (a.appointment_date === today && b.appointment_date !== today)
            return -1;
          if (a.appointment_date !== today && b.appointment_date === today)
            return 1;

          // Sắp xếp theo ngày
          if (a.appointment_date < b.appointment_date) return -1;
          if (a.appointment_date > b.appointment_date) return 1;

          // Nếu cùng ngày, sắp xếp theo giờ
          return a.appointment_time.localeCompare(b.appointment_time);
        });

        setAppointments(sortedAppointments);
        toast.success(response.data.message);
      } catch (error) {
        console.error("Error fetching accepted appointments:", error);
        setError("Failed to load accepted appointments.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchAcceptedAppointments();
    }
  }, [isAuthenticated]);

  if (loading) return <p>Đang tải các cuộc hẹn đã chấp nhận...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="accepted_doctor">
        <Sidebar/>

        <div className="nd_accepted">

          <h2>Danh sách cuộc hẹn đã chấp nhận</h2>
          {appointments.length > 0 ? (

         <table>
            <thead>
              <tr>
              <th className="tbn_accepted">Tên bệnh nhân</th>
                <th className="nk_accepted">Ngày khám</th>
                <th className="gk_accepted">Giờ khám</th>
                <th className="tt_accepted">Trạng thái</th>
                <th className="ct_accepted"></th>
              
              </tr>
            </thead>

           <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>

                <td>{`${appointment.name}`}</td>

                {/* <td>{appointment.appointment_date}</td> */}
                <td>{moment(appointment.appointment_date).format("DD/MM/YYYY")}</td>

                <td>{appointment.appointment_time}</td>

                {/* <td>
                  <select
                    className={
                      appointment.status === "Accepted"
                        ? "value-accepted"
                        : appointment.status === "Rejected"
                        ? "value-rejected"
                        : "value-pending"
                    }
                    value={appointment.status}
                    onChange={(e) =>
                      handleUpdateStatus(appointment._id, e.target.value)
                    }
                  >
                    <option value="Accepted" className="value-accepted">
                      Accepted
                    </option>
                    <option value="Rejected" className="value-rejected">
                      Rejected
                    </option>
                  </select>
                </td> */}
                   <td>
                      <span className="value-accepted">{appointment.status}</span>
                    </td>
                <td>
                  <Link to={`/acceptedappointmentdetails/${appointment._id}`}>
                    <button className="btn_accepted">Xem Chi Tiết</button>
                  </Link>
             
                  <Link to={`/create-patient-record/${appointment._id}`}>
                    <button className="btn_accepted">Tạo phiếu khám</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có cuộc hẹn nào được chấp nhận.</p>
      )}
    </div>
    </div>
    </div>
  );
};

export default AcceptedAppointments;
