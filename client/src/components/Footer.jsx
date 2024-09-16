import "../styles/components/footer.css";

import { IMAGES_PATH } from "../utils/constants/variablesImage";

function Footer() {
  return (
    <footer>
      <div className="container-footer">
        <div className="footer-about">
          <div className="footer__about__logo">
            <a href="index.html">
              <img src={`${IMAGES_PATH}logo.png`} alt="" />
            </a>
          </div>
          <ul>
            <li>Address: 128 Tân Trang, Tân Bình, TP.HCM</li>
            <li>Phone: +84 91.110.6542</li>
            <li>Email: phuongvtps31738@fpt.edu.vn</li>
          </ul>
        </div>
        <div className="footer-widget">
          <h6>Tiện ích</h6>
          <ul>
            <li>
              <a href="#">Về chúng tôi</a>
            </li>
            <li>
              <a href="#">Bảo mật mua hàng</a>
            </li>
            <li>
              <a href="#">Thông tin giao hàng</a>
            </li>
            <li>
              <a href="#">Thông tin liên hệ</a>
            </li>
            <li>
              <a href="#">Hướng dẫn sử dụng</a>
            </li>
            <li>
              <a href="#">Chính sách bảo mật</a>
            </li>
          </ul>
          <ul>
            <li>
              <a href="#">Dịch vụ</a>
            </li>
            <li>
              <a href="#">Sản phẩm</a>
            </li>
            <li>
              <a href="#">Đơn vị hợp tác</a>
            </li>
            <li>
              <a href="#">Liên hệ</a>
            </li>
            <li>
              <a href="#">Chứng nhận</a>
            </li>
            <li>
              <a href="#">Tin tức</a>
            </li>
          </ul>
        </div>
        <div className="footer-lastRigt">
          <h6>Tham gia bản tin của chúng tôi ngay bây giờ</h6>
          <p>
            Nhận thông tin cập nhật qua E-mail về sản phẩm mới nhất của chúng
            tôi và các ưu đãi đặc biệt.
          </p>
          <form action="#">
            <input type="text" placeholder="Nhập email đăng ký" />
            <button type="submit" className="site-btn">
              Đăng ký
            </button>
          </form>
          <div className="footer__widget__social">
            <a href="#">
              <i className="ri-facebook-fill"></i>
            </a>
            <a href="#">
              <i className="ri-instagram-line"></i>
            </a>
            <a href="#">
              <i className="ri-twitter-fill"></i>
            </a>
            <a href="#">
              <i className="ri-pinterest-fill"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="design-by">
        <p>
          Website designed by <strong>Vo Thanh Phuong</strong>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
