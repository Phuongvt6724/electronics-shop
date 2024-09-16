import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchCategories,
  addNewCategory,
  updateCategoryAsync,
  deleteCategoryAsync,
  changeOrderCategoryAsync,
} from "../../store/categorySlice";
import { fetchProducts } from "../../store/productSlice";
import {
  showAlert,
  showDeleteConfirmation,
} from "../../utils/helpers/swalUtils";
import ReactPaginate from "react-paginate";

function Category() {
  const dispatch = useDispatch();
  const {
    categories,
    status: categoryStatus,
    statusAdd,
    statusUpdate,
    error,
  } = useSelector((state) => state.category);
  const { products, status: productStatus } = useSelector(
    (state) => state.product
  );
  const [submittedChangeOrder, setSubmittedChangeOrder] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addSubmmited, setAddSubmmited] = useState(false);
  const [valueName, setValueName] = useState("");
  const [showFix, setShowFix] = useState(false);
  const [fixSubmmited, setFixSubmmited] = useState(false);
  const [valueFix, setValueFix] = useState({
    idfix: "",
    name: "",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;
  const offset = currentPage * itemsPerPage;
  const currentItems = categories.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(categories.length / itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleAddSubmit = () => {
    if (valueName === "") {
      showAlert("Thất bại", "Vui lòng nhập tên loại hàng", "error");
      return;
    }

    dispatch(addNewCategory({ Name: valueName }));
    setAddSubmmited(true);
  };

  useEffect(() => {
    if (currentPage > 0 && currentItems.length === 0) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentItems.length, currentPage]);

  const handleFixSubmit = () => {
    const { idfix, name } = valueFix;
    if (name === "") {
      showAlert("Thất bại", "Vui lòng nhập tên loại hàng", "error");
      return;
    }
    dispatch(
      updateCategoryAsync({
        id: idfix,
        category: { Name: valueFix.name },
      })
    );
    setFixSubmmited(true);
  };

  const handleShowFix = (id) => {
    setShowFix(!showFix);

    const categoryFix = categories.find((category) => category._id === id);

    setValueFix({
      idfix: id,
      name: categoryFix.Name,
    });
  };

  const removeCategory = (id, name) => {
    showDeleteConfirmation(
      "Bạn có chắc chắn?",
      `Bạn thực sự muốn xóa danh mục ${name} không?`,
      "warning",
      "Đồng ý, xóa nó!",
      "Hủy bỏ",
      () => {
        dispatch(deleteCategoryAsync(id));
      }
    );
  };

  useEffect(() => {
    if (fixSubmmited) {
      if (statusUpdate === "succeeded") {
        showAlert("Thành công", "Sửa loại hàng thành công", "success");
        setShowFix(false);
        setFixSubmmited(false);
        setValueFix({ idfix: "", name: "" });
      } else if (statusUpdate === "failed") {
        showAlert("Thất bại", error || "Sửa loại hàng thất bại", "error");
      }
    }
  }, [fixSubmmited, statusUpdate, error]);

  useEffect(() => {
    if (addSubmmited) {
      if (statusAdd === "succeeded") {
        showAlert("Thành công", "Thêm loại hàng thành công", "success");
        setShowAdd(false);
        setAddSubmmited(false);
        setValueName("");
      } else if (statusAdd === "failed") {
        showAlert("Thất bại", error || "Thêm loại hàng thất bại", "error");
      }
    }
  }, [addSubmmited, statusAdd, error]);

  const handleSubmitChangeOrder = (id, direction) => {
    dispatch(changeOrderCategoryAsync({ id, direction }));
    setSubmittedChangeOrder(true);
  };

  useEffect(() => {
    if (submittedChangeOrder) {
      if (categoryStatus === "succeeded") {
        showAlert("Thành công", "Thay đổi vị trí thành công", "success");
        setSubmittedChangeOrder(false);
      } else if (categoryStatus === "failed") {
        showAlert("Thất bại", error || "Thay đổi vị trí thất bại", "error");
      }
    }
  }, [submittedChangeOrder, categoryStatus, error]);

  useEffect(() => {
    if (categoryStatus === "idle") {
      dispatch(fetchCategories());
    }
    if (productStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [categoryStatus, productStatus, dispatch]);

  const productCountByCategory = categories.reduce((acc, category) => {
    acc[category.brandId] = products.filter(
      (product) => product.brand === category.brandId
    ).length;
    return acc;
  }, {});

  return (
    <div className="admin">
      <div className="main">
        <div id="container-content">
          <table className="table-listbrand">
            <thead>
              <tr>
                <th colSpan="5" className="th-title">
                  <div className="wrap-title">
                    <h2>Danh sách loại hàng</h2>
                    <button
                      id="btn-addbrand"
                      onClick={() => setShowAdd(!showAdd)}
                    >
                      Thêm mới
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="tbody-data" id="wrap-dataCategory">
              <tr className="header-row">
                <th>STT</th>
                <th>Tên danh mục</th>
                <th>Số lượng</th>
                <th>Thay đổi vị trí</th>
                <th>Thao tác</th>
              </tr>
              {currentItems.map((category, index) => (
                <tr className="bottom-row" key={index}>
                  <td>{index + 1 + offset}</td>
                  <td>{category.Name}</td>
                  <td>
                    <strong style={{ color: "#0055ff" }}>
                      {productCountByCategory[category.brandId] || 0}
                    </strong>{" "}
                    sản phẩm
                  </td>
                  <td>
                    <div className="wrap-btn-updown">
                      <button
                        className="btn-up"
                        onClick={() =>
                          handleSubmitChangeOrder(category._id, "up")
                        }
                      >
                        <i className="fa-solid fa-arrow-up"></i>
                      </button>
                      <button
                        className="btn-down"
                        onClick={() =>
                          handleSubmitChangeOrder(category._id, "down")
                        }
                      >
                        <i className="fa-solid fa-arrow-down"></i>
                      </button>
                    </div>
                  </td>
                  <td className="btn-action">
                    <button
                      className="brand-fix"
                      onClick={() => handleShowFix(category._id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="brand-remove"
                      onClick={() =>
                        removeCategory(category._id, category.Name)
                      }
                    >
                      Xóa
                    </button>
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
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              activeClassName={"selected"}
              forcePage={currentPage}
            />
          )}
          <div
            className={`box-add ${showAdd ? "active" : ""}`}
            id="box-addBrand"
          >
            <span id="close-add" onClick={() => setShowAdd(!showAdd)}>
              <i className="ri-close-circle-line"></i>
            </span>
            <h2>Thêm danh mục</h2>
            <label htmlFor="nameBrand">Tên loại:</label>
            <input
              type="text"
              id="nameBrand"
              placeholder="Tên loại"
              value={valueName}
              onChange={(e) => setValueName(e.target.value)}
            />
            <button id="submit-add" onClick={handleAddSubmit}>
              Xác nhận
            </button>
          </div>

          <div className={`box-add ${showFix ? "active" : ""}`} id="box-Fix">
            <span id="close-fix" onClick={() => setShowFix(!showFix)}>
              <i className="ri-close-circle-line"></i>
            </span>
            <h2>Sửa danh mục</h2>
            <label htmlFor="nameBrand">Tên loại:</label>
            <input
              type="text"
              id="nameBrand"
              placeholder="Tên loại"
              value={valueFix.name}
              onChange={(e) =>
                setValueFix({ ...valueFix, name: e.target.value })
              }
            />
            <button id="submit-add" onClick={handleFixSubmit}>
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category;
