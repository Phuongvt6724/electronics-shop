import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUser, updateUserStatus, register } from "../../store/userSlice";
import { showAlert } from "../../utils/helpers/swalUtils";
import ReactPaginate from "react-paginate";

function Users() {
  const dispatch = useDispatch();
  const { userAll, userAllStatus, registerStatus, error } = useSelector(
    (state) => state.user
  );
  const [showAdd, setShowAdd] = useState(false);
  const [registerSubmitted, setRegisterSubmitted] = useState(false);
  const [formRegister, setFormRegister] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: 1,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;
  const offset = currentPage * itemsPerPage;
  const currentItems = userAll.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(userAll.length / itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  useEffect(() => {
    if (currentPage > 0 && currentItems.length === 0) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentItems.length, currentPage]);

  const handleSubmit = () => {
    const { firstName, lastName, email, password, confirmPassword } =
      formRegister;
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      showAlert("Thất bại", "Vui lòng nhập đầy đủ thông tin", "error");
      return;
    }

    dispatch(register(formRegister));
    setRegisterSubmitted(true);
  };

  useEffect(() => {
    if (registerSubmitted) {
      if (registerStatus === "succeeded") {
        showAlert("Thành công", "Thêm khách hàng thành công", "success");
        setShowAdd(false);
        setFormRegister({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: 1,
        });
      } else if (registerStatus === "failed") {
        showAlert("Thất bại", error, "error");
      }
    }
  }, [registerStatus, registerSubmitted, error]);

  const handleValueChange = (e) => {
    const { id, value } = e.target;
    if (id === "role") {
      setFormRegister({ ...formRegister, [id]: parseInt(value) });
    } else {
      setFormRegister({ ...formRegister, [id]: value });
    }
  };

  useEffect(() => {
    if (userAllStatus === "idle") {
      dispatch(getAllUser());
    }
  }, [dispatch, userAllStatus]);

  return (
    <div className="main">
      <div id="container-content">
        <table className="table-listbrand">
          <thead>
            <tr>
              <th colSpan="7" className="th-title">
                <div className="wrap-title">
                  <h2>Danh sách khách hàng</h2>
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
          <tbody className="tbody-data" id="wrap-dataUser">
            <tr className="header-row">
              <th>STT</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
            {currentItems.map((user, index) => (
              <tr className="bottom-row" key={index}>
                <td>{index + 1 + offset}</td>
                <td>{user.firstName + " " + user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  <div className="box-role">
                    <div
                      className={`wrap-role ${user.role === 2 ? "active" : ""}`}
                    >
                      {user.role === 1 ? "Khách hàng" : "Admin"}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="box-status">
                    <div
                      className={`wrap-status ${
                        user.status === 2 ? "active" : ""
                      }`}
                    >
                      {user.status === 1 ? "Hoạt động" : "Đã khóa"}
                    </div>
                  </div>
                </td>
                <td className="btn-action">
                  <button
                    className="wrap-btnAction"
                    onClick={() =>
                      dispatch(
                        updateUserStatus({
                          id: user._id,
                          status: user.status === 1 ? 2 : 1,
                        })
                      )
                    }
                  >
                    <span
                      className={`lock ${user.status === 1 ? "active" : ""}`}
                    >
                      <i className="bx bx-lock"></i>
                    </span>
                    <span className="unlock">
                      <i className="bx bxs-lock-open"></i>
                    </span>
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
            marginPagesDisplayed={1}
            pageRangeDisplayed={1}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"selected"}
            forcePage={currentPage}
          />
        )}
        <div className={`box-add ${showAdd ? "active" : ""}`} id="box-addUser">
          <span id="close-add" onClick={() => setShowAdd(!showAdd)}>
            <i className="ri-close-circle-line"></i>
          </span>
          <h2>Thêm khách hàng</h2>
          <label htmlFor="lastName">Họ:</label>
          <input
            type="text"
            id="lastName"
            placeholder="Họ"
            value={formRegister.lastName}
            onChange={handleValueChange}
          />
          <label htmlFor="firstName">Tên:</label>
          <input
            type="text"
            id="firstName"
            placeholder="Tên"
            value={formRegister.firstName}
            onChange={handleValueChange}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            placeholder="Email"
            value={formRegister.email}
            onChange={handleValueChange}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={formRegister.password}
            onChange={handleValueChange}
          />
          <label htmlFor="confirmPassword">Xác nhận password:</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Xác nhận password"
            value={formRegister.confirmPassword}
            onChange={handleValueChange}
          />
          <label>Vai trò:</label>
          <select
            id="role"
            value={formRegister.role}
            onChange={handleValueChange}
          >
            <option value="1">Khách hàng</option>
            <option value="2">Admin</option>
          </select>
          <button id="submit-add" onClick={handleSubmit}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default Users;
