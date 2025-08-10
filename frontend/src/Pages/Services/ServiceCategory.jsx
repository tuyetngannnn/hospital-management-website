// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import SpecialOffer from "../../components/SpecialOffer/SpecialOffer";
import Banner from "../../components/Banner/Banner";
import { assets } from "../../assets/assets";
import "./Services.css";
import BacktoTop from "../../components/BacktoTop/BacktoTop";
const ActiveServiceCates = () => {
  const [serviceCates, setServiceCates] = useState([]);

  // Lấy danh sách các loại dịch vụ đang hoạt động
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/service/getallservicecate",
          {
            withCredentials: true, // Gửi kèm cookie nếu cần
          }
        );
        // Lưu dữ liệu vào state
        if (response.data.success) {
          setServiceCates(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching active service categories:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="active-service-cates">
      <Navbar />
      <Banner image={assets.banner_service} />
      <h1 className="page-title lato-bold">DỊCH VỤ RĂNG HÀM MẶT</h1>
      <div className="service-cates-container">
        {/* Hiển thị danh sách loại dịch vụ */}
        {serviceCates.length > 0 ? (
          serviceCates.map((serviceCate) => (
            <div key={serviceCate._id} className="service-cate-card">
              {/* Hiển thị hình ảnh */}
              <div className="service-cate-image">
                {serviceCate.serviceCateImage?.[0]?.url && (
                  <img
                    src={serviceCate.serviceCateImage[0].url}
                    alt={serviceCate.serviceCateName}
                  />
                )}
              </div>
              <h2 className="service-cate-title lato-bold">
                {serviceCate.serviceCateName}
              </h2>
              {/* Hiển thị mô tả rút gọn */}
              <h3 className="service-cate-description lato-regular">
                {serviceCate.descriptionservice.length > 100
                  ? `${serviceCate.descriptionservice.substring(0, 100)}...`
                  : serviceCate.descriptionservice}
              </h3>
              {/* Nút xem thêm */}
              <Link
                to={`/detailservice/${serviceCate._id}`}
                className="see-more-link lato-bold"
              >
                Xem thêm
              </Link>
            </div>
          ))
        ) : (
          <p className="no-data-message">
            Không có danh mục dịch vụ hoạt động.
          </p>
        )}
      </div>
      <SpecialOffer />
      <BacktoTop />
      <Footer />
    </div>
  );
};

export default ActiveServiceCates;
