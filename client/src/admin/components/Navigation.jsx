import { Link, useLocation } from "react-router-dom";
import "../../styles/admin/style.css";
import { IMAGES_PATH } from "../../utils/constants/variablesImage";
function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { path: "/admin/dashboard", icon: "ri-bar-chart-fill", title: "Thống kê" },
    {
      path: "/admin/category",
      icon: "ri-dashboard-fill",
      title: "Quản lí danh mục",
    },
    {
      path: "/admin/users",
      icon: "ri-shield-user-fill",
      title: "Quản lí khách hàng",
    },
    {
      path: "/admin/comment",
      icon: "ri-question-answer-line",
      title: "Quản lí bình luận",
    },
    {
      path: "/admin/products",
      icon: "ri-product-hunt-fill",
      title: "Quản lí sản phẩm",
    },
    { path: "/admin/orders", icon: "ri-truck-line", title: "Quản lí đơn hàng" },
  ];

  return (
    <div className="admin">
      <div className="navigation">
        <ul>
          <li className="wrapper-logoBrand">
            <div className="logo-brand">
              <img src={`${IMAGES_PATH}logo.png`} alt="" />
            </div>
          </li>
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={currentPath === item.path ? "hovered" : ""}
            >
              <Link to={item.path}>
                <span className="icon">
                  <i className={item.icon}></i>
                </span>
                <span className="title">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="back-Userpage">
          <Link to="/">
            <i className="ri-arrow-go-back-line"></i> Trang người dùng
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
