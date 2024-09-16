import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import {
  fetchProducts,
  addNewProduct,
  updateProductAsync,
  deleteProductAsync,
} from "../../store/productSlice";
import { fetchCategories } from "../../store/categorySlice";
import { formatVNDPrice } from "../../utils/helpers/formatPrice";
import {
  showAlert,
  showDeleteConfirmation,
} from "../../utils/helpers/swalUtils";
import { IMAGES_PATH } from "../../utils/constants/variablesImage";
import ReactPaginate from "react-paginate";

function Products() {
  const dispatch = useDispatch();
  const {
    products,
    status: productStatus,
    addStatus,
    fixStatus,
    error,
  } = useSelector((state) => state.product);

  const { categories, status: categoryStatus } = useSelector(
    (state) => state.category
  );

  const [showDetailColor, setShowDetailColor] = useState(false);
  const [addSubmmited, setAddSubmmited] = useState(false);
  const [fixSubmmited, setFixSubmmited] = useState(false);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [filterCategory, setFilterCategory] = useState(0);
  const [filterStatus, setFilterStatus] = useState(1);
  const [dataColor, setDataColor] = useState([]);
  const [colors, setColors] = useState([
    { name: "", quantity: 1, imageSrc: "", imageName: "" },
  ]);
  const [colorsFix, setColorsFix] = useState([]);
  const [valuesAdd, setValuesAdd] = useState({
    name: "",
    brand: 1,
    priceNow: "",
    priceOrigin: "",
  });
  const [valueFix, setValueFix] = useState({
    idfix: "",
    name: "",
    brand: "",
    priceNow: "",
    priceOrigin: "",
    status: "",
  });

  const handleChangeFilterCategory = (e) => {
    setFilterCategory(e.target.value);
  };

  const filteredProducts = useMemo(() => {
    if (parseInt(filterCategory) !== 0) {
      return products.filter(
        (product) =>
          product.brand === parseInt(filterCategory) &&
          product.status === parseInt(filterStatus)
      );
    }
    return products.filter(
      (product) => product.status === parseInt(filterStatus)
    );
  }, [filterCategory, products, filterStatus]);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredProducts.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  useEffect(() => {
    if (currentPage > 0 && currentItems.length === 0) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentItems.length, currentPage]);

  const handleShowFix = (id) => {
    setShowFormEdit(true);

    const productFix = products.find((product) => product._id === id);

    setValueFix({
      idfix: id,
      name: productFix.name,
      brand: productFix.brand,
      priceNow: productFix.priceNow,
      priceOrigin: productFix.priceOrigin,
      status: productFix.status,
    });

    const colors = productFix.types.map((type) => ({
      ...type,
      imageSrc: null,
    }));

    setColorsFix(colors);
  };

  const handleChangeValueFix = (e) => {
    let value = e.target.value;
    if (
      e.target.name === "brand" ||
      e.target.name === "priceNow" ||
      e.target.name === "priceOrigin" ||
      e.target.name === "status"
    ) {
      value = parseInt(value);
    }
    setValueFix({ ...valueFix, [e.target.name]: value });
  };

  const handleChangesValue = (e) => {
    let value = e.target.value;
    if (
      e.target.name === "brand" ||
      e.target.name === "priceNow" ||
      e.target.name === "priceOrigin"
    ) {
      value = parseInt(value);
    }
    setValuesAdd({ ...valuesAdd, [e.target.name]: value });
  };

  const handleShowDetailColor = (id) => {
    setShowDetailColor(true);

    const product = products.find((product) => product._id === id);
    setDataColor(product);
  };

  const handleFileChange = (index, event, form) => {
    const fileSelected = event.target.files;
    if (fileSelected && fileSelected.length > 0) {
      const fileToLoad = fileSelected[0];
      const fileReader = new FileReader();
      fileReader.onload = function (fileLoaderEvent) {
        const srcData = fileLoaderEvent.target?.result;
        if (srcData) {
          if (form === "fix") {
            const newColors = [...colorsFix];
            newColors[index].imageSrc = srcData.toString();
            newColors[index].image = fileToLoad.name;
            setColorsFix(newColors);
          } else {
            const newColors = [...colors];
            newColors[index].imageSrc = srcData.toString();
            newColors[index].imageName = fileToLoad.name;
            setColors(newColors);
          }
        }
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  };

  const handleAddColor = () => {
    setColors([
      ...colors,
      { name: "", quantity: 1, imageSrc: "", imageName: "" },
    ]);
  };

  const handleAddColorFix = () => {
    setColorsFix([
      ...colorsFix,
      { name: "", quantity: 1, imageSrc: "", imageName: "" },
    ]);
  };

  const handleColorChange = (index, field, value) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    setColors(newColors);
  };

  const handleColorChangeFix = (index, field, value) => {
    const newColors = [...colorsFix];
    newColors[index][field] = value;
    setColorsFix(newColors);
  };

  const handleAddSubmit = () => {
    const { name, brand, priceNow, priceOrigin } = valuesAdd;

    const types = colors
      .filter((color) => color.name && color.imageName && color.quantity)
      .map((color) => ({
        color: color.name,
        image: color.imageName,
        quantity: color.quantity,
      }));

    if (
      !name ||
      !brand ||
      !priceNow ||
      !priceOrigin ||
      types.length !== colors.length
    ) {
      showAlert("Thất bại", "Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    const data = {
      name,
      brand,
      priceNow,
      priceOrigin,
      types,
    };

    dispatch(addNewProduct(data));
    setAddSubmmited(true);
  };

  const handleFixSubmit = () => {
    const { idfix, name, brand, priceNow, priceOrigin, status } = valueFix;
    const types = colorsFix
      .filter(
        (color) => color.color && color.image && color.quantity !== undefined
      )
      .map((color) => ({
        color: color.color,
        image: color.image,
        quantity: color.quantity,
      }));

    if (
      !name ||
      !brand ||
      !priceNow ||
      !priceOrigin ||
      types.length !== colorsFix.length
    ) {
      showAlert("Thất bại", "Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    const data = {
      name,
      brand,
      priceNow,
      priceOrigin,
      types,
      status,
    };

    dispatch(updateProductAsync({ id: idfix, data: { ...data } }));
    setFixSubmmited(true);
  };

  useEffect(() => {
    if (addSubmmited) {
      if (addStatus === "succeeded") {
        showAlert("Thành công", "Thêm sản phẩm thành công", "success");
        setValuesAdd({
          name: "",
          brand: 1,
          priceNow: "",
          priceOrigin: "",
        });
        setShowFormAdd(false);
        setAddSubmmited(false);
        setColors([{ name: "", quantity: 1, imageSrc: "", imageName: "" }]);
      } else if (addStatus === "failed") {
        showAlert("Thất bại", error, "error");
      }
    }
  }, [addSubmmited, addStatus, error, dispatch]);

  useEffect(() => {
    if (fixSubmmited) {
      if (fixStatus === "succeeded") {
        showAlert("Thành công", "Cập nhật sản phẩm thành công", "success");
        setValueFix({
          idfix: "",
          name: "",
          brand: "",
          priceNow: "",
          priceOrigin: "",
        });
        setShowFormEdit(false);
        setFixSubmmited(false);
        setColorsFix([]);
      } else if (fixStatus === "failed") {
        showAlert("Thất bại", error, "error");
      }
    }
  }, [fixSubmmited, fixStatus, error, dispatch]);

  const removeProduct = (id, name) => {
    showDeleteConfirmation(
      "Bạn có chắc chắn?",
      `Bạn thực sự muốn xóa sản phẩm ${name} không?`,
      "warning",
      "Đồng ý, xóa nó!",
      "Hủy bỏ",
      () => {
        dispatch(deleteProductAsync(id));
      }
    );
  };

  useEffect(() => {
    if (productStatus === "idle") {
      dispatch(fetchProducts());
    }

    if (categoryStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [productStatus, categoryStatus, dispatch]);

  const brandNames = categories.reduce((acc, category) => {
    acc[category.brandId] = category.Name;
    return acc;
  }, {});

  return (
    <div className="main">
      <div id="container-content" className="container_products">
        <table className="table-listbrand">
          <thead>
            <tr>
              <th colSpan="9" className="th-title">
                <div className="wrap-title">
                  <h2>Danh sách sản phẩm</h2>
                  <div className="wrapAction-top">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="0">Ẩn</option>
                      <option value="1">Hiển thị</option>
                    </select>
                    <select
                      value={filterCategory}
                      onChange={handleChangeFilterCategory}
                    >
                      <option value="0">Tất cả</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.brandId}>
                          {category.Name}
                        </option>
                      ))}
                    </select>
                    <button
                      id="btn-addbrand"
                      onClick={() => setShowFormAdd(!showFormAdd)}
                    >
                      Thêm mới
                    </button>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          {currentItems.length > 0 ? (
            <tbody className="tbody-data" id="wrap-dataPrd">
              <tr className="header-row">
                <th>STT</th>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Loại màu sắc</th>
                <th>Danh mục</th>
                <th>Giá sản phẩm</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
              {currentItems.map((product, index) => (
                <tr className="bottom-row" key={index}>
                  <td>{index + 1 + offset}</td>
                  <td>
                    <div className="box-imageprd">
                      <img src={`${IMAGES_PATH}${product.types[0].image}`} />
                    </div>
                  </td>
                  <td className="nameprd">{product.name}</td>
                  <td>
                    <div className="wrap-imageprd">
                      <button
                        onClick={() => handleShowDetailColor(product._id)}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </td>
                  <td>{brandNames[product.brand]}</td>
                  <td>
                    {formatVNDPrice(product.priceNow)}
                    <del className="priceOrigin">
                      {formatVNDPrice(product.priceOrigin)}
                    </del>
                  </td>
                  <td>
                    <span
                      className={`statusProduct ${
                        product.status === 0 ? "active" : ""
                      }`}
                    >
                      {product.status === 1 ? "Hiển thị" : "Ẩn"}
                    </span>
                  </td>
                  <td className="btn-action">
                    <button
                      className="prd-fix"
                      onClick={() => handleShowFix(product._id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="prd-remove"
                      onClick={() => removeProduct(product._id, product.name)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tr>
              <td colSpan="9">Không có sản phẩm nào</td>
            </tr>
          )}
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
      </div>

      <div className={`box_detailColor ${showDetailColor ? "active" : ""}`}>
        <span id="close-add" onClick={() => setShowDetailColor(false)}>
          <i className="ri-close-circle-line"></i>
        </span>
        <div className="title">{dataColor.name}</div>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Màu</th>
              <th>Ảnh</th>
              <th>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {dataColor.types?.map((type, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{type.color}</td>
                <td>
                  <img src={`${IMAGES_PATH}${type.image}`} />
                </td>
                <td>{type.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`box-add ${showFormAdd ? "active" : ""}`} id="box-addPrd">
        <span id="close-add" onClick={() => setShowFormAdd(false)}>
          <i className="ri-close-circle-line"></i>
        </span>
        <h2>Thêm sản phẩm</h2>
        <div className="box_input">
          <label htmlFor="namePrd">Tên sản phẩm:</label>
          <input
            name="name"
            type="text"
            id="namePrd"
            placeholder="Tên sản phẩm"
            value={valuesAdd.name}
            onChange={handleChangesValue}
          />
          <label>Màu sắc:</label>
          <br />
          {colors.map((color, index) => (
            <div key={index} className="form-image">
              <div className="left_color">
                <label htmlFor={`upload${index}`} className="displayImg">
                  {color.imageSrc ? (
                    <img
                      src={color.imageSrc}
                      alt="Selected"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <i className="ri-add-line"></i>
                  )}
                </label>
                <input
                  type="file"
                  name="upload"
                  id={`upload${index}`}
                  onChange={(e) => handleFileChange(index, e, "add")}
                />
              </div>
              <div className="right_color">
                <input
                  type="text"
                  id={`nameColor${index}`}
                  value={color.name}
                  onChange={(e) =>
                    handleColorChange(index, "name", e.target.value)
                  }
                  placeholder="Tên màu sắc..."
                />
                <input
                  type="number"
                  id={`quantityColor${index}`}
                  value={color.quantity}
                  onChange={(e) =>
                    handleColorChange(index, "quantity", e.target.value)
                  }
                  min="1"
                  placeholder="Số lượng..."
                />
              </div>
              <div className="delete_color">
                <button
                  onClick={() => {
                    const newColors = [...colors];
                    newColors.splice(index, 1);
                    setColors(newColors);
                  }}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>
          ))}
          <button className="addColorBtn" onClick={handleAddColor}>
            <i className="ri-add-line"></i>Thêm màu sắc
          </button>
          <br />
          <label>Danh mục:</label>
          <br />
          <select
            name="brand"
            id="categoryAdd"
            className="category"
            value={valuesAdd.brand}
            onChange={handleChangesValue}
          >
            {categories.map((category) => (
              <option key={category._id} value={category.brandId}>
                {category.Name}
              </option>
            ))}
          </select>
          <br />
          <label htmlFor="priceNow">Giá hiện tại:</label>
          <input
            name="priceNow"
            type="number"
            id="priceNow"
            min="1"
            placeholder="Giá hiện tại của sản phẩm..."
            value={valuesAdd.priceNow}
            onChange={handleChangesValue}
          />
          <label htmlFor="priceOrigin">Giá gốc:</label>
          <input
            name="priceOrigin"
            type="number"
            id="priceOrigin"
            min="1"
            placeholder="Giá gốc của sản phẩm..."
            value={valuesAdd.priceOrigin}
            onChange={handleChangesValue}
          />
        </div>
        <button id="submit-add" onClick={handleAddSubmit}>
          Xác nhận
        </button>
      </div>

      <div
        className={`box-add ${showFormEdit ? "active" : ""}`}
        id="box-addPrd"
      >
        <span id="close-add" onClick={() => setShowFormEdit(false)}>
          <i className="ri-close-circle-line"></i>
        </span>
        <h2>Cập nhật sản phẩm</h2>
        <div className="box_input">
          <label htmlFor="namePrd">Tên sản phẩm:</label>
          <input
            name="name"
            type="text"
            id="namePrd"
            placeholder="Tên sản phẩm"
            value={valueFix.name}
            onChange={handleChangeValueFix}
          />
          <label>Màu sắc:</label>
          <br />
          {colorsFix.map((color, index) => (
            <div key={index} className="form-image">
              <div className="left_color">
                <label htmlFor={`uploadFix${index}`} className="displayImg">
                  {color.image ? (
                    <img
                      src={
                        color.imageSrc
                          ? color.imageSrc
                          : `${IMAGES_PATH}${color.image}`
                      }
                      alt="Selected"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <i className="ri-add-line"></i>
                  )}
                </label>
                <input
                  type="file"
                  name="upload"
                  id={`uploadFix${index}`}
                  onChange={(e) => handleFileChange(index, e, "fix")}
                />
              </div>
              <div className="right_color">
                <input
                  type="text"
                  id={`nameColor${index}`}
                  value={color.color}
                  onChange={(e) =>
                    handleColorChangeFix(index, "color", e.target.value)
                  }
                  placeholder="Tên màu sắc..."
                />
                <input
                  type="number"
                  id={`quantityColor${index}`}
                  value={color.quantity}
                  onChange={(e) =>
                    handleColorChangeFix(index, "quantity", e.target.value)
                  }
                  min="1"
                  placeholder="Số lượng..."
                />
              </div>
              <div className="delete_color">
                <button
                  onClick={() => {
                    const newColors = [...colorsFix];
                    newColors.splice(index, 1);
                    setColorsFix(newColors);
                  }}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>
          ))}
          <button className="addColorBtn" onClick={handleAddColorFix}>
            <i className="ri-add-line"></i>Thêm màu sắc
          </button>
          <br />
          <label>Danh mục:</label>
          <br />
          <select
            name="brand"
            id="categoryAdd"
            className="category"
            value={valueFix.brand}
            onChange={handleChangeValueFix}
          >
            {categories.map((category) => (
              <option key={category._id} value={category.brandId}>
                {category.Name}
              </option>
            ))}
          </select>
          <br />
          <label htmlFor="priceNow">Giá hiện tại:</label>
          <input
            name="priceNow"
            type="number"
            id="priceNow"
            min="1"
            placeholder="Giá hiện tại của sản phẩm..."
            value={valueFix.priceNow}
            onChange={handleChangeValueFix}
          />
          <label htmlFor="priceOrigin">Giá gốc:</label>
          <input
            name="priceOrigin"
            type="number"
            id="priceOrigin"
            min="1"
            placeholder="Giá gốc của sản phẩm..."
            value={valueFix.priceOrigin}
            onChange={handleChangeValueFix}
          />
          <label>Trạng thái:</label>
          <br />
          <select
            name="status"
            id="categoryAdd"
            className="category"
            value={valueFix.status}
            onChange={handleChangeValueFix}
          >
            <option value="0">Ẩn</option>
            <option value="1">Hiển thị</option>
          </select>
        </div>
        <button id="submit-add" onClick={handleFixSubmit}>
          Xác nhận
        </button>
      </div>
    </div>
  );
}

export default Products;
