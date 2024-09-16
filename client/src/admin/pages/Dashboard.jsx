import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import DoughnutChart from "../chart/BarChart.jsx";
import LineChart from "../chart/LineChart.jsx";
import { fetchProducts } from "../../store/productSlice.js";
import { fetchCategories } from "../../store/categorySlice.js";
import { getAllOrdersAsync } from "../../store/orderSlice.js";
import { formatVNDPrice } from "../../utils/helpers/formatPrice.js";
function Dashboard() {
  const dispatch = useDispatch();
  const { products, status: statusProduct } = useSelector(
    (state) => state.product
  );
  const { categories, status: statusCategory } = useSelector(
    (state) => state.category
  );
  const { order, status: statusOrder } = useSelector((state) => state.order);

  useEffect(() => {
    if (statusProduct === "idle") {
      dispatch(fetchProducts());
    }

    if (statusCategory === "idle") {
      dispatch(fetchCategories());
    }

    if (statusOrder === "idle") {
      dispatch(getAllOrdersAsync());
    }
  }, [statusCategory, statusProduct, statusOrder, dispatch]);

  const currentMonth = new Date().getMonth() + 1;

  const currentYear = new Date().getFullYear();

  const totalEarnings = useMemo(() => {
    return order
      .filter((order) => {
        const [, month, year] = order.orderDate.split("-").map(Number);
        return (
          month === currentMonth && year === currentYear && order.status === 2
        );
      })
      .reduce((total, order) => {
        const orderTotal = order.items.reduce(
          (orderSum, item) => orderSum + item.price * item.quantity,
          0
        );
        return total + orderTotal;
      }, 0);
  }, [order, currentMonth, currentYear]);

  return (
    <div className="main">
      <div id="container-content">
        <div className="wrapper-top-dashboard">
          <div className="item items-prd">
            <div className="wrap-right">
              <div className="title-number">{products.length}</div>
              <div className="title-text">Sản phẩm</div>
            </div>
            <div className="title-icon">
              <i className="ri-product-hunt-line"></i>
            </div>
            <button className="watch-detail">
              <Link to="/admin/products">
                Chi tiết <i className="ri-arrow-right-circle-line"></i>
              </Link>
            </button>
          </div>
          <div className="item items-category">
            <div className="wrap-right">
              <div className="title-number">{categories.length}</div>
              <div className="title-text">Danh mục</div>
            </div>
            <div className="title-icon">
              <i className="ri-dashboard-fill"></i>
            </div>
            <button className="watch-detail">
              <Link to="/admin/category">
                Chi tiết <i className="ri-arrow-right-circle-line"></i>
              </Link>
            </button>
          </div>
          <div className="item items-sales">
            <div className="wrap-right">
              <div className="title-number">{order.length}</div>
              <div className="title-text">Đơn hàng</div>
            </div>
            <div className="title-icon">
              <i className="ri-shopping-cart-2-line"></i>
            </div>
            <button className="watch-detail">
              <Link to="/admin/orders">
                Chi tiết <i className="ri-arrow-right-circle-line"></i>
              </Link>
            </button>
          </div>
          <div className="item items-earning">
            <div className="wrap-right">
              <div className="title-number">
                {formatVNDPrice(totalEarnings)}
              </div>
              <div className="title-text">
                Doanh thu tháng {new Date().getMonth() + 1}
              </div>
            </div>
            <div className="title-icon">
              <i className="ri-money-dollar-box-line"></i>
            </div>
            <button className="watch-detail">
              <Link to="/admin/orders">
                Chi tiết <i className="ri-arrow-right-circle-line"></i>
              </Link>
            </button>
          </div>
        </div>
        <div className="graphBox">
          <div className="polarAreaChart">
            <DoughnutChart />
          </div>
          <div className="line-chart">
            <LineChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
