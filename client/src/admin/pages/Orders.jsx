import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { getAllOrdersAsync, updateOrderAsync } from "../../store/orderSlice";
import { formatVNDPrice } from "../../utils/helpers/formatPrice";

function Orders() {
  const dispatch = useDispatch();
  const { order, status: statusGetAll } = useSelector((state) => state.order);
  const [showDetail, setShowDetail] = useState(false);
  const [orderById, setOrderById] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const offset = currentPage * itemsPerPage;
  const currentItems = order.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(order.length / itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  useEffect(() => {
    if (currentPage > 0 && currentItems.length === 0) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentItems.length, currentPage]);

  const handleShowDetail = (id) => {
    setShowDetail(!showDetail);

    const orderById = order.find((item) => item._id === id);

    setOrderById(orderById.items);
  };

  useEffect(() => {
    if (statusGetAll === "idle") {
      dispatch(getAllOrdersAsync());
    }
  }, [statusGetAll, dispatch]);

  return (
    <div className="main">
      <div id="container-content">
        <table className="table-listbrand table-listOrder">
          <thead>
            <tr>
              <th colSpan="10" className="th-title">
                <div className="wrap-title">
                  <h2>Danh sách đơn hàng</h2>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="tbody-data" id="wrap-dataOrder">
            <tr className="header-row">
              <th>STT</th>
              <th>Ngày đặt</th>
              <th>Thông tin</th>
              <th>Sản phẩm</th>
              <th>Giảm giá</th>
              <th>Phí vận chuyển</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
            {order.length > 0 &&
              currentItems
                .slice()
                .reverse()
                .map((item, index) => (
                  <tr className="bottom-row" key={index}>
                    <td>{index + 1 + offset}</td>
                    <td>{item.orderDate}</td>
                    <td className="wrap-info">
                      <strong>Tên: &nbsp; </strong>
                      <span> {item.name} </span>
                      <br />
                      <strong>Email: &nbsp;</strong>
                      <span> {item.email} </span>
                      <br />
                      <strong>SĐT: &nbsp;</strong>
                      <span>{item.phone}</span>
                    </td>
                    <td className="wrap-prd">
                      <button
                        className="order-detail"
                        onClick={() => handleShowDetail(item._id)}
                      >
                        Chi tiết <i className="ri-file-text-fill"></i>
                      </button>
                    </td>
                    <td>{formatVNDPrice(item.discount ? item.discount : 0)}</td>
                    <td>{formatVNDPrice(item.feeShip ? item.feeShip : 0)}</td>
                    <td>
                      {formatVNDPrice(
                        item.items.reduce(
                          (acc, cur) => {
                            return acc + cur.price * cur.quantity;
                          },
                          item.feeShip ? item.feeShip : 0
                        )
                      )}
                    </td>
                    <td>
                      <span
                        style={{ color: item.payment === 1 ? "blue" : "red" }}
                      >
                        {item.payment === 1 ? "Tiền mặt" : "VNPAY"}
                      </span>
                    </td>
                    <td>
                      <div
                        className={`wrap-status ${
                          item.status === 2 ? "active" : ""
                        }`}
                      >
                        {item.status === 1 ? "Đang xử lí" : "Đã giao hàng"}
                      </div>
                    </td>
                    <td>
                      <label className="plane-switch">
                        <input
                          type="checkbox"
                          checked={item.status === 2 ? true : false}
                          onChange={() =>
                            dispatch(
                              updateOrderAsync({
                                id: item._id,
                                status: item.status === 1 ? 2 : 1,
                              })
                            )
                          }
                        />
                        <div>
                          <div>
                            <svg viewBox="0 0 13 13">
                              <path
                                d="M1.55989957,5.41666667 L5.51582215,5.41666667 L4.47015462,0.108333333 L4.47015462,0.108333333 C4.47015462,0.0634601974 4.49708054,0.0249592654 4.5354546,0.00851337035 L4.57707145,0 L5.36229752,0 C5.43359776,0 5.50087375,0.028779451 5.55026392,0.0782711996 L5.59317877,0.134368264 L7.13659662,2.81558333 L8.29565964,2.81666667 C8.53185377,2.81666667 8.72332694,3.01067661 8.72332694,3.25 C8.72332694,3.48932339 8.53185377,3.68333333 8.29565964,3.68333333 L7.63589819,3.68225 L8.63450135,5.41666667 L11.9308317,5.41666667 C12.5213171,5.41666667 13,5.90169152 13,6.5 C13,7.09830848 12.5213171,7.58333333 11.9308317,7.58333333 L8.63450135,7.58333333 L7.63589819,9.31666667 L8.29565964,9.31666667 C8.53185377,9.31666667 8.72332694,9.51067661 8.72332694,9.75 C8.72332694,9.98932339 8.53185377,10.1833333 8.29565964,10.1833333 L7.13659662,10.1833333 L5.59317877,12.8656317 C5.55725264,12.9280353 5.49882018,12.9724157 5.43174295,12.9907056 L5.36229752,13 L4.57707145,13 L4.55610333,12.9978962 C4.51267695,12.9890959 4.48069792,12.9547924 4.47230803,12.9134397 L4.47223088,12.8704208 L5.51582215,7.58333333 L1.55989957,7.58333333 L0.891288881,8.55114605 C0.853775374,8.60544678 0.798421006,8.64327676 0.73629202,8.65879796 L0.672314689,8.66666667 L0.106844414,8.66666667 L0.0715243949,8.66058466 L0.0715243949,8.66058466 C0.0297243066,8.6457608 0.00275502199,8.60729104 0,8.5651586 L0.00593007386,8.52254537 L0.580855011,6.85813984 C0.64492547,6.67265611 0.6577034,6.47392717 0.619193545,6.28316421 L0.580694768,6.14191703 L0.00601851064,4.48064746 C0.00203480725,4.4691314 0,4.45701613 0,4.44481314 C0,4.39994001 0.0269259152,4.36143908 0.0652999725,4.34499318 L0.106916826,4.33647981 L0.672546853,4.33647981 C0.737865848,4.33647981 0.80011301,4.36066329 0.848265401,4.40322477 L0.89131128,4.45169723 L1.55989957,5.41666667 Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </div>
                          <span className="street-middle"></span>
                          <span className="cloud"></span>
                          <span className="cloud two"></span>
                        </div>
                      </label>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {pageCount > 1 && (
          <ReactPaginate
            previousLabel={""}
            nextLabel={""}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={1}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"selected"}
            forcePage={currentPage}
          />
        )}
        <div id="box-detailOrder" className={showDetail ? "active" : ""}>
          <table id="table-detailOrder">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Màu sắc</th>
                <th className="wrap-close">
                  Giá tiền / 1 sản phẩm
                  <span
                    id="close-detailOrder"
                    onClick={() => setShowDetail(!showDetail)}
                  >
                    <i className="ri-close-circle-fill"></i>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {orderById.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.color}</td>
                  <td>{formatVNDPrice(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;
