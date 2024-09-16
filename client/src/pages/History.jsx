import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LoaderModel } from "../components/loader";
import { formatVNDPrice } from "../utils/helpers/formatPrice";
import "../styles/pages/history.css";
function History() {
  const [showDetail, setShowDetail] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);

  const handleViewDetail = (item) => {
    setShowDetail(true);
    document.body.style.overflow = "hidden";
    setDetailOrder(item);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    document.title = "Lịch sử mua hàng";
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="loaderPayment">
        <LoaderModel />
      </div>
    );
  }

  return (
    <>
      {user ? (
        <section className="section_history">
          <div className="container">
            <div className="container-history">
              <div className="breadcrumb">
                <div className="home-link">
                  <i className="fa-solid fa-house"></i>
                  <Link to="/">Trang chủ</Link>
                </div>
                <span>
                  <i className="fa-solid fa-angles-right"></i>{" "}
                </span>
                <span>Lịch sử mua hàng</span>
              </div>
              <div className="box-history">
                {user.orders && user.orders.length > 0 ? (
                  <>
                    <table className="table_main">
                      <thead>
                        <tr>
                          <th>Mã đơn hàng</th>
                          <th>Ngày đặt hàng</th>
                          <th>Trạng thái</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.orders
                          .slice()
                          .reverse()
                          .map((item, index) => (
                            <tr key={index}>
                              <td>{item._id}</td>
                              <td>{item.orderDate}</td>
                              <td className={item.status === 2 ? "active" : ""}>
                                {item.status === 1
                                  ? "Đang xử lí"
                                  : "Đã giao hàng"}
                              </td>
                              <td>
                                <div className="box-action">
                                  <button
                                    className="view-detail"
                                    onClick={() => handleViewDetail(item)}
                                  >
                                    Chi tiết
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <h1 className="notLogged">
                    Bạn chưa có đơn hàng nào. Hãy đặt hàng ngay!
                  </h1>
                )}
              </div>
            </div>
            <div
              id="overlay"
              className={showDetail ? "active" : ""}
              onClick={handleCloseDetail}
            ></div>
            <div className="detail-history">
              <div className={`box-detail ${showDetail ? "active" : ""}`}>
                <h1>Chi tiết đơn hàng</h1>
                {detailOrder && (
                  <>
                    <div className="infor-detailHistory">
                      <span>
                        <strong>Mã đơn hàng: </strong> {detailOrder._id}
                      </span>
                      <span>
                        <strong>Ngày đặt hàng: </strong> {detailOrder.orderDate}
                      </span>
                      <span>
                        <strong>Giảm giá: </strong>
                        {detailOrder.discount
                          ? formatVNDPrice(detailOrder.discount)
                          : formatVNDPrice(0)}
                      </span>
                      <span>
                        <strong>Phí vận chuyển: </strong>{" "}
                        {detailOrder.feeShip
                          ? formatVNDPrice(detailOrder.feeShip)
                          : formatVNDPrice(0)}
                      </span>
                      <span>
                        <strong>Trạng thái: </strong>
                        {detailOrder.status === 1
                          ? "Đang xử lí"
                          : "Đã giao hàng"}
                      </span>
                      <span>
                        <strong>Hình thức thanh toán: </strong>
                        {detailOrder.payment === 1
                          ? "Thanh toán tiền mặt"
                          : "Thanh toán VNPAY"}
                      </span>
                      <span>
                        <strong>Tên khách hàng: </strong> {detailOrder.name}
                      </span>
                      <span>
                        <strong>Email: </strong> {detailOrder.email}
                      </span>
                      <span>
                        <strong>Số điện thoại: </strong> {detailOrder.phone}
                      </span>
                      <span>
                        <strong>Địa chỉ: </strong> {detailOrder.address}
                      </span>
                    </div>
                    <table className="table_detail">
                      <thead>
                        <tr>
                          <th colSpan="7">Danh sách sản phẩm</th>
                        </tr>
                        <tr>
                          <th>STT</th>
                          <th>Tên sản phẩm</th>
                          <th>Màu sắc</th>
                          <th>Số lượng</th>
                          <th>Giá</th>
                          <th>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.productName}</td>
                            <td>{item.color}</td>
                            <td>{item.quantity}</td>
                            <td>{formatVNDPrice(item.price)}</td>
                            <td>
                              {formatVNDPrice(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="6">
                            <strong>Tổng tiền: </strong>
                            <span>
                              {formatVNDPrice(
                                detailOrder.items.reduce(
                                  (total, item) =>
                                    total + item.price * item.quantity,
                                  0
                                ) +
                                  (detailOrder.feeShip || 0) -
                                  (detailOrder.discount || 0)
                              )}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                )}

                <div className="box-action">
                  <button className="close-detail" onClick={handleCloseDetail}>
                    <i className="fa-solid fa-circle-xmark"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <h1 className="notLogged">Vui lòng đăng nhập để xem đơn hàng.</h1>
      )}
    </>
  );
}

export default History;
