import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { increaseView } from "../store/productSlice";
import {
  fetchComments,
  selectCommentsByProduct,
  addComment,
} from "../store/commentSlice";
import { getProductById } from "../utils/api/productApi";
import Loader from "../components/loader";
import { showAlert } from "../utils/helpers/swalUtils";
import { addToCart } from "../store/cartSlice";
import { formatVNDPrice } from "../utils/helpers/formatPrice";
import "../styles/pages/detailProduct.css";
import { IMAGES_PATH } from "../utils/constants/variablesImage";
function DetailProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { status } = useSelector((state) => state.comment);
  const comments = useSelector((state) => selectCommentsByProduct(state, id));

  const ratingsCount = {
    1: comments.filter((comment) => comment.rating === 1).length,
    2: comments.filter((comment) => comment.rating === 2).length,
    3: comments.filter((comment) => comment.rating === 3).length,
    4: comments.filter((comment) => comment.rating === 4).length,
    5: comments.filter((comment) => comment.rating === 5).length,
  };

  const averageRating = comments.length
    ? Math.round(
        comments.reduce((total, comment) => total + comment.rating, 0) /
          comments.length
      )
    : 0;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bigImage, setBigImage] = useState(null);
  const [selectRating, setSelectRating] = useState(0);
  const [commentValue, setCommentValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [checkColor, setCheckColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleSubmitComment = () => {
    if (!user) {
      showAlert(
        "Cảnh báo!",
        "Vui lòng đăng nhập để đánh giá sản phẩm!",
        "warning"
      );
      return;
    }

    if (commentValue.trim() === "" || selectRating === 0) {
      showAlert("Cảnh báo!", "Vui lòng nhập nội dung đánh giá!", "warning");
      return;
    }

    const newComment = {
      productId: id,
      nameUser: user.firstName + " " + user.lastName,
      content: commentValue,
      rating: selectRating,
    };

    dispatch(addComment(newComment));
    setCommentValue("");
    setSelectRating(0);
    showAlert("Thành công", "Đánh giá của bạn đã được gửi!", "success");
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchComments());
    }
  }, [status, dispatch]);

  const handleSelectRating = (rating) => {
    setSelectRating(rating);
  };

  const increaseQuantity = () => {
    const productSelected = product.types.find(
      (item) => item.color === checkColor
    );

    const maxQuantity = productSelected.quantity;

    if (quantity < maxQuantity) {
      setQuantity((prev) => prev + 1);
    } else {
      showAlert(
        "Cảnh báo!",
        "Số lượng sản phẩm vượt quá số lượng trong kho!",
        "warning"
      );
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (user) {
      const productSelected = product.types.find(
        (item) => item.color === checkColor
      );
      const newItem = {
        _id: product._id,
        name: product.name,
        priceNow: product.priceNow,
        image: productSelected.image,
        brand: product.brand,
        priceOrigin: product.priceOrigin,
        color: checkColor,
        quantityStock: productSelected.quantity,
        quantity: quantity,
      };

      dispatch(addToCart(newItem));

      showAlert(
        "Thành công",
        " Sản phẩm đã được thêm vào giỏ hàng!",
        "success"
      );
    } else {
      showAlert("Cảnh báo!", "Vui lòng đăng nhập để mua hàng!", "warning");
    }
  };

  const handlePayNow = () => {
    if (user) {
      const productSelected = product.types.find(
        (item) => item.color === checkColor
      );
      const newItem = {
        _id: product._id,
        name: product.name,
        priceNow: product.priceNow,
        image: productSelected.image,
        brand: product.brand,
        priceOrigin: product.priceOrigin,
        color: checkColor,
        quantityStock: productSelected.quantity,
        quantity: quantity,
      };

      dispatch(addToCart(newItem));
      window.location.href = "/payment";
    } else {
      showAlert(
        "Cảnh báo!",
        "Vui lòng đăng nhập để mua hàng!",
        "warning",
        1500
      );
    }
  };

  const handleChangeColor = (name) => {
    setCheckColor(name);
    setQuantity(1);
  };

  const handleChangeBigImage = (image, index) => {
    setBigImage(image);
    setActiveIndex(index);
  };

  useEffect(() => {
    document.title = product && `${product.name}`;
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(id);
      dispatch(increaseView(id));
      setProduct(data);
      setCheckColor(data.types[0].color);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchProduct();
  }, [id, dispatch]);

  if (loading) {
    return (
      <div>
        <div className="container-loader">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="section section_detailProduct">
        <div className="container">
          <div className="breadcrumb">
            <div className="home-link">
              <i className="fa-solid fa-house"></i>
              <Link to="/">Trang chủ</Link>
            </div>
            <span>
              <i className="fa-solid fa-angles-right"></i>{" "}
            </span>
            Chi tiết sản phẩm
            <span>
              <i className="fa-solid fa-angles-right"></i>{" "}
            </span>
            <span>{product.name}</span>
          </div>
          <div className="box_detailProduct">
            <div className="detailProduct_left">
              <div className="wrapper_reviewSlide">
                <div className="bigImage">
                  <img
                    src={`${IMAGES_PATH}${
                      bigImage || (product && product.types[0].image)
                    }`}
                    alt=""
                  />
                </div>
                <div className="listImage">
                  {product.types.map((type, index) => (
                    <div
                      className={`wrapper ${
                        index === activeIndex ? "active" : ""
                      }`}
                      key={index}
                      onClick={() => handleChangeBigImage(type.image, index)}
                    >
                      <img src={`${IMAGES_PATH}${type.image}`} alt="" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="detailProduct_right">
              <h2>{product.name}</h2>
              <div className="price">
                <span>{formatVNDPrice(product.priceNow)}</span>
                <del>{formatVNDPrice(product.priceOrigin)}</del>
              </div>
              <div className="choose_color">
                <span className="title">
                  <i className="fa-solid fa-palette"></i> Màu sắc :
                </span>
                <div className="items">
                  {product.types.map((item, index) => (
                    <div
                      className={`item ${
                        checkColor === item.color ? "active" : ""
                      }`}
                      key={index}
                      onClick={() => handleChangeColor(item.color)}
                    >
                      <label htmlFor={`color` + index}>
                        <div className="wrap-image">
                          <img src={`${IMAGES_PATH}${item.image}`} alt="" />
                        </div>
                        <div className="info-item">
                          <div className="nameColor">{item.color}</div>
                          <div className="priceColor">
                            {formatVNDPrice(product.priceNow)}
                          </div>
                        </div>
                      </label>
                      <input
                        type="radio"
                        checked={checkColor === item.color}
                        id={`color` + index}
                        readOnly
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="choose_quantity">
                <span className="title">
                  <i className="fa-solid fa-plus-minus"></i> Số lượng :
                </span>
                <div className="quantity-area">
                  <button
                    onClick={decreaseQuantity}
                    disabled={product.types.find(
                      (item) => item.quantity === 0 && item.color === checkColor
                    )}
                  >
                    <i className="fa-solid fa-minus"></i>
                  </button>
                  <input
                    type="text"
                    value={
                      product.types.find((item) => item.color === checkColor)
                        .quantity === 0
                        ? 0
                        : quantity
                    }
                    readOnly
                  />
                  <button
                    onClick={increaseQuantity}
                    disabled={product.types.find(
                      (item) => item.quantity === 0 && item.color === checkColor
                    )}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
              <div className="actions-btn">
                {product.types.find((item) => item.color === checkColor)
                  .quantity === 0 ? (
                  <img src={`${IMAGES_PATH}sold_out.png`} alt="" />
                ) : (
                  <>
                    <button onClick={handleAddToCart}>
                      <i className="fa-solid fa-cart-plus"></i> Thêm vào giỏ
                      hàng
                    </button>
                    <button onClick={handlePayNow}>
                      <i className="fa-brands fa-cc-amazon-pay"></i>Mua ngay
                    </button>
                  </>
                )}
              </div>
              <div className="condition">
                <div className="condition-title">
                  <p>Thông tin sản phẩm</p>
                </div>
                <div className="condition-content">
                  <p>
                    Sản phẩm mới nguyên siêu của Apple, với thiết kế và chất
                    lượng hoàn hảo, đảm bảo đến từng chi tiết. Đây là sản phẩm
                    chính hãng, không chỉ mang đến sự tin cậy về hiệu suất mà
                    còn bảo đảm sự lâu bền và độ bền vững của thương hiệu. Sản
                    phẩm này đã được kiểm tra kỹ lưỡng để đảm bảo tính hoàn hảo
                    và sẵn sàng phục vụ nhu cầu của bạn một cách tối ưu nhất.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="product-comment">
            <div className="block-rate">
              <div className="block-rate_star">
                <span className="avg">
                  {averageRating}/5
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    fill="rgb(255, 202, 63)"
                    height="40px"
                    width="40px"
                  >
                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                  </svg>
                </span>
                <span>({comments.length} đánh giá và nhận xét)</span>
              </div>
              <div className="block-rate_chart">
                <ul className="chart">
                  {Object.entries(ratingsCount).map(([rating, count]) => (
                    <li className="item" key={rating}>
                      <div className="left">{rating} sao</div>
                      <div className="right">
                        <div className="progress">
                          <span
                            className="progress-bar"
                            style={{
                              width: `${(count / comments.length) * 100}%`,
                            }}
                          ></span>
                        </div>
                        <span className="number">{count} đánh giá</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="comments-list">
              {comments.length === 0 && <p>Chưa có đánh giá nào.</p>}
              {comments
                .reverse()
                .filter((comment) => comment.status === 1)
                .map((comment, index) => (
                  <div className="item" key={index}>
                    <div className="item_author">
                      <div className="left_author">
                        <div className="avatar">
                          <img src={`${IMAGES_PATH}avt-default.PNG`} alt="" />
                        </div>
                        <div className="name">{comment.nameUser}</div>
                        <span>{comment.date}</span>
                      </div>
                      <div className="rating">
                        <div className="rating-star">
                          {Array.from({ length: comment.rating }).map(
                            (_, index) => (
                              <i
                                key={index}
                                className="fa-solid fa-star"
                                style={{ color: "#FFD43B" }}
                              ></i>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="item-content">{comment.content}</div>
                  </div>
                ))}
            </div>
            <div className="comments-actions">
              <div className="comments-add__rate">
                <p className="bold">Đánh giá của bạn</p>
                <div className="rating_vote">
                  <svg
                    className={`svg-star ${selectRating === 1 ? "active" : ""}`}
                    id="star1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 576 512"
                    onClick={() => handleSelectRating(1)}
                  >
                    <path
                      stroke="#FFD43B"
                      strokeWidth="30"
                      fill="none"
                      d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                    />
                  </svg>
                  <svg
                    className={`svg-star ${selectRating === 2 ? "active" : ""}`}
                    id="star2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 576 512"
                    onClick={() => handleSelectRating(2)}
                  >
                    <path
                      stroke="#FFD43B"
                      strokeWidth="30"
                      fill="none"
                      d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                    />
                  </svg>
                  <svg
                    className={`svg-star ${selectRating === 3 ? "active" : ""}`}
                    id="star3"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 576 512"
                    onClick={() => handleSelectRating(3)}
                  >
                    <path
                      stroke="#FFD43B"
                      strokeWidth="30"
                      fill="none"
                      d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                    />
                  </svg>
                  <svg
                    className={`svg-star ${selectRating === 4 ? "active" : ""}`}
                    id="star4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 576 512"
                    onClick={() => handleSelectRating(4)}
                  >
                    <path
                      stroke="#FFD43B"
                      strokeWidth="30"
                      fill="none"
                      d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                    />
                  </svg>
                  <svg
                    className={`svg-star ${selectRating === 5 ? "active" : ""}`}
                    id="star5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 576 512"
                    onClick={() => handleSelectRating(5)}
                  >
                    <path
                      stroke="#FFD43B"
                      strokeWidth="30"
                      fill="none"
                      d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                    />
                  </svg>
                </div>
              </div>
              <div className="comments-add__form">
                <label htmlFor="comment">Nhận xét của bạn</label>
                <textarea
                  id="comment"
                  placeholder="Nhận xét của bạn..."
                  value={commentValue}
                  onChange={(e) => setCommentValue(e.target.value)}
                ></textarea>
                <button onClick={handleSubmitComment}>Gửi</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailProduct;
