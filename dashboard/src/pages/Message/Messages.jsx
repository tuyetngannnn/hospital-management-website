import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import './Messages.css'

const Messages = () => {
  const [message, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/message/getall",
          { withCredentials: true }
        );
        setMessages(data.message);
      } catch (error) {
        toast.error("Lỗi khi tải tin nhắn");
      }
    };
    fetchMessages();
  }, []);

  if (!isAuthenticated) {
    toast.info("Chưa đăng nhập");
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page messages">
      <h1 className="title">Hộp Thư</h1>
      <div className="messages-container">
        {message && message.length > 0 ? (
          message.map((element) => (
            <div className="message-card" key={element._id}>
              <div className="message-header">
                <h2>{element.name}</h2>
                <span className="email">{element.email}</span>
              </div>
              <div className="message-body">
                <p><strong>Số điện thoại:</strong> {element.phone}</p>
                <p><strong>Tin nhắn:</strong> {element.message}</p>
              </div>
            </div>
          ))
        ) : (
          <h2 className="no-messages">Không có tin nhắn nào!</h2>
        )}
      </div>
    </section>
  );
};

export default Messages;