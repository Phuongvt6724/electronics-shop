import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import {
  fetchProducts,
  selectProductsByCategory,
  selectProductsBySearch,
} from "../store/productSlice";
import { fetchCategories } from "../store/categorySlice";
import Loader from "../components/loader";
import Pagination from "../utils/helpers/pagination";
import "../styles/pages/category.css";

function Category() {
  const [loading, setLoading] = useState(true);
  const { brandId, searchValue } = useParams();
  const dispatch = useDispatch();
  const productStatus = useSelector((state) => state.product.status);
  const productsAll = useSelector((state) => state.product.products);

  const products = useSelector((state) => {
    if (brandId !== undefined) {
      return parseInt(brandId) === 0
        ? productsAll
        : selectProductsByCategory(state, parseInt(brandId));
    } else if (searchValue !== undefined) {
      return selectProductsBySearch(state, searchValue);
    }
  });

  const { categories, status: categoryStatus } = useSelector(
    (state) => state.category
  );

  const [sortCriteria, setSortCriteria] = useState("default");
  const [activeButton, setActiveButton] = useState("");

  const handleSort = (criteria) => {
    setSortCriteria(criteria);
    setActiveButton(criteria);
  };

  useEffect(() => {
    if (categoryStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [categoryStatus, dispatch]);

  useEffect(() => {
    if (productStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [productStatus, dispatch]);

  useEffect(() => {
    document.title = "Danh mục sản phẩm";
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const sortedProducts = useMemo(() => {
    let sortedArray = [...products];
    if (sortCriteria === "priceHighToLow") {
      sortedArray.sort((a, b) => b.priceNow - a.priceNow);
    } else if (sortCriteria === "priceLowToHigh") {
      sortedArray.sort((a, b) => a.priceNow - b.priceNow);
    } else if (sortCriteria === "mostViewed") {
      sortedArray.sort((a, b) => b.views - a.views);
    }
    return sortedArray;
  }, [products, sortCriteria]);

  const getCategoryName = () => {
    if (parseInt(brandId) === 0) {
      return "Tất cả";
    }

    const category = categories.find(
      (cat) => cat.brandId === parseInt(brandId)
    );

    return category ? category.Name : "";
  };

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
      <div className="section section_categorys">
        <div className="container">
          <div className="breadcrumb">
            <div className="home-link">
              <i className="fa-solid fa-house"></i>
              <Link to="/">Trang chủ</Link>
            </div>
            <span>
              <i className="fa-solid fa-angles-right"></i>{" "}
            </span>
            {searchValue ? "Tìm kiếm" : "Danh mục"}
            <span>
              <i className="fa-solid fa-angles-right"></i>{" "}
            </span>
            <span>{searchValue ? searchValue : getCategoryName()}</span>
          </div>

          <h3>Sắp xếp theo</h3>
          <div className="actions-filter">
            <button
              onClick={() => handleSort("priceHighToLow")}
              className={activeButton === "priceHighToLow" ? "active" : ""}
            >
              <i className="fa-solid fa-arrow-down-wide-short"></i>
              Giá Cao - Thấp
            </button>
            <button
              onClick={() => handleSort("priceLowToHigh")}
              className={activeButton === "priceLowToHigh" ? "active" : ""}
            >
              <i className="fa-solid fa-arrow-down-short-wide"></i>
              Giá Thấp - Cao
            </button>
            <button
              onClick={() => handleSort("mostViewed")}
              className={activeButton === "mostViewed" ? "active" : ""}
            >
              <i className="fa-solid fa-eye"></i>
              Xem nhiều
            </button>
          </div>
          {sortedProducts.length === 0 && (
            <p className="empty">Không có sản phẩm nào được hiển thị !</p>
          )}

          <Pagination products={sortedProducts} pageSize={10} />
        </div>
      </div>
    </>
  );
}

export default Category;
