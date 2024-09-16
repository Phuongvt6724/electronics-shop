import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatVNDPrice } from "../utils/helpers/formatPrice";
import { removeFromCart, getTotalPrice } from "../store/cartSlice";
import { createOrderAsync, paymentVnpayAsync } from "../store/orderSlice";
import { showAlert } from "../utils/helpers/swalUtils";
import { formatDate } from "../utils/helpers/formatDate";
import { LoaderModel } from "../components/loader";
import { clearCart } from "../store/cartSlice";
import "../styles/pages/payment.css";
import { IMAGES_PATH } from "../utils/constants/variablesImage";

function Payment() {
  const dispatch = useDispatch();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [districtsSelected, setDistrictsSelected] = useState("");
  const [feeShip, setFeeShip] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [codeDiscount, setCodeDiscount] = useState("");
  const [address, setAddress] = useState([]);
  const status = useSelector((state) => state.order.status);
  const statusPaymentVnpay = useSelector(
    (state) => state.order.statusPaymentVnpay
  );
  const payment_url = useSelector((state) => state.order.payment_url);
  const totalPrice = useSelector(getTotalPrice);
  const error = useSelector((state) => state.order.error);
  const cart = useSelector((state) => state.cart.cart);
  const { user } = useSelector((state) => state.user);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentVnpay, setPaymentVnpay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [choosePayment, setChoosePayment] = useState(0);
  const [formPayment, setFormPayment] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleApllyDiscount = () => {
    if (codeDiscount === "APPLE12") {
      setDiscount(totalPrice * 0.12);
    } else if (codeDiscount === "APPLE20") {
      setDiscount(totalPrice * 0.2);
    } else {
      showAlert("Cảnh báo", "Mã giảm giá không hợp lệ.", "warning");
      return;
    }

    showAlert("Thông báo", "Áp dụng mã giảm giá thành công.", "success");
    setCodeDiscount("");
  };

  const getServiceId = async (to_district) => {
    const service = {
      shop_id: parseInt(5048497),
      from_district: parseInt(1461),
      to_district: parseInt(to_district),
    };

    return fetch(
      `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: "2355ce9f-0954-11ef-be92-2ad6ca7ca6ac",
        },
        body: JSON.stringify(service),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return data.data[0].service_id;
      });
  };

  useEffect(() => {
    fetch(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
      {
        headers: {
          token: "2355ce9f-0954-11ef-be92-2ad6ca7ca6ac",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setProvinces(data.data));
  }, []);

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    const selectedOption = e.target.options[e.target.selectedIndex];
    const provinceName = selectedOption.getAttribute("data-name");
    setAddress([]);
    setAddress((prev) => [...prev, provinceName]);
    setFeeShip(null);
    if (provinceId === "1") return setDistricts([]), setWards([]);
    setWards([]);
    fetch(
      `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
      {
        headers: {
          token: "2355ce9f-0954-11ef-be92-2ad6ca7ca6ac",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setDistricts(data.data));
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    const selectedOption = e.target.options[e.target.selectedIndex];
    const districtName = selectedOption.getAttribute("data-name");

    const newAddress = address.slice(0, 1);
    setAddress(newAddress);
    setFeeShip(null);

    setAddress((prev) => [...prev, districtName]);

    setDistrictsSelected(districtId);
    fetch(
      `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
      {
        headers: {
          token: "2355ce9f-0954-11ef-be92-2ad6ca7ca6ac",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setWards(data.data));
  };

  const handleWardChange = (e) => {
    const wardId = e.target.value;
    const selectedOption = e.target.options[e.target.selectedIndex];
    const wardName = selectedOption.getAttribute("data-name");

    if (wardName === "0") {
      const newAddress = address.slice(0, 2);
      setAddress(newAddress);
      setFeeShip(null);
      return;
    }
    setAddress((prev) => [...prev, wardName]);

    getServiceId(districtsSelected).then((serviceId) => {
      fetch(
        `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: "2355ce9f-0954-11ef-be92-2ad6ca7ca6ac",
          },
          body: JSON.stringify({
            service_id: parseInt(serviceId),
            service_type_id: null,
            shop_id: parseInt(5048497),
            from_district_id: parseInt(1461),
            from_ward_code: "21316",
            to_district_id: parseInt(districtsSelected),
            to_ward_code: wardId.toString(),
            insurance_value: 0,
            weight: parseInt(300),
            length: parseInt(10),
            width: parseInt(10),
            height: parseInt(10),
            coupon: null,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setFeeShip(data.data.service_fee);
        });
    });
  };

  useEffect(() => {
    if (user) {
      setFormPayment({
        name: user.firstName + " " + user.lastName,
        email: user.email,
        phone: user.phone || "",
        address: "",
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleChangeFormPayment = (e) => {
    const { id, value } = e.target;
    setFormPayment((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleRemoveFromCart = (id, color) => {
    dispatch(removeFromCart({ idNeedToRemove: id, ColorNeedToRemove: color }));
  };

  const handleSubmitPayment = () => {
    const { name, email, phone } = formPayment;

    if (!name || !email || !phone || address.length < 3) {
      showAlert("Cảnh báo", "Vui lòng điền đầy đủ thông tin.", "warning");
    } else {
      const addressString = address.reverse().join(", ");
      const itemArray = cart.map((item) => ({
        productId: item._id,
        productName: item.name,
        brand: item.brand,
        price: item.priceNow,
        quantity: item.quantity,
        color: item.color,
      }));

      const order = {
        ...formPayment,
        address: addressString,
        feeShip: parseInt(feeShip),
        discount: discount ? parseInt(discount) : 0,
        orderDate: formatDate(new Date()),
        idUser: user._id,
        items: itemArray,
      };

      if (choosePayment === 0) {
        dispatch(createOrderAsync(order));
        setPaymentSubmitted(true);
      } else {
        const orderWithVnpayDetails = {
          amount: feeShip
            ? discount
              ? totalPrice + feeShip - discount
              : totalPrice + feeShip
            : discount
            ? totalPrice - discount
            : totalPrice,
          bankCode: "NCB",
          language: "",
          newOrder: order,
        };
        dispatch(paymentVnpayAsync(orderWithVnpayDetails));
        setPaymentVnpay(true);
      }
    }
  };

  useEffect(() => {
    if (paymentSubmitted) {
      if (status === "succeeded") {
        showAlert(
          "Thành công",
          "Đặt hàng thành công. Cảm ơn bạn đã mua hàng.",
          "success"
        );
        setPaymentSubmitted(false);

        setTimeout(() => {
          setFormPayment({
            name: "",
            email: "",
            phone: "",
            address: "",
          });
          window.location.href = "/";
          dispatch(clearCart());
        }, 1000);
      } else if (status === "failed") {
        showAlert("Lỗi", error, "error");
        setPaymentSubmitted(false);
      } else if (status === "loading") {
        setLoadingButton(true);
      }
    }
    if (paymentVnpay) {
      if (statusPaymentVnpay === "succeeded") {
        setLoadingButton(false);

        window.location.href = payment_url;
      } else if (statusPaymentVnpay === "loading") {
        setLoadingButton(true);
      }
    }
  }, [
    paymentSubmitted,
    paymentVnpay,
    payment_url,
    status,
    statusPaymentVnpay,
    error,
    dispatch,
  ]);

  const handleChoosePayment = (index) => {
    setChoosePayment(index);
  };

  useEffect(() => {
    document.title = "Thanh toán";
  }, []);

  if (loading) {
    return (
      <div className="loaderPayment">
        <LoaderModel />
      </div>
    );
  }

  return (
    <div className="section section_payment">
      {user ? (
        <div className="container">
          {cart.length === 0 ? (
            <h1 className="notLogged">Không có sản phẩm nào trong giỏ.</h1>
          ) : (
            <div className="container_payment">
              <h1>
                <i className="fa-regular fa-credit-card"></i> Thanh toán
              </h1>
              <div className="box_payment">
                <div className="layout_content_payment">
                  <div className="option_method_payment">
                    <button
                      className={choosePayment === 0 ? "active" : ""}
                      onClick={() => handleChoosePayment(0)}
                    >
                      <span>
                        <i className="fa-solid fa-money-bill"></i> Thanh toán
                        tiền mặt
                      </span>
                      <span className="selected">
                        <i className="fa-solid fa-circle-check"></i>
                      </span>
                    </button>
                    <button
                      className={choosePayment === 1 ? "active" : ""}
                      onClick={() => handleChoosePayment(1)}
                    >
                      <span>
                        <i className="fa-brands fa-cc-paypal"></i> Thanh toán
                        VNPAY
                      </span>
                      <span className="selected">
                        <i className="fa-solid fa-circle-check"></i>
                      </span>
                    </button>
                  </div>

                  <div className="info_payment">
                    <div className="info">
                      <label htmlFor="name">Họ và tên:</label>
                      <input
                        type="text"
                        id="name"
                        placeholder="Nhập họ và tên"
                        value={formPayment.name}
                        onChange={handleChangeFormPayment}
                      />
                    </div>
                    <div className="info">
                      <label htmlFor="email">Email:</label>
                      <input
                        type="text"
                        id="email"
                        placeholder="Nhập email"
                        value={formPayment.email}
                        onChange={handleChangeFormPayment}
                      />
                    </div>
                    <div className="info">
                      <label htmlFor="phone">Số điện thoại</label>
                      <input
                        type="text"
                        id="phone"
                        placeholder="Nhập số điện thoại"
                        value={formPayment.phone}
                        onChange={handleChangeFormPayment}
                      />
                    </div>
                    <div className="info">
                      <label>Địa chỉ</label>
                      <div className="container-province">
                        <div className="section__content">
                          <select
                            id="province"
                            className="field__input"
                            onChange={handleProvinceChange}
                          >
                            <option value="1">Chọn Tỉnh</option>
                            {provinces.map((province) => (
                              <option
                                key={province.ProvinceID}
                                value={province.ProvinceID}
                                data-name={province.ProvinceName}
                              >
                                {province.ProvinceName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="section__content">
                          <select
                            id="district"
                            className="field__input"
                            onChange={handleDistrictChange}
                          >
                            <option value="1">Chọn Huyện</option>
                            {districts.map((district) => (
                              <option
                                key={district.DistrictID}
                                value={district.DistrictID}
                                data-name={district.DistrictName}
                              >
                                {district.DistrictName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="section__content">
                          <select
                            id="ward"
                            className="field__input"
                            onChange={handleWardChange}
                          >
                            <option value="1" data-name="0">
                              Chọn Xã
                            </option>
                            {wards.map((ward) => (
                              <option
                                key={ward.WardCode}
                                value={ward.WardCode}
                                data-name={ward.WardName}
                              >
                                {ward.WardName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className={`actions_payment ${
                      loadingButton ? "disabled" : ""
                    }`}
                    onClick={handleSubmitPayment}
                  >
                    {loadingButton ? <LoaderModel /> : "Thanh toán"}
                  </button>
                </div>
                <div className="layout_items_payment">
                  <div className="title">Sản phẩm đặt hàng</div>
                  <div className="box-items">
                    {cart.map((item, index) => (
                      <div className="item_payment" key={index}>
                        <div className="wrap_image">
                          <img src={`${IMAGES_PATH}${item.image}`} alt="" />
                        </div>
                        <div className="content_center">
                          <div className="name">{item.name}</div>
                          <div className="price">
                            {formatVNDPrice(item.priceNow)}
                          </div>
                          <div className="quantity">
                            Số lượng: {item.quantity}
                          </div>
                          <div className="color">Màu: {item.color}</div>
                        </div>
                        <div
                          className="action_remove_item"
                          onClick={() =>
                            handleRemoveFromCart(item._id, item.color)
                          }
                        >
                          <i className="fa-solid fa-trash"></i>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="discount">
                    <input
                      type="text"
                      placeholder="Nhập mã giảm giá nếu có"
                      value={codeDiscount}
                      onChange={(e) => setCodeDiscount(e.target.value)}
                    />
                    <button onClick={handleApllyDiscount}>Áp dụng</button>
                  </div>
                  <div className="total_last_payment">
                    <div className="total">
                      <div className="title">Tạm tính:</div>
                      <div className="price">{formatVNDPrice(totalPrice)}</div>
                    </div>
                    <div className="total">
                      <div className="title">Giảm giá:</div>
                      <div className="price">
                        {discount ? formatVNDPrice(discount) : "0 ₫"}
                      </div>
                    </div>
                    <div className="total">
                      <div className="title">Phí vận chuyển:</div>
                      <div className="price">
                        {feeShip ? formatVNDPrice(feeShip) : "Chưa bao gồm"}
                      </div>
                    </div>
                    <div className="total">
                      <div className="title">Tổng cộng:</div>
                      <div className="price">
                        {feeShip
                          ? discount
                            ? formatVNDPrice(totalPrice + feeShip - discount)
                            : formatVNDPrice(totalPrice + feeShip)
                          : discount
                          ? formatVNDPrice(totalPrice - discount)
                          : formatVNDPrice(totalPrice)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <h1 className="notLogged">
          Vui lòng đăng nhập để tiếp tục thanh toán.
        </h1>
      )}
    </div>
  );
}

export default Payment;
