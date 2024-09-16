import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../styles/pages/cart.css";
import {
  getTotalPrice,
  getTotalQuantity,
  removeFromCart,
  changeQuantity,
} from "../store/cartSlice";
import { formatVNDPrice } from "../utils/helpers/formatPrice";
import { showAlert } from "../utils/helpers/swalUtils";
import { IMAGES_PATH } from "../utils/constants/variablesImage";
function Cart() {
  useEffect(() => {
    document.title = "Giỏ hàng";
  }, []);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart.cart);
  const totalPrice = useSelector(getTotalPrice);
  const totalQuantityCart = useSelector(getTotalQuantity);

  const handleRemoveFromCart = (id, color) => {
    dispatch(removeFromCart({ idNeedToRemove: id, ColorNeedToRemove: color }));
    showAlert("Thành công", "Xóa sản phẩm khỏi giỏ hàng thành công", "success");
  };

  const decreaseQuantity = (id, color, quantity) => {
    if (quantity <= 1) {
      return;
    }
    const newQuantity = quantity - 1;
    dispatch(changeQuantity({ id, color, quantity: newQuantity }));
  };

  const increaseQuantity = (id, color, quantity, maxQuantity) => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1;
      dispatch(changeQuantity({ id, color, quantity: newQuantity }));
    } else {
      showAlert("Cảnh báo", "Số lượng sản phẩm đã đạt tối đa", "warning");
    }
  };

  return (
    <>
      {user ? (
        <div className="section section_cart">
          <div className="container">
            <div className="breadcrumb">
              <div className="home-link">
                <i className="fa-solid fa-house"></i>
                <a href="/">Trang chủ</a>
              </div>
              <span>
                <i className="fa-solid fa-angles-right"></i>{" "}
              </span>
              Giỏ hàng
            </div>
            <div className="box_cart">
              <div className="left-pay">
                <div className="wrap-prdCart">
                  <div className="cart-title">
                    <h2>Giỏ hàng:</h2>
                    <span className="cart-count">
                      <span className="cart-counter">
                        {" "}
                        {totalQuantityCart}{" "}
                      </span>
                      <span className="cart-item-title">Sản phẩm</span>
                    </span>
                  </div>
                  <div className="section-cart"></div>
                  <div className="item-wrap" id="cart-page-result">
                    {cart.length === 0 && (
                      <h3 className="noProduct">
                        Không có sản phẩm nào trong giỏ hàng.
                      </h3>
                    )}
                    {cart.map((product, index) => (
                      <ul className="cart-wrap" key={index}>
                        <li className="item-info">
                          <div className="item-img">
                            <img src={`${IMAGES_PATH}${product.image}`} />
                          </div>
                          <div className="item-title">
                            <Link to={`/detailProduct/${product._id}`}>
                              {product.name}
                            </Link>
                            <div className="group-item-option">
                              <span className="item-option">
                                <span className="size">
                                  Màu sắc:{" "}
                                  <strong className="number-size">
                                    {product.color}
                                  </strong>
                                </span>
                              </span>
                              <span className="item-option">
                                <span className="item-price">
                                  <span className="money">
                                    {formatVNDPrice(product.priceNow)}
                                  </span>
                                  <del className="pricedel">
                                    {formatVNDPrice(product.priceOrigin)}
                                  </del>
                                </span>
                              </span>
                            </div>
                          </div>
                        </li>
                        <li className="item-qty">
                          <div className="quantity-area">
                            <input
                              type="button"
                              value="–"
                              id="minus"
                              className="qty-btn btn-minus"
                              min="1"
                              onClick={() =>
                                decreaseQuantity(
                                  product._id,
                                  product.color,
                                  product.quantity
                                )
                              }
                            />
                            <input
                              type="text"
                              value={product.quantity}
                              id="quantity"
                              className="quantity-selector"
                              disabled
                            />
                            <input
                              type="button"
                              value="+"
                              id="plus"
                              className="qty-btn btn-plus"
                              onClick={() =>
                                increaseQuantity(
                                  product._id,
                                  product.color,
                                  product.quantity,
                                  product.quantityStock
                                )
                              }
                            />
                          </div>
                          <div className="item-remove">
                            <span className="remove-wrap">
                              <button
                                onClick={() =>
                                  handleRemoveFromCart(
                                    product._id,
                                    product.color
                                  )
                                }
                              >
                                Xóa
                              </button>
                            </span>
                          </div>
                        </li>
                        <li className="item-price money_total">
                          <span className="amount full-price">
                            <span className="money">
                              {formatVNDPrice(
                                product.priceNow * product.quantity
                              )}
                            </span>
                          </span>
                        </li>
                      </ul>
                    ))}
                  </div>
                </div>
              </div>
              <div className="right-pay">
                <div className="wrap-content-pay">
                  <div className="sidebar-checkout">
                    <h4>Thông tin đơn hàng</h4>
                    <div className="order_total">
                      <p>
                        Tổng tiền:
                        <span className="total-price">
                          {formatVNDPrice(totalPrice)}
                        </span>
                      </p>
                    </div>
                    <div className="checkout-buttons">
                      <label htmlFor="note" className="note-label">
                        Ghi chú đơn hàng
                      </label>
                      <textarea
                        className="form-control"
                        id="note"
                        name="note"
                        rows="4"
                        placeholder="Ghi chú"
                      ></textarea>
                      <input
                        className="form-control"
                        id="code-discont"
                        placeholder="Nhập mã khuyến mãi (nếu có)"
                      />
                    </div>
                    <div className="order_action">
                      <Link
                        to="/payment"
                        className={`btncart-checkout ${
                          cart.length === 0 ? "disabled" : ""
                        }`}
                        name="checkout"
                        type="submit"
                      >
                        THANH TOÁN NGAY
                      </Link>
                      <Link to="/">
                        <i className="ri-reply-fill"></i> Tiếp tục mua hàng
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h2 className="notLogged">
          Bạn chưa đăng nhập, vui lòng đăng nhập để xem giỏ hàng!
        </h2>
      )}
    </>
  );
}

export default Cart;
