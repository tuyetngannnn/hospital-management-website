import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import { FaEdit, FaTimes, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Modal from "react-modal";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./ServiceCate.css";

const ServiceCategory = () => {
    const [serviceCateList, setServiceCateList] = useState([]);
    const { isAuthenticated } = useContext(Context);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(""); // Loại modal: add, edit
    const [selectedCategory, setSelectedCategory] = useState(null); // Dữ liệu dịch vụ được chọn
    const [newCategory, setNewCategory] = useState({
        serviceCateName: "",
        descriptionservice: "",
        serviceCateImage: [],
    });

    const fetchServices = async () => {
        try {
            const { data } = await axios.get("http://localhost:4000/api/v1/service/getallservicecate");
            setServiceCateList(data.data);
        } catch (error) {
            console.error(error);
            toast.error("Không thể lấy danh sách loại dịch vụ");
        }
    };

    const toggleStatus = async (id) => {
        try {
            const { data } = await axios.patch(
                `http://localhost:4000/api/v1/service/disableservicecate/${id}`,
                {},
                { withCredentials: true, headers: { "Content-Type": "application/json" } }
            );
            toast.success(data.message);
            setServiceCateList((prevCategories) =>
                prevCategories.map((category) =>
                    category._id === id ? { ...category, isActive: !category.isActive } : category
                )
            );
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Không thể cập nhật trạng thái dịch vụ");
        }
    };

    // const toggleStatus = async (id) => {
    //     try {
    //         const { data } = await axios.patch(
    //             `http://localhost:4000/api/v1/service/disableservicecate/${id}`,
    //             {},
    //             { withCredentials: true, headers: { "Content-Type": "application/json" } }
    //         );
    //         toast.success("Thay đổi trạng thái thành công!");
    //         setServiceCateList((prevCategories) =>
    //             prevCategories.map((category) =>
    //                 category._id === id ? { ...category, isActive: !category.isActive } : category
    //             )
    //         );
    //     } catch (error) {
    //         console.error(error);
    //         toast.error(error.response?.data?.message || "Không thể cập nhật trạng thái dịch vụ");
    //     }
    // };
    

    const openModal = (type, category = null) => {
        setModalType(type);
        setSelectedCategory(category);
        setNewCategory({
            serviceCateName: category?.serviceCateName || "",
            descriptionservice: category?.descriptionservice || "",
            serviceCateImage: category?.serviceCateImage || [], // Đảm bảo là mảng
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
        setNewCategory({ serviceCateName: "", descriptionservice: "", serviceCateImage: [] });
    };

    const handleServiceCateImage = (e) => {
        const files = Array.from(e.target.files); // Lấy danh sách file
        setNewCategory((prev) => ({
            ...prev,
            serviceCateImage: [...prev.serviceCateImage, ...files],
        }));
    };

    const handleAddService = async () => {
        if (!newCategory.serviceCateName || !newCategory.descriptionservice) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("serviceCateName", newCategory.serviceCateName);
            formData.append("descriptionservice", newCategory.descriptionservice);
            newCategory.serviceCateImage.forEach((file) => {
                formData.append("serviceCateImage", file);
            });
            const { data } = await axios.post("http://localhost:4000/api/v1/service/createservicecate", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success(data.message);
            fetchServices();
            closeModal();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Không thể thêm loại dịch vụ");
        }
    };

    // const handleAddService = async () => {
    //     if (!newCategory.serviceCateName || !newCategory.descriptionservice) {
    //         toast.error("Vui lòng điền đầy đủ thông tin!");
    //         return;
    //     }
    //     try {
    //         const formData = new FormData();
    //         formData.append("serviceCateName", newCategory.serviceCateName);
    //         formData.append("descriptionservice", newCategory.descriptionservice);
    //         newCategory.serviceCateImage.forEach((file) => {
    //             formData.append("serviceCateImage", file);
    //         });
    //         const { data } = await axios.post("http://localhost:4000/api/v1/service/createservicecate", formData, {
    //             withCredentials: true,
    //             headers: { "Content-Type": "multipart/form-data" },
    //         });
    //         toast.success("Thêm loại dịch vụ thành công!");
    //         fetchServices();
    //         closeModal();
    //     } catch (error) {
    //         console.error(error);
    //         toast.error(error.response?.data?.message || "Không thể thêm loại dịch vụ");
    //     }
    // };

    const handleEditService = async () => {
        if (!newCategory.serviceCateName || !newCategory.descriptionservice) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("serviceCateName", newCategory.serviceCateName);
            formData.append("descriptionservice", newCategory.descriptionservice);
            newCategory.serviceCateImage.forEach((file) => {
                if (file instanceof File) formData.append("serviceCateImage", file); // Chỉ gửi ảnh mới
            });
            const { data } = await axios.put(
                `http://localhost:4000/api/v1/service/updateservicecate/${selectedCategory._id}`,
                formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            toast.success(data.message);
            fetchServices();
            closeModal();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Không thể cập nhật loại dịch vụ");
        }
    };

    // const handleEditService = async () => {
    //     if (!newCategory.serviceCateName || !newCategory.descriptionservice) {
    //         toast.error("Vui lòng điền đầy đủ thông tin!");
    //         return;
    //     }
    //     try {
    //         const formData = new FormData();
    //         formData.append("serviceCateName", newCategory.serviceCateName);
    //         formData.append("descriptionservice", newCategory.descriptionservice);
    //         newCategory.serviceCateImage.forEach((file) => {
    //             if (file instanceof File) formData.append("serviceCateImage", file);
    //         });
    //         const { data } = await axios.put(
    //             `http://localhost:4000/api/v1/service/updateservicecate/${selectedCategory._id}`,
    //             formData,
    //             {
    //                 withCredentials: true,
    //                 headers: { "Content-Type": "multipart/form-data" },
    //             }
    //         );
    //         toast.success("Cập nhật loại dịch vụ thành công!");
    //         fetchServices();
    //         closeModal();
    //     } catch (error) {
    //         console.error(error);
    //         toast.error(error.response?.data?.message || "Không thể cập nhật loại dịch vụ");
    //     }
    // };


    useEffect(() => {
        fetchServices();
    }, []);

    if (!isAuthenticated) {
        toast.info("Chưa đăng nhập");
        return <Navigate to={"/login"} />;
    }

    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="service-manager-content">
                <section className="page-services">
                    <h1 className="lato-bold">DANH SÁCH LOẠI DỊCH VỤ</h1>
                    <div className="add-type-service">
                        <button onClick={() => openModal("add")} className="btn-add-type-service lato-bold">Thêm Loại Dịch Vụ<span className="plus-icon">+</span></button>
                    </div>
                    {serviceCateList.length > 0 ? (
                        <div class="service-category-table-wrapper">
                            <table className="service-category-table">
                                <thead >
                                    <tr>
                                        <th className="lato-bold">Ảnh</th>
                                        <th className="lato-bold">Tên loại dịch vụ</th>
                                        <th className="lato-bold">Mô tả</th>
                                        <th className="lato-bold">Trạng thái</th>
                                        <th className="lato-bold">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serviceCateList.map((category) => (
                                        <tr key={category._id}>
                                            <td className="lato-regular">
                                                {category.serviceCateImage.length > 0 ? (
                                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                                        {category.serviceCateImage.map((image, index) => (
                                                            <img
                                                                key={index}
                                                                src={image.url || URL.createObjectURL(image)}
                                                                alt="Service"
                                                                style={{
                                                                    width: "100px",
                                                                    height: "80px",
                                                                    objectFit: "cover",
                                                                    borderRadius: "5px",
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    "Không có ảnh"
                                                )}
                                            </td>
                                            <td className="lato-regular">{category.serviceCateName}</td>
                                            <td className="lato-regular">{category.descriptionservice}</td>
                                            <td className="lato-regular">{category.isActive ? "Hoạt động" : "Ngừng hoạt động"}</td>
                                            <td className="lato-regular">
                                                <div className="icon-buttons-edit-delete">
                                                    <button onClick={() => toggleStatus(category._id)} className="btn-toggle">
                                                        {category.isActive ? (
                                                            <FaToggleOn size={24} color="green" />
                                                        ) : (
                                                            <FaToggleOff size={24} color="red" />
                                                        )}
                                                    </button>
                                                    <button onClick={() => openModal("edit", category)}>
                                                        <FaEdit className="icon-edit-delete" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <h1>Không có loại dịch vụ nào!</h1>
                    )}

                    <Modal isOpen={isModalOpen} onRequestClose={closeModal} ariaHideApp={false} className="modal-content-type" overlayClassName="modal-overlay-type">
                        {modalType === "add" || modalType === "edit" ? (
                            <div>
                                <button onClick={closeModal} className="close-icon-type">
                                    <FaTimes />
                                </button>
                                <h2 className="modal-title-type lato-bold">{modalType === "add" ? "Thêm Loại Dịch Vụ" : "Chỉnh Sửa Loại Dịch Vụ"}</h2>
                                <label className='label-text-type lato-bold'>Tên loại dịch vụ</label>
                                <input
                                    className="modal-input-type lato-regular"
                                    type="text"
                                    value={newCategory.serviceCateName}
                                    onChange={(e) => setNewCategory({ ...newCategory, serviceCateName: e.target.value })}
                                />
                                <label className='label-text-type lato-bold'>Mô tả</label>
                                <input
                                    className="modal-input-type lato-regular"
                                    type="text"
                                    value={newCategory.descriptionservice}
                                    onChange={(e) => setNewCategory({ ...newCategory, descriptionservice: e.target.value })}
                                />
                                <label className='label-text-type lato-bold'>Ảnh dịch vụ</label>
                                <input type="file" accept="image/*" multiple onChange={handleServiceCateImage} className="modal-input-type lato-regular"
                                />
                                <div className="image-preview">
                                    {newCategory.serviceCateImage.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image instanceof File ? URL.createObjectURL(image) : image.url}
                                            alt={`Preview ${index}`}
                                            className="preview-image"
                                        />
                                    ))}
                                </div>
                                <button onClick={modalType === "add" ? handleAddService : handleEditService}
                                    className="modal-submit-button-type"
                                >
                                    {modalType === "add" ? "Thêm" : "Lưu"}
                                </button>
                                {/* <button onClick={closeModal}>Hủy</button> */}
                            </div>
                        ) : null}
                    </Modal>
                </section>
            </div>
        </div>
    );
};

export default ServiceCategory;
