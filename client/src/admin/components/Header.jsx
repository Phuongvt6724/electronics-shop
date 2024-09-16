import { useEffect } from "react";
import { IMAGES_PATH } from "../../utils/constants/variablesImage";
function HeaderAdmin() {
  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        document.body.classList.add("scroll-down");
        document.body.classList.remove("scroll-up");
      } else {
        document.body.classList.add("scroll-up");
        document.body.classList.remove("scroll-down");
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="admin">
      <div className="main">
        <div className="topbar">
          <div className="toggle">
            <i className="ri-menu-line"></i>
          </div>
          <div className="search">
            <label>
              <input type="text" placeholder="Tìm kiếm" />
              <i className="ri-search-line"></i>
            </label>
          </div>
          <div className="mail">
            <i className="ri-mail-line"></i>
          </div>
          <div className="bell">
            <i className="ri-notification-line"></i>
          </div>
          <div className="user">
            <img src={`${IMAGES_PATH}avt-default.PNG`} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderAdmin;
