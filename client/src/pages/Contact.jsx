import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { LoaderModel } from "../components/loader";
import { showAlert } from "../utils/helpers/swalUtils";
import { sendContact } from "../utils/api/userApi";

import "../styles/pages/contact.css";

function Contact() {
  const user = useSelector((state) => state.user.user);
  const [valueForm, setValueForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValueForm({ ...valueForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = valueForm;
    if (!name || !email || !message) {
      showAlert("Cảnh báo", "Vui lòng nhập đầy đủ thông tin!", "warning");
      return;
    }

    setLoading(true);
    try {
      await sendContact(name, email, message);
      showAlert("Thành công", "Tin nhắn đã được gửi!", "success");
      setValueForm({ ...valueForm, message: "" });
    } catch (error) {
      showAlert("Lỗi", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Liên hệ";
  }, []);

  useEffect(() => {
    if (user) {
      setValueForm({
        name: user.firstName + " " + user.lastName,
        email: user.email,
        message: "",
      });
    }
  }, [user]);

  return (
    <>
      {user ? (
        <div className="form-card1 container_contact">
          <div className="form-card2">
            <form className="form">
              <p className="form-heading">Liên hệ</p>

              <div className="form-field">
                <input
                  name="name"
                  required=""
                  placeholder="Tên của bạn..."
                  className="input-field"
                  type="text"
                  value={valueForm.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <input
                  name="email"
                  required=""
                  placeholder="Email của bạn..."
                  className="input-field"
                  type="email"
                  value={valueForm.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <textarea
                  name="message"
                  required=""
                  placeholder="Nội dung..."
                  cols="30"
                  rows="3"
                  className="input-field"
                  value={valueForm.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button className="sendMessage-btn" onClick={handleSubmit}>
                {loading ? <LoaderModel /> : "Gửi tin nhắn"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <h1 className="notLogged">Vui lòng đăng nhập để liên hệ.</h1>
      )}
    </>
  );
}

export default Contact;
