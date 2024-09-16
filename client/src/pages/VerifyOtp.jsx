import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import OtpInput from "otp-input-react";
import toast, { Toaster } from "react-hot-toast";
import { updatePhoneUser } from "../store/userSlice";
import { auth } from "../utils/config/firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { CgSpinner } from "react-icons/cg";
import "../styles/pages/verifyOtp.css";
import "react-phone-input-2/lib/style.css";
import { IMAGES_PATH } from "../utils/constants/variablesImage";

function VerifyOtp() {
  const dispatch = useDispatch();
  const buttonRef = useRef(null);
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitedOtp, setSubmitedOtp] = useState(false);
  const { user, updatePhoneStatus } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {},
            "expired-callback": () => {},
          }
        );
      }

      return () => {
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }
      };
    }
  }, [user]);

  async function onSignup() {
    if (ph.length < 9) {
      toast.error("Vui lòng nhập đúng số điện thoại");
      return;
    }

    setLoading(true);

    buttonRef.current.disabled = true;

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    await signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOtp(true);
        toast.success("Gửi mã OTP thành công");
        buttonRef.current.disabled = false;
      })
      .catch((error) => {
        console.log("error", error);
        setLoading(false);
        buttonRef.current.disabled = false;
      });
  }

  function onOTPVerify() {
    setLoading(true);

    buttonRef.current.disabled = true;

    window.confirmationResult
      .confirm(otp)
      .then(async () => {
        setLoading(false);
        const formattedPhone = ph.replace(/^84/, "0");
        dispatch(updatePhoneUser({ id: user._id, phone: formattedPhone }));
        setSubmitedOtp(true);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Mã OTP không chính xác");
        buttonRef.current.disabled = false;
        setOtp("");
        setLoading(false);
      });
  }

  useEffect(() => {
    if (submitedOtp) {
      if (updatePhoneStatus === "succeeded") {
        toast.success("Cập nhật số điện thoại thành công");
        setSubmitedOtp(false);
        buttonRef.current.disabled = false;

        setTimeout(() => {
          window.location.href = "/information";
        }, 1000);
      }
    }
  }, [updatePhoneStatus, submitedOtp]);

  return (
    <>
      {user ? (
        <div>
          <div id="recaptcha-container"></div>
          <section className="container_otp">
            <Toaster
              toastOptions={{
                duration: 2000,
              }}
            />
            {showOtp ? (
              <div className="box_verify box_otp">
                <div className="card__border"></div>
                <div className="wrapper_image">
                  <img
                    src={`${IMAGES_PATH}otp-verification-5152137-4309037.webp`}
                    alt=""
                  />
                </div>
                <div className="right_content">
                  <h2>Nhập mã OTP</h2>
                  <span>
                    Chúng tôi đã gửi cho bạn mã truy cập qua xác minh số điện
                    thoại di động qua SMS
                  </span>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    otpType="number"
                    OTPLength={6}
                    disabled={false}
                    autoFocus
                    className="otpInput"
                  ></OtpInput>
                  <button ref={buttonRef} onClick={onOTPVerify}>
                    {loading && (
                      <CgSpinner size={20} className="spinLoad"></CgSpinner>
                    )}
                    Xác thực <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            ) : (
              <div className="box_verify">
                <div className="card__border"></div>
                <div className="wrapper_image">
                  <img
                    src={`${IMAGES_PATH}otp-verification-5152137-4309037.webp`}
                    alt=""
                  />
                </div>
                <div className="right_content">
                  <h2>Xác thực số điện thoại</h2>
                  <span>
                    Vui lòng nhập số điện thoại di động của bạn để xác minh
                  </span>
                  <PhoneInput
                    value={ph}
                    onChange={setPh}
                    country={"vn"}
                    className="phoneInput"
                  ></PhoneInput>
                  <button ref={buttonRef} onClick={onSignup}>
                    {loading && (
                      <CgSpinner size={20} className="spinLoad"></CgSpinner>
                    )}
                    Gửi OTP <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      ) : (
        <h2 className="notLogged">
          Bạn chưa đăng nhập, vui lòng đăng nhập để xem thông tin cá nhân!
        </h2>
      )}
    </>
  );
}

export default VerifyOtp;
