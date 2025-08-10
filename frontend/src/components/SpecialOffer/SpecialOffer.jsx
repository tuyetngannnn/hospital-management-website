import "./SpecialOffer.css";
import { assets } from "../../assets/assets.js";
import { useNavigate } from "react-router-dom";

const SpecialOffer = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/appointment"); // Chuyển hướng đến trang appointment
  };
  return (
    <div className="special-offer">
      <img
        src={assets.special_offer}
        className="special-offer__content"
        alt="Special Offer"
      />
      <ul className="special-offer__text">
        <h1 className="special-offer__title lato-bold">
          ƯU ĐÃI GIÁ TỐT NHẤT HÔM NAY
        </h1>
        <button
          className="special-offer__button lato-bold"
          onClick={handleClick}
        >
          Đặt lịch khám ngay
          <img
            src={assets.calendar_booking}
            className="calendar-booking"
            alt="calendar-booking"
          />
        </button>
      </ul>
    </div>
  );
};

export default SpecialOffer;
