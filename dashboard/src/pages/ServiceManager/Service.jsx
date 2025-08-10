import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import { FaToggleOn, FaToggleOff, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import Modal from "react-modal";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Service.css";

// Thiết lập Modal mặc định
Modal.setAppElement('#root'); // Đảm bảo Modal hoạt động tốt trên React

const Service = () => {
  const [services, setServices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    serviceName: "",
    servicePrice: "",
    serviceType: "",
  });
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const { isAuthenticated } = useContext(Context);

  const fetchServices = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/service/getallservices");
      setServices(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Không thể lấy danh sách dịch vụ");
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/service/getallservicecate");
      setServiceTypes(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Không thể lấy danh sách loại dịch vụ");
    }
  };

  const handleAddService = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/service/createservice",
        serviceForm,
        {
          withCredentials: true,
          headers: { "Content-service": "application/json" },
        }
      );
      toast.success(data.message);
      setShowAddModal(false);
      fetchServices();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Không thể tạo dịch vụ");
    }
  };

  const handleEditService = async () => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/service/updateservice/${selectedService._id}`,
        serviceForm,
        {
          withCredentials: true,
          headers: { "Content-service": "application/json" },
        }
      );
      toast.success(data.message);
      setShowEditModal(false);
      fetchServices();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Không thể chỉnh sửa dịch vụ");
    }
  };

  const handleDeleteService = async () => {
    try {
      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/service/deleteservice/${selectedService._id}`,
        { withCredentials: true }
      );
      toast.success(data.message);
      setShowDeleteModal(false);
      fetchServices();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Không thể xóa dịch vụ");
    }
  };

  if (!isAuthenticated) {
    toast.info("Chưa đăng nhập");
    return <Navigate to={"/login"} />;
  }

  useEffect(() => {
    fetchServices();
    fetchServiceTypes();
  }, []);

  const handleOpenAddModal = () => {
    setServiceForm({ serviceName: "", servicePrice: "", serviceType: "" });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (service) => {
    setSelectedService(service);
    setServiceForm({
      serviceName: service.serviceName,
      servicePrice: service.servicePrice,
      serviceType: service.serviceType?._id || "",
    });
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  const toggleStatus = async (id) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:4000/api/v1/service/updateactiveservice/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success(data.message);
      fetchServices();
    } catch (error) {
      console.error(error);
      toast.error("Không thể thay đổi trạng thái");
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="service-manager-content">
        <div className="page-service">
          <h1 className="lato-bold">DANH SÁCH DỊCH VỤ</h1>
          <div className="add-service">
            <button onClick={handleOpenAddModal} className="btn-add-service lato-bold">
              Thêm Dịch Vụ<span className="plus-icon">+</span>
            </button>
          </div>
          {services.length === 0 ? (
            <p>Không có dịch vụ nào để hiển thị</p>
          ) : (
            <div className="service-table-wrapper">
              <table className="service-table">
                <thead>
                  <tr>
                    <th className="lato-bold">Tên Dịch Vụ</th>
                    <th className="lato-bold">Giá Dịch Vụ (VND)</th>
                    <th className="lato-bold">Loại Dịch Vụ</th>
                    <th className="lato-bold">Trạng Thái</th>
                    <th className="lato-bold">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service._id}>
                      <td className="lato-regular">{service.serviceName}</td>
                      <td className="lato-regular">{service.servicePrice.toLocaleString()} VND</td>
                      <td className="lato-regular">{service.serviceType?.serviceCateName || "Không xác định"}</td>
                      <td className="lato-regular">
                        {service.isActive ? (
                          <span style={{ color: "green" }}>Hoạt động</span>
                        ) : (
                          <span style={{ color: "red" }}>Ngừng hoạt động</span>
                        )}
                      </td>
                      <td className="lato-regular">
                        <div className="icon-btn-edit-delete">
                          <button onClick={() => handleOpenEditModal(service)}>
                            <FaEdit className="icon-edit-delete" />
                          </button>
                          <button onClick={() => handleOpenDeleteModal(service)}>
                            <FaTrash className="icon-edit-delete" />
                          </button>
                          <button onClick={() => toggleStatus(service._id)}>
                            {service.isActive ? (
                              <FaToggleOn style={{ color: "green", fontSize: "24px" }} />
                            ) : (
                              <FaToggleOff style={{ color: "red", fontSize: "24px" }} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal Thêm */}
          <Modal isOpen={showAddModal} onRequestClose={() => setShowAddModal(false)} className="modal-content-service" overlayClassName="modal-overlay-service">
            <div>
              <button onClick={() => setShowAddModal(false)} className="close-icon-service">
                <FaTimes />
              </button>
              <h2 className="modal-title-service lato-bold">Thêm Dịch Vụ</h2>
              <label className='label-text-service lato-bold'>Tên Dịch Vụ:</label>
              <input
                className="modal-input-service lato-regular"
                type="text"
                value={serviceForm.serviceName}
                onChange={(e) => setServiceForm({ ...serviceForm, serviceName: e.target.value })}
              />
              <label className='label-text-service lato-bold'>Giá Dịch Vụ:</label>
              <input
                className="modal-input-service lato-regular"
                type="number"
                value={serviceForm.servicePrice}
                onChange={(e) => setServiceForm({ ...serviceForm, servicePrice: e.target.value })}
              />
              <label className='label-text-service lato-bold'>Loại Dịch Vụ:</label>
              <select
                className="modal-input-service lato-regular"
                value={serviceForm.serviceType}
                onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value })}
              >
                <option value="" >Chọn Loại Dịch Vụ</option>
                {serviceTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.serviceCateName}
                  </option>
                ))}
              </select>
              <button onClick={handleAddService} className="modal-submit-button-service">Thêm</button>
              {/* <button onClick={() => setShowAddModal(false)}>Đóng</button> */}
            </div>
          </Modal>

          {/* Modal Chỉnh Sửa */}
          <Modal isOpen={showEditModal} onRequestClose={() => setShowEditModal(false)} className="modal-content-service" overlayClassName="modal-overlay-service">
            <div >
              <button onClick={() => setShowEditModal(false)} className="close-icon-service">
                <FaTimes />
              </button>
              <h2 className="modal-title-service lato-bold">Chỉnh Sửa Dịch Vụ</h2>
              <label className='label-text-service lato-bold'>Tên Dịch Vụ:</label>
              <input
                className="modal-input-service lato-regular"
                type="text"
                value={serviceForm.serviceName}
                onChange={(e) => setServiceForm({ ...serviceForm, serviceName: e.target.value })}
              />
              <label className='label-text-service lato-bold'>Giá Dịch Vụ:</label>
              <input
                className="modal-input-service lato-regular"
                type="number"
                value={serviceForm.servicePrice}
                onChange={(e) => setServiceForm({ ...serviceForm, servicePrice: e.target.value })}
              />
              <label className='label-text-service lato-bold'>Loại Dịch Vụ:</label>
              <select
                className="modal-input-service lato-regular"
                value={serviceForm.serviceType}
                onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value })}
              >
                <option value="">Chọn Loại Dịch Vụ</option>
                {serviceTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.serviceCateName}
                  </option>
                ))}
              </select>
              <button onClick={handleEditService} className="modal-submit-button-service">Lưu thay đổi</button>
              {/* <button onClick={() => setShowEditModal(false)}>Đóng</button> */}
            </div>
          </Modal>

          {/* Modal Xóa */}
          <Modal isOpen={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)} className="modal-content-service" overlayClassName="modal-overlay-service">
            <div>
              <button onClick={() => setShowDeleteModal(false)} className="close-icon-service">
                <FaTimes />
              </button>
              <h2 className="modal-title-service lato-bold">Bạn có chắc chắn muốn xóa dịch vụ này?</h2>
              <button onClick={handleDeleteService}>Xóa</button>
              {/* <button onClick={() => setShowDeleteModal(false)}>Hủy</button> */}
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Service;
