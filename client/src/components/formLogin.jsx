import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { hidenLoginForm } from "../store/loginSlice";
import { showAlert } from "../utils/helpers/swalUtils";
import {
  register,
  login,
  forgotPasswordUser,
  loginGoogle,
  loginFacebook,
} from "../store/userSlice";
import "../styles/components/formLogin.css";
import { IMAGES_PATH } from "../utils/constants/variablesImage";

function FormLogin() {
  const showLogin = useSelector((state) => state.login.showLogin);
  const loginGG = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      dispatch(loginGoogle(tokenResponse.access_token));
      setLoginSubmitted(true);
    },
  });

  const responseFacebook = (response) => {
    dispatch(loginFacebook(response.accessToken));
    setLoginSubmitted(true);
  };

  const dispatch = useDispatch();
  const registerStatus = useSelector((state) => state.user.registerStatus);
  const loginStatus = useSelector((state) => state.user.loginStatus);
  const forgotPasswordStatus = useSelector(
    (state) => state.user.forgotPasswordStatus
  );
  const error = useSelector((state) => state.user.error);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [formRegister, setFormRegister] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [emailRestore, setEmailRestore] = useState("");

  const [registerSubmitted, setRegisterSubmitted] = useState(false);
  const [loginSubmitted, setLoginSubmitted] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleShowForgot = () => {
    setShowForgot(!showForgot);
    setShowRegister(false);
  };

  const handleShowLogin = () => {
    setShowForgot(false);
    setShowRegister(false);
  };

  const handleChangeFormRegister = (e) => {
    const { id, value } = e.target;
    setFormRegister((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmitRegister = (e) => {
    e.preventDefault();
    dispatch(register(formRegister));
    setRegisterSubmitted(true);
  };

  useEffect(() => {
    if (registerSubmitted) {
      if (registerStatus === "succeeded") {
        showAlert("Thành công!", "Đăng ký thành công", "success", 1000);
        setFormRegister({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setRegisterSubmitted(false);
      } else if (registerStatus === "failed") {
        showAlert("Lỗi!", error || "Đăng ký thất bại", "error", 1000);
        setRegisterSubmitted(false);
      }
    }
  }, [registerStatus, error, registerSubmitted]);

  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });

  const handleChangeFormLogin = (e) => {
    const { id, value } = e.target;
    setFormLogin((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    dispatch(login(formLogin));
    setLoginSubmitted(true);
  };

  useEffect(() => {
    if (loginSubmitted) {
      if (loginStatus === "succeeded") {
        showAlert("Thành công!", "Đăng nhập thành công", "success", 1000);
        setFormLogin({
          email: "",
          password: "",
        });
        setLoginSubmitted(false);

        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      } else if (loginStatus === "failed") {
        showAlert("Lỗi!", error || "Đăng nhập thất bại", "error", 1000);
        setLoginSubmitted(false);
      }
    }
  }, [loginStatus, error, loginSubmitted]);

  const handleSubmitForgot = (e) => {
    e.preventDefault();
    if (!emailRestore) {
      return showAlert("Lỗi!", "Vui lòng nhập email khôi phục", "error", 1000);
    } else {
      dispatch(forgotPasswordUser(emailRestore));
      setForgotSubmitted(true);
    }
  };

  useEffect(() => {
    if (forgotSubmitted) {
      if (forgotPasswordStatus === "succeeded") {
        showAlert(
          "Thành công!",
          "Vui lòng kiểm tra email để khôi phục mật khẩu",
          "success",
          2000
        );
        setEmailRestore("");
        setForgotSubmitted(false);
      } else if (forgotPasswordStatus === "failed") {
        showAlert("Lỗi!", error || "Gửi yêu cầu thất bại", "error", 1000);
        setForgotSubmitted(false);
      }
    }
  }, [forgotPasswordStatus, error, forgotSubmitted]);

  const handleToggleRegister = () => {
    setShowRegister(!showRegister);
  };

  const onCloseLogin = () => {
    dispatch(hidenLoginForm());
  };

  return (
    <>
      <div
        className={`overlay ${showLogin ? "active" : ""}`}
        onClick={onCloseLogin}
      ></div>
      <div className={`container-login ${showLogin ? "active" : ""}`}>
        <div className="bg-magic"></div>
        <button className="close-login" onClick={onCloseLogin}>
          x
        </button>
        <div className="box-login">
          <div className="top-img">
            <img src={`${IMAGES_PATH}logo.png`} alt="" />
          </div>
          <h1>Đăng nhập</h1>
          <form action="">
            <div className="item">
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                placeholder="Nhập email "
                id="email"
                value={formLogin.email}
                onChange={handleChangeFormLogin}
              />
            </div>
            <div className="item">
              <label htmlFor="password">Mật khẩu:</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                id="password"
                value={formLogin.password}
                onChange={handleChangeFormLogin}
              />
            </div>
            <button type="submit" onClick={handleSubmitLogin}>
              Đăng nhập
            </button>
          </form>
          <div className="other-login">
            <div className="other loginFB" onClick={loginGG}>
              <img src={`${IMAGES_PATH}gg.svg`} alt="" />
              Đăng nhập với Google
            </div>
            <FacebookLogin
              appId="1047181090168347"
              autoLoad={false}
              fields="name,email,picture"
              callback={responseFacebook}
              cssClass="other loginFB"
              icon="fa-facebook"
              textButton="Đăng nhập với Facebook"
            />
          </div>

          <p>
            Bạn chưa có tài khoản?
            <button className="bottom-btn" onClick={handleToggleRegister}>
              Đăng ký
            </button>
          </p>
          <button className="forgotPW" onClick={handleShowForgot}>
            <p>Quên mật khẩu?</p>
          </button>
          <p className="rules">
            Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với
            điều khoản sử dụng của chúng tôi.
          </p>
        </div>
      </div>

      <div
        className={`container-login register  ${showLogin ? "active" : ""} ${
          showRegister ? "visible" : ""
        }`}
      >
        <div className="bg-magic"></div>
        <button className="close-login" onClick={onCloseLogin}>
          x
        </button>
        <div className="box-login">
          <div className="top-img">
            <img src={`${IMAGES_PATH}logo.png`} alt="" />
          </div>
          <h1>Đăng ký</h1>
          <form action="">
            <div className="item_top">
              <div className="item">
                <label htmlFor="firstName">Họ:</label>
                <input
                  type="text"
                  placeholder="Nhập họ "
                  id="firstName"
                  value={formRegister.firstName}
                  onChange={handleChangeFormRegister}
                />
              </div>
              <div className="item">
                <label htmlFor="lastName">Tên:</label>
                <input
                  type="text"
                  placeholder="Nhập tên "
                  id="lastName"
                  value={formRegister.lastName}
                  onChange={handleChangeFormRegister}
                />
              </div>
            </div>
            <div className="item">
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                placeholder="Nhập email "
                id="email"
                value={formRegister.email}
                onChange={handleChangeFormRegister}
              />
            </div>
            <div className="item_bottom">
              <div className="item">
                <label htmlFor="password">Mật khẩu:</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  id="password"
                  value={formRegister.password}
                  onChange={handleChangeFormRegister}
                />
              </div>
              <div className="item">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
                <input
                  type="password"
                  placeholder="Nhập xác nhận mật khẩu"
                  id="confirmPassword"
                  value={formRegister.confirmPassword}
                  onChange={handleChangeFormRegister}
                />
              </div>
            </div>
            <button type="submit" onClick={handleSubmitRegister}>
              Xác nhận
            </button>
          </form>
          <div className="other-login">
            <div className="other loginGG" onClick={loginGG}>
              <img src={`${IMAGES_PATH}gg.svg`} alt="" />
              Đăng nhập với Google
            </div>
            <FacebookLogin
              appId="1047181090168347"
              autoLoad={false}
              fields="name,email,picture"
              callback={responseFacebook}
              cssClass="other loginFB"
              icon="fa-facebook"
              textButton="Đăng nhập với Facebook"
            />
          </div>

          <p>
            Bạn đã có tài khoản?
            <button className="bottom-btn" onClick={handleToggleRegister}>
              Đăng nhập
            </button>
          </p>
          <button className="forgotPW" onClick={handleShowForgot}>
            <p>Quên mật khẩu?</p>
          </button>
          <p className="rules">
            Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với
            điều khoản sử dụng của chúng tôi.
          </p>
        </div>
      </div>

      <div
        className={`container-login forgot  ${showLogin ? "active" : ""} ${
          showForgot ? "activeForgot" : ""
        }`}
      >
        <div className="bg-magic"></div>
        <button className="close-login" onClick={onCloseLogin}>
          x
        </button>
        <div className="box-login">
          <div className="top-img">
            <img src={`${IMAGES_PATH}logo.png`} alt="" />
          </div>
          <h1>Khôi phục tài khoản</h1>
          <form action="">
            <div className="item">
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                placeholder="Nhập email khôi phục"
                id="email"
                value={emailRestore}
                onChange={(e) => setEmailRestore(e.target.value)}
              />
            </div>
            <button type="submit" onClick={handleSubmitForgot}>
              Xác nhận
            </button>
          </form>
          <p>
            Bạn đã nhớ mật khẩu?
            <button className="bottom-btn" onClick={handleShowLogin}>
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </>
  );
}

export default FormLogin;
