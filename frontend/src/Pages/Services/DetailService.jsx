// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams hook from react-router-dom
import "./Services.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Banner from "../../components/Banner/Banner";
import BacktoTop from "../../components/BacktoTop/BacktoTop";
import SpecialOffer from "../../components/SpecialOffer/SpecialOffer";
import { assets } from "../../assets/assets";
const DetailServiceCates = () => {
  const [serviceCate, setServiceCate] = useState(null); // Changed to a single object, not an array
  const [services, setServices] = useState([]); // State for services
  const { id } = useParams(); // Getting the `id` from the URL params

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category details
        const responseCate = await axios.get(
          `http://localhost:4000/api/v1/service/getservicecate/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log(responseCate.data); // Debugging line to check the category response
        setServiceCate(responseCate.data.data); // Directly set the received category data

        // Fetch active services with their names and prices
        const responseServices = await axios.get(
          "http://localhost:4000/api/v1/service/getactiveservice",
          {
            withCredentials: true,
          }
        );
        console.log(responseServices.data);
        if (responseServices.data.success) {
          const activeServices = responseServices.data.data;
          setServices(activeServices); // Save the services to state
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load
  }, []);
  return (
    <div>
      <Navbar />
      <Banner image={assets.banner_detailservice} />
      {serviceCate ? (
        <div className="service-cate-detail">
          <h2 className="detail-service-tittle lato-bold">
            <span>
              Dịch vụ {serviceCate.serviceCateName} chất lượng tại Mountain View
              DENTAL CARE - Chăm Sóc Nụ Cười Của Bạn{" "}
            </span>
          </h2>
          <h3 className="detail-service-description lato-regular">
            {serviceCate.descriptionservice}
          </h3>
          <div className="detail-service-procedure ">
            <h2 className="lato-bold">
              Quy trình {serviceCate.serviceCateName}
            </h2>
            <div className="procedure-container">
              <ul className="step1">
                <img
                  src={assets.banner_detailservice}
                  alt="step1"
                  className="image-step"
                />
                <h3 className="lato-bold">
                  Bước 1:{" "}
                  <span className="lato-regular">Kiểm tra tổng quát</span>
                </h3>
              </ul>
              <ul className="step2">
                <img src={assets.step2} alt="step2" className="image-step" />
                <h3 className="lato-bold">
                  Bước 2:{" "}
                  <span className="lato-regular">
                    Chụp phim CT Cone Beam và làm các xét nghiệm
                  </span>
                </h3>
              </ul>
              <ul className="step3">
                <img src={assets.step3} alt="step3" className="image-step" />
                <h3 className="lato-bold">
                  Bước 3:{" "}
                  <span className="lato-regular">
                    {" "}
                    Tư vấn về tình trạng sức khỏe răng miệng, đưa ra các biện
                    pháp chăm sóc và điều trị phù hợp
                  </span>
                </h3>
              </ul>
            </div>
          </div>
          {/* Hiển thị danh sách dịch vụ */}
          <h2 className="detail-service-heading lato-bold">
            {" "}
            {serviceCate.serviceCateName}
          </h2>
          <div className="services-list">
            {services.length > 0 ? (
              <table className="service-table">
                <thead>
                  <tr>
                    <th className="name-services lato-bold">Tên dịch vụ</th>
                    <th className="price-services lato-bold">Giá dịch vụ</th>
                  </tr>
                </thead>
                <tbody>
                  {services
                    .filter(
                      (service) =>
                        service.serviceType?.serviceCateName ===
                        serviceCate.serviceCateName
                    ) // Lọc dịch vụ theo loại
                    .map((service) => (
                      <tr key={service._id}>
                        <td className="lato-regular">{service.serviceName}</td>
                        <td className="lato-regular">
                          {service.servicePrice
                            ? service.servicePrice.toLocaleString("vi-VN")
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p>Không có dịch vụ nào trong loại này.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <SpecialOffer />
      <BacktoTop />
      <Footer />
    </div>
  );
};

export default DetailServiceCates;
