import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Product from "../../components/product";

function Pagination({ products, pageSize }) {
  const [fromIndex, setFromIndex] = useState(0);
  const [activePage, setActivePage] = useState(0);

  const toIndex = fromIndex + pageSize;
  const productsInPage = products.slice(fromIndex, toIndex);
  const totalPages = Math.ceil(products.length / pageSize);

  const changePage = (event) => {
    const newIndex = event.selected * pageSize;
    setFromIndex(newIndex);
    setActivePage(event.selected);
  };

  useEffect(() => {
    setFromIndex(0);
    setActivePage(0);
  }, [products, pageSize]);

  if (totalPages <= 1) {
    return (
      <div className="box-productsByCategory">
        {productsInPage.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="box-productsByCategory">
        {productsInPage.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
      <ReactPaginate
        nextLabel=""
        previousLabel=""
        pageCount={totalPages}
        pageRangeDisplayed={5}
        onPageChange={changePage}
        forcePage={activePage}
        className="pagination"
      />
    </>
  );
}

Pagination.propTypes = {
  products: PropTypes.array.isRequired,
  pageSize: PropTypes.number.isRequired,
};

export default Pagination;
