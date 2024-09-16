import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { showLoginForm } from "../store/loginSlice";
import { shuffleArray } from "../utils/helpers/shuffleArray";
import Spline from "@splinetool/react-spline";
import Product from "../components/product";
import { fetchProducts, selectHotProducts } from "../store/productSlice";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast, { Toaster } from "react-hot-toast";
import Loader, { LoaderModel } from "../components/loader";
import "../styles/pages/home.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { IMAGES_PATH } from "../utils/constants/variablesImage";

function Home() {
  const dispatch = useDispatch();
  const productsHot = useSelector(selectHotProducts);
  const { user } = useSelector((state) => state.user);
  const { status: productStatus } = useSelector((state) => state.product);
  const [showLoader, setShowLoader] = useState(true);
  const [loaderModel, setLoaderModel] = useState(true);
  const [showModel, setShowModel] = useState(0);

  const shuffledProductsHot = useMemo(
    () => shuffleArray(productsHot),
    [productsHot]
  );

  const handleShowModel = (number) => {
    document.body.style.overflow = "hidden";
    setShowModel(number);
  };

  const handleHideModel = () => {
    document.body.style.overflow = "auto";
    setLoaderModel(true);
    setShowModel(0);
  };

  useEffect(() => {
    if (productStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [productStatus, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.style.overflow = "auto";
      setTimeout(() => {
        setShowLoader(false);
      }, 1000);
    }, 2000);

    return () => clearTimeout(timer);
  }, [showLoader]);

  useEffect(() => {
    document.title = "Phone Technology - TP";
  }, []);

  const handleShowLogin = () => {
    dispatch(showLoginForm());
  };

  if (showLoader) {
    document.body.style.overflow = "hidden";
  }

  return (
    <>
      <Toaster toastOptions={{ duration: 2000 }} />
      {showLoader && (
        <div className="container-loader">
          <Loader />
        </div>
      )}

      <div className={`model model_iphone ${showModel === 1 ? "active" : ""}`}>
        <div className="close_model" onClick={handleHideModel}>
          <i className="fa-solid fa-xmark"></i>
        </div>

        {showModel === 1 && loaderModel && <LoaderModel />}
        {showModel === 1 && (
          <Spline
            scene="https://prod.spline.design/g4eE3ijQcprQ7cCA/scene.splinecode"
            onLoad={() => setLoaderModel(false)}
          />
        )}
      </div>
      <div className={`model model_mac ${showModel === 2 ? "active" : ""}`}>
        <div className="close_model" onClick={handleHideModel}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        {showModel === 2 && loaderModel && <LoaderModel />}
        {showModel === 2 && (
          <Spline
            scene="https://prod.spline.design/g1iGL8X81HecF7qK/scene.splinecode"
            onLoad={() => setLoaderModel(false)}
          />
        )}
      </div>
      <div className={`model model_ipad ${showModel === 3 ? "active" : ""}`}>
        <div className="close_model" onClick={handleHideModel}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        {showModel === 3 && loaderModel && <LoaderModel />}
        {showModel === 3 && (
          <Spline
            scene="https://prod.spline.design/OKhpdCnWGgT8BCh9/scene.splinecode"
            onLoad={() => setLoaderModel(false)}
          />
        )}
      </div>
      <div className={`model model_watch ${showModel === 4 ? "active" : ""}`}>
        <div className="close_model" onClick={handleHideModel}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        {showModel === 4 && loaderModel && <LoaderModel />}
        {showModel === 4 && (
          <Spline
            scene="https://prod.spline.design/6Dzih-t1TKsyXY7r/scene.splinecode"
            onLoad={() => setLoaderModel(false)}
          />
        )}
      </div>
      <div className={`model model_airpods ${showModel === 5 ? "active" : ""}`}>
        <div className="close_model" onClick={handleHideModel}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        {showModel === 5 && loaderModel && <LoaderModel />}
        {showModel === 5 && (
          <Spline
            scene="https://prod.spline.design/2WmStjIBqS0dtaeT/scene.splinecode"
            onLoad={() => setLoaderModel(false)}
          />
        )}
      </div>
      <div className={`model model_logo ${showModel === 6 ? "active" : ""}`}>
        <div className="close_model" onClick={handleHideModel}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        {showModel === 6 && loaderModel && <LoaderModel />}
        {showModel === 6 && (
          <Spline
            scene="https://prod.spline.design/S1w9XbjVkjtTORsF/scene.splinecode"
            onLoad={() => setLoaderModel(false)}
          />
        )}
      </div>

      <section className="section section-hero-home">
        <div className="container">
          <div className="container-hero">
            <div className="hero-content">
              <h1 className="heading">Modern Technology</h1>
              <p className="paragraph">
                Chúng tôi cung cấp cho khách hàng các công cụ và phần mềm tiên
                tiến giúp họ tùy biến và cá nhân hóa điện thoại của mình một
                cách dễ dàng.
              </p>
              <div className="wrapper-actions">
                {user ? (
                  <div className="navbar-actions">
                    <div className="btn-bg"></div>
                    <Link to="/contact" className="btn-text">
                      Liên hệ hỗ trợ
                      <i className="fa-solid fa-arrow-right-long"></i>
                    </Link>
                  </div>
                ) : (
                  <div className="navbar-actions" onClick={handleShowLogin}>
                    <div className="btn-bg"></div>
                    <div className="btn-text">
                      Đăng ký ngay
                      <i className="fa-solid fa-arrow-right-long"></i>
                    </div>
                  </div>
                )}
                <Link to="/category/0" className="navbar-actions">
                  <div className="btn-bg"></div>
                  <div className="btn-text">Khám phá công nghệ</div>
                </Link>
              </div>
            </div>
            <div className="hero-media">
              <div className="lineWrap-image">
                <div className="wrapImage">
                  <img src={`${IMAGES_PATH}apple-products.jpg`} alt="" />
                </div>
                <div className="wrapImage">
                  <img src={`${IMAGES_PATH}thumbnail-1.jpg`} alt="" />
                </div>
                <div className="wrapImage">
                  <img src={`${IMAGES_PATH}thumbnail-2.webp`} alt="" />
                </div>
              </div>
              <div className="lineWrap-image">
                <div className="wrapImage">
                  <img src={`${IMAGES_PATH}thumbnail-3.jpeg`} alt="" />
                </div>
                <div className="wrapImage">
                  <img src={`${IMAGES_PATH}thumbnail-4.jpg`} alt="" />
                </div>
                <div className="wrapImage">
                  <img src={`${IMAGES_PATH}thumbnail-5.webp`} alt="" />
                </div>
              </div>
              <div className="lineWrap-image">
                <div className="wrapImage">
                  <img src={`${IMAGES_PATH}thumbnail-6.webp`} alt="" />
                </div>
                <div className="wrapImage">
                  <img src={`${IMAGES_PATH}thumbnail-7.webp`} alt="" />
                </div>
                <div className="wrapImage">
                  <img src={`${IMAGES_PATH}thumbnail-7.jpg`} alt="" />
                </div>
              </div>
            </div>
          </div>

          <div className="container_product_hot">
            <h3>
              Sản phẩm <span className="stroke">nổi bật</span>
            </h3>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={10}
              slidesPerView={5}
              loop={true}
              speed={500}
              navigation
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 4,
                },
                1440: {
                  slidesPerView: 5,
                },
              }}
            >
              {shuffledProductsHot.map((product) => (
                <SwiperSlide key={product._id}>
                  <Product product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="container_featured">
            <h3>
              Đánh dấu <span className="stroke">công nghệ</span>
            </h3>
            <div className="box_featured">
              <img src={`${IMAGES_PATH}featured1.jpg`} />
              <img src={`${IMAGES_PATH}featured3.jpg`} />
              <img src={`${IMAGES_PATH}featured2.jpg`} />
              <img src={`${IMAGES_PATH}featured4.jpg`} />
              <img src={`${IMAGES_PATH}featured5.jpg`} />
              <img src={`${IMAGES_PATH}featured6.jpg`} />
              <img src={`${IMAGES_PATH}featured7.jpg`} />
              <img src={`${IMAGES_PATH}featured8.png`} />
              <img src={`${IMAGES_PATH}featured9.jpg`} />
              <img src={`${IMAGES_PATH}featured10.jpg`} />
            </div>
          </div>

          <div className="container_product_hot">
            <h3>
              Mô hình trưng bày <span className="stroke">3D</span>
            </h3>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={5}
              loop={true}
              speed={500}
              navigation
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 4,
                },
                1440: {
                  slidesPerView: 5,
                },
              }}
            >
              <SwiperSlide>
                <div className="item_model" onClick={() => handleShowModel(1)}>
                  <div className="card-image">
                    <img src={`${IMAGES_PATH}mohinh-iphone.png`} alt="" />
                  </div>
                  <div className="name-model">iPhone</div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="item_model" onClick={() => handleShowModel(2)}>
                  <div className="card-image">
                    <img src={`${IMAGES_PATH}mohinh-mac.png`} alt="" />
                  </div>
                  <div className="name-model">Macbook</div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="item_model" onClick={() => handleShowModel(3)}>
                  <div className="card-image">
                    <img src={`${IMAGES_PATH}mohinh-ipad.png`} alt="" />
                  </div>
                  <div className="name-model">iPad</div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="item_model" onClick={() => handleShowModel(4)}>
                  <div className="card-image">
                    <img src={`${IMAGES_PATH}mohinh-watch.png`} alt="" />
                  </div>
                  <div className="name-model">Apple Watch</div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="item_model" onClick={() => handleShowModel(5)}>
                  <div className="card-image">
                    <img src={`${IMAGES_PATH}mohinh-airpods.png`} alt="" />
                  </div>
                  <div className="name-model">AirPods</div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="item_model" onClick={() => handleShowModel(6)}>
                  <div className="card-image">
                    <img src={`${IMAGES_PATH}mohinh-logo.png`} alt="" />
                  </div>
                  <div className="name-model">Apple Logo</div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          <div className="container_discount">
            <h3>
              Mã <span className="stroke">giảm giá</span>
            </h3>
            <div className="wrapper_discounts">
              <div className="box_discount">
                <div className="hYH08q">
                  <span>
                    <div className="wrapper_img">
                      <img src={`${IMAGES_PATH}apple.svg`} alt="" />
                    </div>
                    <div className="title_discount">Apple - Đồ điện tử</div>
                  </span>
                  <svg
                    width="200"
                    height="100%"
                    viewBox="0 0 106 106"
                    fill="none"
                  >
                    <path
                      clipRule="evenodd"
                      d="M0 2a2 2 0 0 1 2-2h106v106H2a2 2 0 0 1-2-2v-3a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 0 0 0-6V2Z"
                      fill="#a9ff5c"
                    ></path>
                    <path
                      clipRule="evenodd"
                      d="M.25 2.25a2 2 0 0 1 2-2M0 101.25a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m2.25 101a2 2 0 0 1-2-2"
                      stroke="#000"
                      opacity="0.15"
                      strokeWidth="1"
                    ></path>
                    <path
                      clipRule="evenodd"
                      d="M2 0.25h108m0 105.5H2m-1.75-1.75v-3m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6V2Z"
                      opacity="0.15"
                      stroke="#000"
                      strokeWidth="1.5"
                    ></path>
                    <path
                      d="M106 .5v105Z"
                      stroke="#000"
                      strokeOpacity="0.15"
                      strokeWidth="1.5"
                    ></path>
                  </svg>
                </div>
                <div className="content_discount">
                  <div className="title">
                    Mã ưu đãi giảm 12% cho mọi đơn hàng
                  </div>
                  <div className="apply_object">
                    Áp dụng cho tất cả đơn hàng
                  </div>
                  <div className="expired">
                    ƯU ĐÃI CÓ HIỆU LỰC ĐẾN NGÀY 29/4/2025 *
                  </div>
                  <CopyToClipboard
                    text="APPLE12"
                    onCopy={() => {
                      toast.success("Đã sao chép mã khuyến mãi");
                    }}
                  >
                    <button className="action">Sao chép mã</button>
                  </CopyToClipboard>
                </div>
              </div>
              <div className="box_discount">
                <div className="hYH08q">
                  <span>
                    <div className="wrapper_img">
                      <img src={`${IMAGES_PATH}apple.svg`} alt="" />
                    </div>
                    <div className="title_discount">Apple - Đồ điện tử</div>
                  </span>
                  <svg
                    width="200"
                    height="100%"
                    viewBox="0 0 106 106"
                    fill="none"
                  >
                    <path
                      clipRule="evenodd"
                      d="M0 2a2 2 0 0 1 2-2h106v106H2a2 2 0 0 1-2-2v-3a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 0 0 0-6V2Z"
                      fill="#a9ff5c"
                    ></path>
                    <path
                      clipRule="evenodd"
                      d="M.25 2.25a2 2 0 0 1 2-2M0 101.25a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m0-3.5a3 3 0 1 0 0-6.5m2.25 101a2 2 0 0 1-2-2"
                      stroke="#000"
                      opacity="0.15"
                      strokeWidth="1"
                    ></path>
                    <path
                      clipRule="evenodd"
                      d="M2 0.25h108m0 105.5H2m-1.75-1.75v-3m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6v-4m0-6V2Z"
                      opacity="0.15"
                      stroke="#000"
                      strokeWidth="1.5"
                    ></path>
                    <path
                      d="M106 .5v105Z"
                      stroke="#000"
                      strokeOpacity="0.15"
                      strokeWidth="1.5"
                    ></path>
                  </svg>
                </div>
                <div className="content_discount">
                  <div className="title">
                    Mã ưu đãi giảm 20% cho mọi đơn hàng
                  </div>
                  <div className="apply_object">
                    Áp dụng cho tất cả đơn hàng
                  </div>
                  <div className="expired">
                    ƯU ĐÃI CÓ HIỆU LỰC ĐẾN NGÀY 29/4/2025 *
                  </div>
                  <CopyToClipboard
                    text="APPLE20"
                    onCopy={() => {
                      toast.success("Đã sao chép mã khuyến mãi");
                    }}
                  >
                    <button className="action">Sao chép mã</button>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
          </div>
          <div className="loop-track">
            <div className="item item1">
              <img src={`${IMAGES_PATH}instagram.svg`} alt="" />
            </div>
            <div className="item item2">
              <img src={`${IMAGES_PATH}apple.svg`} alt="" />
            </div>
            <div className="item item3">
              <img src={`${IMAGES_PATH}netflix.svg`} alt="" />
            </div>
            <div className="item item4">
              <img src={`${IMAGES_PATH}nike.svg`} alt="" />
            </div>
            <div className="item item5">
              <img src={`${IMAGES_PATH}riot-games.svg`} alt="" />
            </div>
            <div className="item item6">
              <img src={`${IMAGES_PATH}rockstar.svg`} alt="" />
            </div>
            <div className="item item7">
              <img src={`${IMAGES_PATH}spotify.svg`} alt="" />
            </div>
            <div className="item item8">
              <img src={`${IMAGES_PATH}tiktok.svg`} alt="" />
            </div>
            <div className="item item9">
              <img src={`${IMAGES_PATH}telekom.svg`} alt="" />
            </div>
            <div className="item item10">
              <img src={`${IMAGES_PATH}american-express.svg`} alt="" />
            </div>
          </div>
          <div className="loop-track loop-track-2">
            <div className="item item1">
              <img src={`${IMAGES_PATH}levis.svg`} alt="" />
            </div>
            <div className="item item2">
              <img src={`${IMAGES_PATH}hulu.svg`} alt="" />
            </div>
            <div className="item item3">
              <img src={`${IMAGES_PATH}ford.svg`} alt="" />
            </div>
            <div className="item item4">
              <img src={`${IMAGES_PATH}hilton.svg`} alt="" />
            </div>
            <div className="item item5">
              <img src={`${IMAGES_PATH}warner-bros.svg`} alt="" />
            </div>
            <div className="item item6">
              <img src={`${IMAGES_PATH}toyota.svg`} alt="" />
            </div>
            <div className="item item7">
              <img src={`${IMAGES_PATH}coinbase.svg`} alt="" />
            </div>
            <div className="item item8">
              <img src={`${IMAGES_PATH}lexus.svg`} alt="" />
            </div>
            <div className="item item9">
              <img src={`${IMAGES_PATH}nfl.svg`} alt="" />
            </div>
            <div className="item item10">
              <img src={`${IMAGES_PATH}siedpa.svg`} alt="" />
            </div>
          </div>

          <div className="container_store">
            <h3>
              <span className="stroke">Cửa hàng</span> chúng tôi
            </h3>
            <div className="wrapper-store">
              <div className="thumb">
                <div className="box-img">
                  <img src={`${IMAGES_PATH}store1.jpg`} alt="" />
                </div>
                <div className="ribbon">
                  <div className="ribbon-loop">
                    Join us
                    <svg
                      width="21"
                      height="18"
                      viewBox="0 0 21 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.1022 7.75413C18.3339 7.60911 13.8575 6.00383 11.6599 0.533936L9.34011 1.46596C10.5042 4.36335 12.2262 6.38334 14.0036 7.74995H0V10.2499L14.0036 10.2499C12.2262 11.6166 10.5042 13.6365 9.34011 16.5339L11.6599 17.466C13.8575 11.9961 18.3339 10.3908 20.1022 10.2458L20.0512 8.99995L20.1022 7.75413Z"
                        fill="#0F0F0F"
                      ></path>
                    </svg>
                    Check in
                    <svg
                      width="21"
                      height="18"
                      viewBox="0 0 21 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.1022 7.75413C18.3339 7.60911 13.8575 6.00383 11.6599 0.533936L9.34011 1.46596C10.5042 4.36335 12.2262 6.38334 14.0036 7.74995H0V10.2499L14.0036 10.2499C12.2262 11.6166 10.5042 13.6365 9.34011 16.5339L11.6599 17.466C13.8575 11.9961 18.3339 10.3908 20.1022 10.2458L20.0512 8.99995L20.1022 7.75413Z"
                        fill="#0F0F0F"
                      ></path>
                    </svg>
                    Shopping
                    <svg
                      width="21"
                      height="18"
                      viewBox="0 0 21 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.1022 7.75413C18.3339 7.60911 13.8575 6.00383 11.6599 0.533936L9.34011 1.46596C10.5042 4.36335 12.2262 6.38334 14.0036 7.74995H0V10.2499L14.0036 10.2499C12.2262 11.6166 10.5042 13.6365 9.34011 16.5339L11.6599 17.466C13.8575 11.9961 18.3339 10.3908 20.1022 10.2458L20.0512 8.99995L20.1022 7.75413Z"
                        fill="#0F0F0F"
                      ></path>
                    </svg>
                    chain stores
                  </div>
                </div>
              </div>
              <div className="thumb thumb-2">
                <div className="box-img">
                  <img src={`${IMAGES_PATH}store2.jpg`} alt="" />
                </div>
                <div className="ribbon">
                  <div className="ribbon-loop">
                    Join us
                    <svg
                      width="21"
                      height="18"
                      viewBox="0 0 21 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.1022 7.75413C18.3339 7.60911 13.8575 6.00383 11.6599 0.533936L9.34011 1.46596C10.5042 4.36335 12.2262 6.38334 14.0036 7.74995H0V10.2499L14.0036 10.2499C12.2262 11.6166 10.5042 13.6365 9.34011 16.5339L11.6599 17.466C13.8575 11.9961 18.3339 10.3908 20.1022 10.2458L20.0512 8.99995L20.1022 7.75413Z"
                        fill="#0F0F0F"
                      ></path>
                    </svg>
                    Check in
                    <svg
                      width="21"
                      height="18"
                      viewBox="0 0 21 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.1022 7.75413C18.3339 7.60911 13.8575 6.00383 11.6599 0.533936L9.34011 1.46596C10.5042 4.36335 12.2262 6.38334 14.0036 7.74995H0V10.2499L14.0036 10.2499C12.2262 11.6166 10.5042 13.6365 9.34011 16.5339L11.6599 17.466C13.8575 11.9961 18.3339 10.3908 20.1022 10.2458L20.0512 8.99995L20.1022 7.75413Z"
                        fill="#0F0F0F"
                      ></path>
                    </svg>
                    Shopping
                    <svg
                      width="21"
                      height="18"
                      viewBox="0 0 21 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.1022 7.75413C18.3339 7.60911 13.8575 6.00383 11.6599 0.533936L9.34011 1.46596C10.5042 4.36335 12.2262 6.38334 14.0036 7.74995H0V10.2499L14.0036 10.2499C12.2262 11.6166 10.5042 13.6365 9.34011 16.5339L11.6599 17.466C13.8575 11.9961 18.3339 10.3908 20.1022 10.2458L20.0512 8.99995L20.1022 7.75413Z"
                        fill="#0F0F0F"
                      ></path>
                    </svg>
                    chain stores
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
