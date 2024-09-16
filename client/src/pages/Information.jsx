import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { changePassword } from "../store/userSlice";
import { showAlert } from "../utils/helpers/swalUtils";
import "../styles/pages/information.css";
import { IMAGES_PATH } from "../utils/constants/variablesImage";
function Information() {
  useEffect(() => {
    document.title = "Thông tin cá nhân";
  }, []);

  const dispatch = useDispatch();
  const [showFormRestorePassword, setShowFormRestorePassword] = useState(false);
  const [submmitedChangePassword, setSubmmitedChangePassword] = useState(false);
  const [formChangePassword, setFormChangePassword] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChangeForm = (e) => {
    const { id, value } = e.target;
    setFormChangePassword((prev) => ({ ...prev, [id]: value }));
  };

  const { user } = useSelector((state) => state.user);
  const error = useSelector((state) => state.user.error);
  const changePasswordStatus = useSelector(
    (state) => state.user.changePasswordStatus
  );

  const handleChangePassword = (e, id) => {
    e.preventDefault();

    const { oldPassword, newPassword } = formChangePassword;

    dispatch(changePassword({ id, oldPassword, newPassword }));
    setSubmmitedChangePassword(true);
  };

  useEffect(() => {
    if (submmitedChangePassword) {
      if (changePasswordStatus === "succeeded") {
        showAlert("Thành công", "Đổi mật khẩu thành công!", "success", 1000);
        setTimeout(() => {
          setFormChangePassword({ oldPassword: "", newPassword: "" });
          setShowFormRestorePassword(false);
          document.body.style.overflow = "auto";
        }, 1200);
        setSubmmitedChangePassword(false);
      } else if (changePasswordStatus === "failed") {
        showAlert("Thất bại", error || "Đổi mật khẩu thất bại!", "error", 1000);
      }
    }
  }, [changePasswordStatus, submmitedChangePassword, error]);

  const handleShowFormRestorePassword = () => {
    setShowFormRestorePassword(!showFormRestorePassword);
    setFormChangePassword({ oldPassword: "", newPassword: "" });
    if (showFormRestorePassword) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  };

  return (
    <>
      <div className="section section_information">
        {user && user.method && user.method !== 2 && (
          <div
            className={`container_RestoreformPassword  ${
              showFormRestorePassword ? "active" : ""
            }`}
          >
            <form action="" className="form">
              <div
                className="close-form"
                onClick={handleShowFormRestorePassword}
              >
                <i className="fa-regular fa-circle-xmark"></i>
              </div>
              <h2>Đổi mật khẩu</h2>
              <input
                placeholder="Mật khẩu hiện tại"
                className="input"
                type="password"
                id="oldPassword"
                value={formChangePassword.oldPassword}
                onChange={handleChangeForm}
              />
              <input
                placeholder="Mật khẩu mới"
                className="input"
                type="password"
                id="newPassword"
                value={formChangePassword.newPassword}
                onChange={handleChangeForm}
              />
              <button onClick={(e) => handleChangePassword(e, user._id)}>
                Xác nhận
              </button>
            </form>
          </div>
        )}

        <div className="container">
          {user ? (
            <div className="container-infor">
              <div className="box-infor">
                <div className="title-infor">
                  <h1 className="SbCTde">Hồ sơ của tôi</h1>
                  <div className="zptdmA">
                    Quản lý thông tin hồ sơ để bảo mật tài khoản
                  </div>
                </div>
                <div className="infor-imagebox">
                  <div className="image">
                    <div
                      className="LoNm4g"
                      style={{
                        backgroundImage: `url(${IMAGES_PATH}/avt-default.PNG)`,
                      }}
                    ></div>
                  </div>

                  {/* <form method="post" encType="multipart/form-data">
                    <label className="file-upload">
                      Chọn ảnh
                      <input type="file" name="filename" className="upload" />
                    </label>
                  </form> */}
                </div>
                <div className="wrap-text">
                  <div className="item">
                    <span>Họ và tên: </span>
                    <input
                      className="document-infor infor-lastname"
                      value={user.firstName + " " + user.lastName}
                      disabled
                    />
                  </div>
                  
                  <div className="infor-email">
                    <span>Email: </span>
                    <input
                      className="document-infor"
                      value={user.email}
                      disabled
                    />
                  </div>
                  <div className="infor-phone">
                    <span>Phone: </span>
                    {user.phone ? (
                      <>
                        <input
                          className="document-infor"
                          value={user.phone}
                          disabled
                        />
                        <Link
                          to="/verifyOtp"
                          className="add_phone change-phone"
                        >
                          <i className="fa-solid fa-rotate"></i>
                        </Link>
                      </>
                    ) : (
                      <Link to="/verifyOtp" className="add_phone">
                        Thêm số điện thoại
                      </Link>
                    )}
                  </div>
                  {user.method && user.method !== 2 && (
                    <div className="infor-password">
                      <span>Password: </span>
                      <div className="item-bottom">
                        <input
                          type="password"
                          name="stored_password"
                          value="**************"
                          disabled
                        />
                        <button
                          className="button-changepassword"
                          onClick={handleShowFormRestorePassword}
                        >
                          Đổi mật khẩu
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <h2 className="notLogged">
              Bạn chưa đăng nhập, vui lòng đăng nhập để xem thông tin cá nhân!
            </h2>
          )}
        </div>
      </div>
    </>
  );
}

export default Information;
