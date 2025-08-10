import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
// import moment from "moment";
import "./CreateFollowUpAppointment.css"
import Sidebar from "../../components/sidebar/Sidebar";
const CreateFollowUpAppointment = () => {
  const navigate = useNavigate();
  const { followUpAppointmentId } = useParams();
  const [patientInfo, setPatientInfo] = useState({
    invoiceCode: "",
    patientName: "",
    phone: "",
    appointment_date: "",
    appointment_time: "",
    address: "",
  });
  const [serviceCates, setServiceCates] = useState([]);
  const [serviceSelections, setServiceSelections] = useState([
    {
      serviceTypeId: "",
      services: [],
      serviceId: "",
      servicePrice: 0,
      quantity: 1,
    },
  ]);
  const [description, setDescription] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [followUpDate, setFollowUpDate] = useState("");

  useEffect(() => {
    // Fetch service categories
    const fetchServiceCates = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/service/getallservicecate",
          { withCredentials: true}
        );
        setServiceCates(data.data);
      } catch (err) {
        console.error("Error fetching service categories:", err);
        toast.error("Failed to load service categories.");
      }
    };

    fetchServiceCates();
  }, []);

  const handleServiceTypeChange = async (index, serviceTypeId) => {
    const updatedSelections = [...serviceSelections];
    updatedSelections[index].serviceTypeId = serviceTypeId || null; // Đặt null nếu giá trị trống
    updatedSelections[index].serviceId = null; // Reset serviceId
    updatedSelections[index].servicePrice = 0;

    if (serviceTypeId) {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/service/getallservices/${serviceTypeId}`
        );
        updatedSelections[index].services = data.data;
      } catch (err) {
        console.error("Error fetching services:", err);
        toast.error("Failed to load services.");
      }
    } else {
      updatedSelections[index].services = [];
    }

    setServiceSelections(updatedSelections);
  };

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/followupappointment/detailfollowupappointment/${followUpAppointmentId}`,
          { withCredentials: true }
        );
        const record = data.data.patientRecordId || {};
        setPatientInfo({
          invoiceCode: record.invoiceCode || "N/A",
          patientName: record.patientName || "N/A",
          phone: record.phone || "N/A",
          appointment_date: record.appointment_date || "N/A",
          appointment_time: record.appointment_time || "N/A",
          address: record.address || "N/A",
        });
        setDescription(data.data.description || "");
      } catch (err) {
        console.error("Có lỗi:", err);
        toast.error("Error loading appointment details.");
      }
    };

    if (followUpAppointmentId) {
      fetchAppointment();
    }
  }, [followUpAppointmentId]);

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

  const handleQuantityChange = (index, delta) => {
    const updatedSelections = [...serviceSelections];
    updatedSelections[index].quantity = Math.max(
      1,
      updatedSelections[index].quantity + delta
    );
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

  const calculateTotalPrice = (selections) => {
    const newTotalPrice = selections.reduce(
      (total, selection) => total + selection.servicePrice * selection.quantity,
      0
    );
    setTotalPrice(newTotalPrice);
  };

  const handleSaveAppointment = async () => {
    if (serviceSelections.some((selection) => !selection.serviceId)) {
      toast.error("Vui lòng chọn đầy đủ dịch vụ.");
      return;
    }
    if (totalPrice <= 0) {
      toast.error("Tổng giá trị phải lớn hơn 0!");
      return;
    }

    const services = serviceSelections.map((selection) => ({
      serviceTypeId: selection.serviceTypeId,
      serviceId: selection.serviceId,
      servicePrice: selection.servicePrice,
      quantity: selection.quantity,
    }));
    console.log(totalPrice);
    try {
      const appointmentData = {
        followUpAppointmentId,
        services,
        totalPrice,
        description,
        followUpDate,
      };

      let response;
      // Kiểm tra nếu có followUpDate thì gọi POST, nếu không có thì gọi PUT
      if (followUpDate) {
        response = await axios.post(
          "http://localhost:4000/api/v1/followupappointment/checkoutfollowupappointment",
          appointmentData,
          { withCredentials: true }
        );
      } else {
        response = await axios.put(
          `http://localhost:4000/api/v1/followupappointment/checkoutfollowupappointment/${followUpAppointmentId}`,
          appointmentData,
          { withCredentials: true }
        );
      }

      toast.success(response.data.message);
      navigate("/doctor/getfollowupappointment");
    } catch (err) {
      console.error("Error saving follow-up appointment:", err);
      toast.error("Failed to create or update follow-up appointment.");
    }
  };

  return (
    <div>
      <div className="create-folow">
        <Sidebar/>

        <div className="nd-create-folow">

            <h1>Tạo phiếu tái khám</h1>

            <div className="muc-detail-create-folow">
            <label>Mã hồ sơ</label>
            <div className="value-detail-create-folow"> {patientInfo.invoiceCode}</div>
            </div>
            
            <div className="muc-detail-create-folow">
            <label>Tên bệnh nhân</label>
            <div className="value-detail-create-folow"> {patientInfo.patientName}</div>
            </div>
           
            <div className="muc-detail-create-folow">
            <label>Số điện thoại</label>
            <div className="value-detail-create-folow"> {patientInfo.phone}</div>
            </div>

            <div className="muc-detail-create-folow">
            <label>Ngày đã khám</label>
            <div className="value-detail-create-folow"> {patientInfo.appointment_date}</div>
            </div>
            
            <div className="lichtaikham">
              <label>Lịch tái khám</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </div>
            <div className="muc-detail-create-folow">
            <label>Địa chỉ</label>
            <div className="value-detail-create-folow"> {patientInfo.address}</div>
            </div>
         


            {serviceSelections.map((selection, index) => (

              <div key={index} className="form-row-create">

              <div className="type-service-create">
                  <div className="hahahahahi">
                    <label>Loại dịch vụ</label>
                    <select
                    className={`service-select-create ${
                      serviceSelections.length > 1 ? "short" : ""
                    }`}
                      value={selection.serviceTypeId}
                      onChange={(e) => handleServiceTypeChange(index, e.target.value)}
                    >
                      <option value="">Loại dịch vụ</option>
                      {serviceCates.map((cate) => (
                        <option key={cate._id} value={cate._id}>
                          {cate.serviceCateName}
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
                      className="add-move-create"
                    > - </button>
                     )}
                </div>


                <div className="dina">

                  <div className="hahahahahi">

                    <label>Dịch vụ</label>
                      <select
                        className={`service-select-create`}
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

                  <div className="soluong">
                    <button onClick={() => handleQuantityChange(index, -1)} disabled={!selection.serviceTypeId || selection.quantity <= 0}> - </button>
                      <span>{selection.quantity}</span>
                      <button  onClick={() => handleQuantityChange(index, 1)} disabled={!selection.serviceTypeId}> + </button>
                  </div>
                </div>
              <div>
               
            </div>
          </div>
            ))}

        <div className="add-service-create">
          <p type="button" onClick={addServiceSelection}>+ Thêm dich vụ </p>
        </div>

            <div className="muc-detail-create-folow">
          <label>Mô tả</label>
          <textarea 
          className="value-detail-create-folow"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

            <div className="price-create">
              <label>Tổng tiền</label>
              <div className="gia-tao">

             {totalPrice > 0 ? `${totalPrice} VND` : "-"}
              </div>
            </div>

            <div className="btn-save">

              <button onClick={handleSaveAppointment}>Lưu phiếu</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFollowUpAppointment;
