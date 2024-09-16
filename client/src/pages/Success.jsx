import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "../styles/pages/success.css";
import { clearCart } from "../store/cartSlice";

function Success() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
    console.log("clear cart");
  }, [dispatch]);

  return (
    <div className="container_success">
      <div className="card">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="card-inner">
          <i className="fa-regular fa-circle-check"></i>
          <div className="title-success">
            <h1>Cảm ơn bạn đã đặt hàng của bạn !</h1>
            <p>Đơn hàng của bạn sẽ được giao trong thời gian sớm nhất.</p>
            <Link to="/history">Xem đơn hàng</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success;
