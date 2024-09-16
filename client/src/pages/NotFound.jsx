import { Link } from "react-router-dom";
import "../styles/pages/notFound.css";

function NotFound() {
  return (
    <div>
      <div className="wrapper-notfound">
        <h2>404</h2>
        <h1>Không tìm thấy nội dung 😓</h1>
        <ul>
          <li>URL của nội dung này đã bị thay đổi hoặc không còn tồn tại.</li>
          <li>
            Nếu bạn đang lưu URL này, hãy thử truy cập lại từ trang chủ thay vì
            dùng URL đã lưu.
          </li>
        </ul>
        <Link to="/">Truy cập trang chủ</Link>
      </div>
    </div>
  );
}

export default NotFound;
