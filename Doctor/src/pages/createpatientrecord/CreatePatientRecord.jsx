import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import "./CreatePatientRecord.css"
import Sidebar from "../../components/sidebar/Sidebar";

const CreatePatientRecord = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [serviceCates, setServiceCates] = useState([]);
  const [serviceSelections, setServiceSelections] = useState([]);
  const [description, setDescription] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [followUpDate, setFollowUpDate] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/appointment/getappointment/${appointmentId}`,
          { withCredentials: true }
        );
        setAppointment(data.appointment);

        // Khởi tạo serviceSelections từ appointment.services
        if (data.appointment && data.appointment.services) {
          const initialSelections = data.appointment.services.map(
            (service) => ({
              serviceTypeId: service.serviceTypeId._id || "",
              services: [],
              serviceId: service.serviceId._id || "",
              serviceName: service.serviceId.serviceName || "",
              servicePrice: service.serviceId.servicePrice || 0,
              quantity: service.quantity || 1,
            })
          );
          // Lấy tất cả serviceTypeId từ initialSelections để fetch services
          const servicePromises = initialSelections.map(
            async (selection, index) => {
              if (selection.serviceTypeId) {
                const { data } = await axios.get(
                  `http://localhost:4000/api/v1/service/getallservices/${selection.serviceTypeId}`
                );
                return { index, services: data.data };
              }
              return null;
            }
          );

          // Chờ tất cả các request hoàn thành và cập nhật initialSelections
          const resolvedServices = await Promise.all(servicePromises);
          resolvedServices.forEach((resolved) => {
            if (resolved) {
              initialSelections[resolved.index].services = resolved.services;
            }
          });
          setServiceSelections(initialSelections);
          calculateTotalPrice(initialSelections);
        }
      } catch (err) {
        console.error("Có lỗi:", err);
        toast.error("Error loading appointment details.");
      }
    };

    const fetchServiceCates = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/service/getallservicecate"
        );
        setServiceCates(data.data);
      } catch (err) {
        console.error("Có lỗi:", err);
        toast.error("Error loading service categories.");
      }
    };

    fetchAppointment();
    fetchServiceCates();
  }, [appointmentId]);

  const handleServiceTypeChange = async (index, serviceTypeId) => {
    const updatedSelections = [...serviceSelections];
    updatedSelections[index].serviceTypeId = serviceTypeId;
    updatedSelections[index].serviceId = "";
    updatedSelections[index].servicePrice = 0;
    
    if (serviceTypeId) {
      const { data } = await axios.get(
        `http://localhost:4000/api/v1/service/getallservices/${serviceTypeId}`
      );
      updatedSelections[index].services = data.data;
    } else {
      updatedSelections[index].services = [];
    }

    setServiceSelections(updatedSelections);
  };

  const handleServiceChange = (index, serviceId) => {
    const updatedSelections = [...serviceSelections];
    const selectedService = updatedSelections[index].services.find(
      (service) => service._id === serviceId
    );
    updatedSelections[index].serviceId = serviceId;
    updatedSelections[index].servicePrice = selectedService
      ? selectedService.servicePrice
      : 0;
    setServiceSelections(updatedSelections);
    calculateTotalPrice(updatedSelections);
  };

  const addServiceSelection = () => {
    setServiceSelections([
      ...serviceSelections,
      {
        serviceTypeId: "",
        services: [],
        serviceId: "",
        servicePrice: 0,
        quantity: 1,
      },
    ]);
  };

  const removeServiceSelection = (index) => {
    const updatedSelections = [...serviceSelections];
    updatedSelections.splice(index, 1);
    setServiceSelections(updatedSelections);
    calculateTotalPrice(updatedSelections);
  };

  const handleQuantityChange = (index, delta) => {
    const updatedSelections = [...serviceSelections];
    updatedSelections[index].quantity = Math.max(
      1,
      updatedSelections[index].quantity + delta
    );
    setServiceSelections(updatedSelections);
    calculateTotalPrice(updatedSelections);
  };

  const calculateTotalPrice = (selections) => {
    const newTotalPrice = selections.reduce(
      (total, selection) => total + selection.servicePrice * selection.quantity,
      0
    );
    setTotalPrice(newTotalPrice);
  };
  const minFollowUpDate = appointment
    ? new Date(
        new Date(appointment.appointment_date).getTime() + 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0]
    : "";

  const handleSaveRecord = async () => {
    const services = serviceSelections.map((selection) => ({
      serviceTypeId: selection.serviceTypeId,
      serviceId: selection.serviceId,
      servicePrice: selection.servicePrice,
      quantity: selection.quantity,
    }));

    if (totalPrice <= 0) {
      toast.error("Total Price must be greater than 0!");
      return;
    }
    try {
      const recordData = {
        appointmentId,
        services,
        totalPrice,
        description,
        followUpDate,
        patientName: appointment ? appointment.patientName : null, // lấy patientName từ appointment
      };
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/patient/createpatientrecord",
        recordData,
        { withCredentials: true }
      );
      toast.success(data.message);
      setAppointment("");
      setServiceSelections("");
      setTotalPrice("");
      setDescription("");
      setFollowUpDate("");
      navigate("/accepted-appointments");
    } catch (error) {
      console.error("Có lỗi", error);
      toast.error("Failed to create patient record.");
    }
  };

  return (
    <div>
      <div className="create_patient">
        <Sidebar/>

        {appointment && (

        <div className="nd_patient">

          <h1>Tạo hồ sơ bệnh nhân</h1>     

          <div className="muc-detail-patient">
            <label>Tên bệnh nhân</label>
            <div className="value-detail-patient"> {appointment.name}</div>
          </div>


           <div className="gop-muc-patient">
              <div className="muc-detail-patient">
                <label> Ngày sinh</label>
                <div className="value-detail-patient">{" "}  {moment(appointment.dob).format("DD/MM/YYYY")}</div>
              </div>
              
              <div className="muc-detail-patient">
                <label> Giới tính</label>
                <div className="value-detail-patient"> {appointment.gender}</div>
              </div>
            </div>
        
            <div className="gop-muc-patient">
              <div className="muc-detail-patient">
                <label>Email</label>
                <div className="value-detail-patient">{" "}  {moment(appointment.dob).format("DD/MM/YYYY")}</div>
              </div>
              
              <div className="muc-detail-patient">
                <label> Số điện thoại</label>
                <div className="value-detail-patient"> {appointment.gender}</div>
              </div>
            </div>
            <div className="gop-muc-patient">
                <div className="muc-detail-patient">
                  <label> Ngày khám </label>
                  <div className="value-detail-patient">{moment(appointment.appointment_date).format("DD/MM/YYYY")}</div>
                </div>
                
                <div className="muc-detail-patient">
                  <label> Giờ khám </label>
                  <div className="value-detail-patient">{appointment.appointment_time}</div>
                </div>
              </div>
              <div className="muc-detail-patient">
                <label> Địa chỉ </label>
                <div className="value-detail-patient">{appointment.address}</div>
              </div>
              
              
            {serviceSelections.map((selection, index) => (

              <div key={index} className="form-row-patient">

              <div className="type-service">

                <div className="nho">
                  <label>Loại dịch vụ </label>

                  <select
                    className={`service-select-patient ${
                      serviceSelections.length > 1 ? "short" : ""
                    }`}
                      value={selection.serviceTypeId}
                      onChange={(e) => handleServiceTypeChange(index, e.target.value)}
                    >
                      <option value="">Chọn loại dịch vụ</option>
                    {serviceCates.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.serviceCateName}
                      </option>
                    ))}
                  </select>
                </div>

              {/* Nút xóa chỉ hiển thị khi số lượng lựa chọn lớn hơn 1 */}
              {serviceSelections.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeServiceSelection(index)}
                  disabled={serviceSelections.length === 1}
                  className="add-move"
                >
                  -
                </button>
             )}
          </div>


          <div className="service-patient">

            <div className="nho">

              <label>Dịch vụ</label>
              <select
                className={`service-select-patient`}
                value={selection.serviceId}
                onChange={(e) => handleServiceChange(index, e.target.value)}
                disabled={!selection.serviceTypeId}
              >
                <option value="">Dịch vụ</option>
                {selection.services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.serviceName} - {service.servicePrice}
                  </option>
                ))}
              </select>
            </div>

            <div className="quanlity">
              <button onClick={() => handleQuantityChange(index, -1)}>-</button>
              <span>{selection.quantity}</span>
              <button onClick={() => handleQuantityChange(index, 1)}>+</button>
            </div>           
          </div>
        
        </div>
        ))}
       <div className="update-patient">

          <label>Ngày theo dõi</label>
          <input
            type="date"
            value={followUpDate}
            min={minFollowUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            required
          />
        </div>
        <div className="muc-detail-patient" >
          <label>Mô tả</label>
          <textarea 
          className="value-detail-patient"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

      

        <div className="add-service">
          <p type="button" onClick={addServiceSelection}>+ Thêm dich vụ </p>
        </div>

        <div className="price">
          <label>Tổng tiền:</label>
          <div className="nd-price">
          {totalPrice > 0 ? `${totalPrice} VND` : "-"}
          </div>
        </div>

        <div className="btn-save">
            <button onClick={handleSaveRecord}>Lưu hồ sơ</button>
        </div>

      </div>

      )}
      </div>
    </div>
  );
};

export default CreatePatientRecord;
