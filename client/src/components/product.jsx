import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { addToCart } from "../store/cartSlice";
import { formatVNDPrice } from "../utils/helpers/formatPrice";
import { showAlert } from "../utils/helpers/swalUtils";
import "../styles/components/product.css";
import { IMAGES_PATH } from "../utils/constants/variablesImage";

function Product({ product }) {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const handlePayNow = () => {
    if (!user) {
      showAlert("Thất bại", "Vui lòng đăng nhập để mua hàng", "error");
      return;
    }

    if (product.types[0].quantity === 0) {
      showAlert(
        "Thất bại",
        `Sản phẩm màu ${product.types[0].color} đã hết hàng, xem chi tiết để chọn màu khác`,
        "error"
      );
      return;
    }

    const newItem = {
      _id: product._id,
      name: product.name,
      priceNow: product.priceNow,
      image: product.types[0].image,
      brand: product.brand,
      priceOrigin: product.priceOrigin,
      color: product.types[0].color,
      quantityStock: product.types[0].quantity,
      quantity: 1,
    };

    dispatch(addToCart(newItem));
    window.location.href = "/payment";
  };

  const discountPercentage = Math.round(
    ((product.priceOrigin - product.priceNow) / product.priceOrigin) * 100
  );
  return (
    <div className="box-product">
      <div className="card_product">
        <div className="wrapper">
          <div className="discount_percent">
            <span>{`-${discountPercentage}%`}</span>
          </div>
          <img
            className="cover-image"
            src={`${IMAGES_PATH}${product.types[0].image}`}
          />
        </div>
        <div className="wrapper-actions">
          <button className="addToCart" onClick={handlePayNow}>
            Mua ngay <i className="fa-brands fa-cc-amazon-pay"></i>
          </button>
          <Link to={`/detailProduct/${product._id}`} className="payNow">
            <i className="fa-solid fa-eye"></i>
          </Link>
        </div>
        <img
          className="character"
          src={`${IMAGES_PATH}${product.types[0].image}`}
        />
      </div>
      <div className="title">
        <div className="name">{product.name}</div>
        <div className="price">
          {formatVNDPrice(product.priceNow)}{" "}
          <del>{formatVNDPrice(product.priceOrigin)}</del>
        </div>
      </div>
    </div>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.number.isRequired,
    priceNow: PropTypes.number.isRequired,
    priceOrigin: PropTypes.number.isRequired,
    types: PropTypes.array.isRequired,
  }).isRequired,
};

export default Product;
