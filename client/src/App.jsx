import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Category from "./pages/Category";
import DetailProduct from "./pages/DetailProduct";
import Information from "./pages/Information";
import History from "./pages/History";
import Contact from "./pages/Contact";
import Forgot from "./pages/Forgot";
import Cart from "./pages/Cart";
import VerifyOtp from "./pages/VerifyOtp";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";
import HeaderAdmin from "./admin/components/Header";
import Navigation from "./admin/components/Navigation";
import Dashboard from "./admin/pages/Dashboard";
import CommentAdmin from "./admin/pages/Comment";
import UsersAdmin from "./admin/pages/Users";
import CategoryAdmin from "./admin/pages/Category";
import ProductsAdmin from "./admin/pages/Products";
import OrdersAdmin from "./admin/pages/Orders";
import { getInformation } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (
      document.body.style.overflow === "hidden" &&
      location.pathname !== "/"
    ) {
      document.body.style.overflow = "auto";
    }

    if (location.pathname.startsWith("/admin/")) {
      document.body.classList.add("admin");
    } else {
      document.body.classList.remove("admin");
    }
  }, [location]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  useEffect(() => {
    if (
      localStorage.getItem("accessToken") &&
      localStorage.getItem("refreshToken")
    ) {
      dispatch(getInformation());
    }
  }, [dispatch]);

  const isAdminRoute = location.pathname.startsWith("/admin/");

  return (
    <>
      {!isAdminRoute && <Header />}
      {user && user.role === 2 && (
        <>
          {isAdminRoute && <Navigation />}
          {isAdminRoute && <HeaderAdmin />}
        </>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:brandId" element={<Category />} />
        <Route path="/search/:searchValue" element={<Category />} />
        <Route path="/detailProduct/:id" element={<DetailProduct />} />
        <Route path="/information" element={<Information />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/success" element={<Success />} />
        <Route path="/history" element={<History />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/verifyOtp" element={<VerifyOtp />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        {user && user.role === 2 && (
          <>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route path="/admin/comment" element={<CommentAdmin />} />
            <Route path="/admin/users" element={<UsersAdmin />} />
            <Route path="/admin/category" element={<CategoryAdmin />} />
            <Route path="/admin/products" element={<ProductsAdmin />} />
            <Route path="/admin/orders" element={<OrdersAdmin />} />
            <Route path="/admin/*" element={<NotFound />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
