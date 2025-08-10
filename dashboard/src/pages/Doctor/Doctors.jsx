import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../../main";
import { Link, Navigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import './Doctors.css'
import { FaTimes } from 'react-icons/fa'; // Importing icons

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(Context);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/user/doctors", {
          withCredentials: true
        });
        setDoctors(data.doctors);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Lỗi kết nối với máy chủ!";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  if (loading) {
    return <h1>Đang tải danh sách bác sĩ...</h1>;
  }

  const handleEditClick = (doctor) => {
    setSelectedDoctor(doctor);
    setModalOpen(true);
  };

  const handleDeleteClick = (doctor) => {
    setSelectedDoctor(doctor);
    setDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleSaveChanges = async (updatedDoctor) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/user/doctor/update/${selectedDoctor._id}`,
        updatedDoctor,
        { withCredentials: true }
      );
      toast.success("Thông tin bác sĩ đã được cập nhật!");
      setDoctors(
        doctors.map((doctor) =>
          doctor._id === selectedDoctor._id ? data.doctor : doctor
        )
      );
      setModalOpen(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi cập nhật thông tin bác sĩ!";
      toast.error(errorMessage);
    }
  };

  const handleDeleteDoctor = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/api/v1/user/doctor/delete/${selectedDoctor._id}`,
        { withCredentials: true }
      );
      toast.success("Bác sĩ đã được xóa thành công!");
      setDoctors(doctors.filter((doctor) => doctor._id !== selectedDoctor._id));
      setDeleteModalOpen(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi xóa bác sĩ!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="doctor-manager-content">
        <section className="page doctors">
          <h1 className="lato-bold">DANH SÁCH BÁC SĨ</h1>
          <div className="add-doctor-button ">
            <Link to='/doctors/addnew' className="add-doctor-link lato-bold">
              Thêm bác sĩ +
            </Link>
          </div>
          <div className="banner lato-bold">
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <div className="card" key={doctor._id}>
                  <img src={doctor.docAvatar?.url} alt="doctor avatar" />
                  <h4 className="lato-bold">{`${doctor.name}`}</h4>
                  <div className="details">
                    <p className="lato-bold">Email: <span className="lato-regular">{doctor.email}</span></p>
                    <p className="lato-bold">Điện thoại: <span className="lato-regular">{doctor.phone}</span></p>
                    <p className="lato-bold">Ngày sinh: <span className="lato-regular">{doctor.dob.substring(0, 10)}</span></p>
                    <p className="lato-bold">Giới tính: <span className="lato-regular">{doctor.gender}</span></p>
                    <div className="card-actions">
                      {/* <button onClick={() => handleDeleteClick(doctor)}>Xóa bác sĩ</button> */}
                      <button onClick={() => handleEditClick(doctor)}>Chỉnh sửa</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h1>Không tìm thấy bác sĩ nào!</h1>
            )}
          </div>

          {/* Modal chỉnh sửa bác sĩ */}
          {modalOpen && selectedDoctor && (
            <div className="modal-overlay" onClick={handleCloseModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button onClick={handleCloseModal} className="close-icon">
                  <FaTimes />
                </button>
                <h2 className="modal-title">Chỉnh sửa thông tin bác sĩ</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const updatedDoctor = {
                      name: e.target.name.value,
                      email: e.target.email.value,
                      phone: e.target.phone.value,
                      dob: e.target.dob.value,
                      gender: e.target.gender.value,
                      Introduceyourself: e.target.Introduceyourself.value,
                    };
                    handleSaveChanges(updatedDoctor);
                  }}
                >
                  <label className='label-text lato-bold'>Tên bác sĩ:</label>
                  <input className="modal-input" type="text" name="name" defaultValue={selectedDoctor.name} />
                  <label className='label-text lato-bold'>Email:</label>
                  <input className="modal-input" type="email" name="email" defaultValue={selectedDoctor.email} />
                  <label className='label-text lato-bold'>Điện thoại:</label>
                  <input className="modal-input" type="text" name="phone" defaultValue={selectedDoctor.phone} />
                  <label className='label-text lato-bold'>Ngày sinh:</label>
                  <input className="modal-input" type="date" name="dob" defaultValue={selectedDoctor.dob.substring(0, 10)} />
                  <label className='label-text lato-bold'>Giới tính:</label>
                  <select className="modal-input" name="gender" defaultValue={selectedDoctor.gender}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                  <label className='label-text lato-bold'>Giới thiệu bản thân:</label>
                  <textarea className="modal-input" name="Introduceyourself" defaultValue={selectedDoctor.Introduceyourself} />
                  <div className="modal-actions-admin">
                    {/* <button type="button" onClick={handleCloseModal}>Hủy</button> */}
                    <button type="submit" className="modal-submit-button">Lưu thay đổi</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* {deleteModalOpen && selectedDoctor && (
            <div className="modal-overlay" onClick={handleCloseDeleteModal}>
              <div className="modal-content-1" onClick={(e) => e.stopPropagation()}>
                <button onClick={handleCloseDeleteModal} className="close-icon">
                  <FaTimes />
                </button>
                <h2 className="modal-title">Xác nhận xóa tài khoản</h2>
                <p className="modal-title">Bạn có chắc chắn muốn xóa tài khoản của bác sĩ <strong>{selectedDoctor.name}</strong> không?</p>
                <div className="modal-actions-admin">
                  <button onClick={handleDeleteDoctor} className="delete-confirm-btn">Xóa</button>
                </div>
              </div>
            </div>
          )} */}
        </section>
      </div>
    </div>
  );
};

export default Doctors;
