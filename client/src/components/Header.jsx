import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormLogin from "./formLogin";
import { showLoginForm } from "../store/loginSlice";
import { fetchCategories } from "../store/categorySlice";
import { logout } from "../store/userSlice";
import { getTotalQuantity } from "../store/cartSlice";
import { formatVNDPrice } from "../utils/helpers/formatPrice";
import "../styles/components/header.css";
import { IMAGES_PATH } from "../utils/constants/variablesImage";

function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const totalQuantityCart = useSelector(getTotalQuantity);

  const handleSearch = (event) => {
    event.preventDefault();
    const currentSearchTerm = searchTerm.trim();
    if (currentSearchTerm) {
      navigate(`/search/${currentSearchTerm}`);
    }
    setShowSearch(false);
    setSearchTerm("");
  };

  const handleLogout = () => {
    window.location.href = "/";
    dispatch(logout());
  };

  const { categories, status: categoryStatus } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    if (categoryStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [categoryStatus, dispatch]);

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        document.body.classList.add("scroll-down");
        document.body.classList.remove("scroll-up");
        if (scrollTop > 100) {
          document.querySelector("header").classList.add("move-up");
        }
      } else {
        document.body.classList.add("scroll-up");
        document.body.classList.remove("scroll-down");
        document.querySelector("header").classList.remove("move-up");
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [showSearch, setShowSearch] = useState(false);
  const inputSearchRef = useRef(null);
  const [showNavbar, setShowNavbar] = useState(false);

  const handleShowSearch = () => {
    setShowSearch(true);
  };

  useEffect(() => {
    if (showSearch) {
      inputSearchRef.current.focus();
    }
  }, [showSearch]);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const handleCloseNavbar = () => {
    setShowNavbar(false);
  };

  const handleShowLogin = () => {
    handleCloseNavbar();
    dispatch(showLoginForm());
  };

  return (
    <>
      <header>
        <nav className="navbar">
          <div className="container">
            <div className="navbar-header">
              <Link to="/">
                <img src={`${IMAGES_PATH}logo.png`} alt="" />
              </Link>
              <div className="item_rightMB">
                <div className="box_search" onClick={handleShowSearch}>
                  <button>
                    <i className="fa-solid fa-search"></i>
                  </button>
                </div>
                <div className="navbar-toggler" onClick={handleShowNavbar}>
                  <i className="fa-solid fa-bars"></i>
                </div>
              </div>
            </div>
            <div className="navbar-menu">
              <ul className="navbar-nav">
                {categories.map((category) => (
                  <li
                    className={`nav-item ${
                      location.pathname === `/category/${category.brandId}`
                        ? "active"
                        : ""
                    }`}
                    key={category._id}
                  >
                    <Link to={`/category/${category.brandId}`}>
                      {category.Name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <form
              className={`inputSearch ${showSearch ? "active" : ""}`}
              onSubmit={handleSearch}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
                <g>
                  <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                </g>
              </svg>
              <input
                ref={inputSearchRef}
                className="input"
                type="search"
                placeholder="Search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </form>

            {user ? (
              <div className="logged">
                <div
                  className="box_search"
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <button>
                    <i className="fa-solid fa-search"></i>
                  </button>
                </div>
                <Link to="/cart" className="icon_cart">
                  <button>
                    <i className="fa-solid fa-cart-shopping"></i>
                    <div className="cart-number-badge">{totalQuantityCart}</div>
                  </button>
                </Link>
                <div className="popover_itemsCart">
                  <div className="box_items">
                    {cart.length > 0 ? (
                      <>
                        <span className="title_top">Sản phẩm mới thêm</span>
                        <div className="wrapper_items">
                          {cart.map((item, index) => (
                            <Link to={`/detailProduct/${item._id}`} key={index}>
                              <div className="wrap_image">
                                <img
                                  src={`${IMAGES_PATH}${item.image}`}
                                  alt=""
                                />
                              </div>
                              <div className="name">{item.name}</div>
                              <div className="price">
                                {formatVNDPrice(item.priceNow)}
                              </div>
                            </Link>
                          ))}
                        </div>

                        <div className="content_bottom">
                          <span>{totalQuantityCart} sản phẩm trong giỏ</span>
                          <Link to="/cart">Xem giỏ hàng</Link>
                        </div>
                      </>
                    ) : (
                      <div className="empty_cart">
                        Không có sản phẩm nào trong giỏ.
                      </div>
                    )}
                  </div>
                </div>
                <div className="box_actions_infomation">
                  <button className="wrap_imageDefault">
                    <img src={`${IMAGES_PATH}avt-default.PNG`} alt="" />
                  </button>
                  <div className="popover">
                    {user.role === 2 && <Link to="/admin">Trang quản lí</Link>}
                    <Link to="/information">Thông tin của bạn</Link>
                    <Link to="/history">Đơn hàng của bạn</Link>
                    <Link onClick={handleLogout}>Đăng xuất</Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="item_rightDT">
                  <div
                    className="box_search"
                    onClick={() => setShowSearch(!showSearch)}
                  >
                    <button>
                      <i className="fa-solid fa-search"></i>
                    </button>
                  </div>
                  <div className="navbar-actions" onClick={handleShowLogin}>
                    <div className="btn-bg"></div>
                    <div className="btn-text">Đăng nhập</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>

        <div className={`navbar-moblie ${showNavbar ? "active" : ""}`}>
          <div className="close-navbar" onClick={handleCloseNavbar}>
            <i className="fa-solid fa-xmark"></i>
          </div>
          <ul className="navbar-nav">
            {user && (
              <>
                <li>
                  <Link to="/cart" onClick={handleCloseNavbar}>
                    Giỏ hàng
                  </Link>
                </li>
                <li>
                  <Link to="/information" onClick={handleCloseNavbar}>
                    Thông tin của bạn
                  </Link>
                </li>
              </>
            )}

            {categories.map((category) => (
              <li
                className={`nav-item ${
                  location.pathname === `/category/${category.brandId}`
                    ? "active"
                    : ""
                }`}
                key={category._id}
              >
                <Link
                  to={`/category/${category.brandId}`}
                  onClick={handleCloseNavbar}
                >
                  {category.Name}
                </Link>
              </li>
            ))}
          </ul>

          {user ? (
            <div className="btn-text" onClick={handleLogout}>
              Đăng xuất
            </div>
          ) : (
            <div className="btn-text" onClick={handleShowLogin}>
              Đăng nhập
            </div>
          )}
        </div>
      </header>
      <div className="headerBlock"></div>
      <FormLogin />
    </>
  );
}

export default Header;
