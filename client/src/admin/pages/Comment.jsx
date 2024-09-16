import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { fetchComments, updateCommentStatus } from "../../store/commentSlice";
import { fetchProducts } from "../../store/productSlice";

function Comment() {
  const dispatch = useDispatch();
  const [listComment, setListComment] = useState([]);
  const [productId, setProductId] = useState("");
  const [selectedActivated, setSelectedActivated] = useState(false);
  const { comments, status: commentStatus } = useSelector(
    (state) => state.comment
  );
  const { products, status: productStatus } = useSelector(
    (state) => state.product
  );

  const handleChangeProductId = (e) => {
    setProductId(e.target.value);
    setSelectedActivated(true);
  };

  useEffect(() => {
    if (commentStatus === "idle") {
      dispatch(fetchComments());
    }
    if (productStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [commentStatus, productStatus, dispatch]);

  useEffect(() => {
    if (commentStatus === "succeeded" && productStatus === "succeeded") {
      setListComment(comments); // Mặc định hiển thị tất cả bình luận
    }
  }, [commentStatus, productStatus, comments]);

  useEffect(() => {
    if (selectedActivated) {
      const listFilter = comments.filter((comment) => {
        return productId ? comment.productId === productId : true;
      });
      setListComment(listFilter);
      setSelectedActivated(false);
    }
  }, [productId, comments, selectedActivated]);

  return (
    <div className="main">
      <div id="container-content" className="container_comment">
        <table className="table-listbrand">
          <thead>
            <tr>
              <th colSpan="7" className="th-title">
                <div className="wrap-title">
                  <h2>Danh sách bình luận</h2>
                  <select value={productId} onChange={handleChangeProductId}>
                    <option value="">Tất cả sản phẩm</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="tbody-data" id="wrap-dataUser">
            {listComment.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  Không có dữ liệu.
                </td>
              </tr>
            ) : (
              <>
                <tr className="header-row">
                  <th>STT</th>
                  <th>Người bình luận</th>
                  <th>Nội dung bình luận</th>
                  <th>Thời gian bình luận</th>
                  <th>Đánh giá</th>
                  <th>Thao tác</th>
                </tr>
                {listComment.map((comment, index) => (
                  <tr className="bottom-row" key={index}>
                    <td>{index + 1}</td>
                    <td>{comment.nameUser}</td>
                    <td>{comment.content}</td>
                    <td>{comment.date}</td>
                    <td>
                      <div className="box-role">
                        {Array.from({ length: comment.rating }, (_, index) => (
                          <i key={index} className="ri-star-fill"></i>
                        ))}
                      </div>
                    </td>
                    <td className="btn-action">
                      <button
                        className="wrap-btnAction"
                        onClick={() => {
                          dispatch(
                            updateCommentStatus({
                              id: comment._id,
                              status: comment.status === 1 ? 2 : 1,
                            })
                          );
                        }}
                      >
                        <span
                          className={`lock ${
                            comment.status === 1 ? "active" : ""
                          }`}
                        >
                          <i className="ri-eye-off-line"></i>
                        </span>
                        <span className="unlock">
                          <i className="ri-eye-line"></i>
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Comment;
