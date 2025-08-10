import axios from "axios";
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Banner from "../../components/Banner/Banner";
import SpecialOffer from "../../components/SpecialOffer/SpecialOffer";
import { assets } from "../../assets/assets";
import "./Price.css";
import BacktoTop from "../../components/BacktoTop/BacktoTop";
const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [groupedServices, setGroupedServices] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(""); // Lưu loại dịch vụ đã chọn

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/service/getallservices",
          {
            withCredentials: true,
          }
        );
        const data = response.data;
        if (data.success) {
          const servicesData = data.data;
          setServices(servicesData);

          // Nhóm các dịch vụ theo loại (serviceType)
          const grouped = servicesData.reduce((acc, service) => {
            const type = service.serviceType?.serviceCateName || "Khác"; // Nếu không có loại, nhóm vào 'Khác'
            if (!acc[type]) {
              acc[type] = {
                services: [],
                images: service.serviceType?.serviceCateImage || [], // Lưu mảng hình ảnh
              };
            }
            acc[type].services.push(service);
            return acc;
          }, {});

          setGroupedServices(grouped); // Lưu nhóm dịch vụ vào state
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load
  }, []);
  return (
    <div>
      <Navbar />
      <Banner image={assets.bg} />
      <div className="service-list">
        <h1 className="price-service-tittle lato-bold">bảng giá dịch vụ </h1>
        <h3 className="service-review lato-regular">
          Sở hữu đội ngũ bác sĩ chuyên sâu dày dặn kinh nghiệm cùng cơ sở vật
          chất, trang thiết bị hiện đại, Mountain View tự tin mang đến cho khách
          hàng trải nghiệm chăm sóc sức khỏe nụ cười chất lượng cao với mức chi
          phí hợp lý nhất.
        </h3>
        {/* Dropdown để chọn loại dịch vụ */}
        <div className="filter-container">
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
          >
            <option value="">Tất cả</option>
            {Object.keys(groupedServices).map((serviceType) => (
              <option key={serviceType} value={serviceType}>
                {serviceType}
              </option>
            ))}
          </select>
        </div>

        {/* Hiển thị danh sách dịch vụ */}
        <div className="service-container">
          {/* Tiêu đề tổng */}
          <div className="service-type-header">
            <h2 className="grid-item-price lato-bold">Dịch vụ</h2>
            <h2 className="grid-item-price  lato-bold">chi phí (VNĐ)</h2>
          </div>

          {/* Nội dung nhóm dịch vụ */}
          {Object.keys(groupedServices)
            .filter(
              (serviceType) =>
                !selectedCategory || serviceType === selectedCategory
            )
            .map((serviceType) => (
              <div key={serviceType} className="service-group">
                {/* Tiêu đề nhóm dịch vụ */}
                <div className="service-grid">
                  <div className="grid-header">
                    <div className="lato-bold">{serviceType}</div>
                  </div>
                  {/* Hiển thị danh sách dịch vụ */}
                  {groupedServices[serviceType].services.map((service) => (
                    <div className="grid-row" key={service._id}>
                      <h3 className="grid-item-price lato-regular">
                        {service.serviceName}
                      </h3>
                      <h3 className="grid-item-price lato-regular">
                        {service.servicePrice
                          ? service.servicePrice.toLocaleString("vi-VN")
                          : "N/A"}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      <SpecialOffer />
      <BacktoTop />
      <Footer />
    </div>
  );
};

export default ServiceList;
