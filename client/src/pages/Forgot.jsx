import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkUrlPage, resetPasswordUser } from "../store/userSlice";
import { showAlert } from "../utils/helpers/swalUtils";
import "../styles/pages/forgot.css";

function Forgot() {
  useEffect(() => {
    document.title = "Khôi phục mật khẩu";
  }, []);

  const dispatch = useDispatch();
  const checkUrlPageStatus = useSelector(
    (state) => state.user.checkUrlPageStatus
  );
  const resetPasswordStatus = useSelector(
    (state) => state.user.resetPasswordStatus
  );
  const userResetPassword = useSelector(
    (state) => state.user.userResetPassword
  );
  const error = useSelector((state) => state.user.error);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [resetSubmitted, setResetSubmitted] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(checkUrlPage({ token }));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (checkUrlPageStatus === "succeeded") {
      setIsTokenValid(true);
    } else if (checkUrlPageStatus === "failed") {
      setIsTokenValid(false);
    }
  }, [checkUrlPageStatus, userResetPassword]);

  const [data, setData] = useState({
    password: "",
    passwordConfirm: "",
  });
  const handleChange = (e) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const id = userResetPassword._id;
    const { password, passwordConfirm } = data;
    if (!password || !passwordConfirm) {
      showAlert("Cảnh báo", "Vui lòng nhập đầy đủ thông tin", "warning");
    } else if (password !== passwordConfirm) {
      showAlert("Cảnh báo", "Mật khẩu không khớp", "warning");
    } else {
      dispatch(resetPasswordUser({ id, password }));
      setResetSubmitted(true);
    }
  };

  useEffect(() => {
    if (resetSubmitted) {
      if (resetPasswordStatus === "succeeded") {
        showAlert("Thành công", "Đặt lại mật khẩu thành công", "success", 1000);
        setResetSubmitted(false);
        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      } else if (resetPasswordStatus === "failed") {
        showAlert("Lỗi", error || "Đặt lại mật khẩu thất bại", "error");
      }
    }
  }, [resetPasswordStatus, error, resetSubmitted]);

  return (
    <>
      {isTokenValid ? (
        <div className="section section_forgot">
          <div className="subscribe">
            <p>Khôi phục mật khẩu</p>
            <div className="wrap-item">
              <input
                placeholder="Mật khẩu mới"
                className="subscribe-input"
                name="password"
                id="password"
                type="password"
                value={data.password}
                onChange={handleChange}
              />
              <input
                placeholder="Nhập lại mật khẩu mới"
                className="subscribe-input"
                name="passwordConfirm"
                id="passwordConfirm"
                type="password"
                value={data.passwordConfirm}
                onChange={handleChange}
              />
            </div>
            <div className="submit-btn" onClick={handleSubmit}>
              SUBMIT
            </div>
          </div>
        </div>
      ) : (
        <h2 className="notFound">
          Liên kết không hợp lệ hoặc đã hết hạn, vui lòng thử lại!
        </h2>
      )}
    </>
  );
}

export default Forgot;
