import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import AdminDashboard from "./pages/Admindashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/cart";
import Profcate from "./pages/Profcate";
import Prdetail from "./pages/Prdetail";
import Favorite_Pr from "./pages/prlike";
import UserInfo from "./UserInfo";
import Profileuser from "./pages/ProfileUser";
import NotFound from "./pages/Notfound";
import ProductC from "./pages/Profc";
import VerifyOTP from "./pages/VetiFyOtp";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route dành cho User */}
        <Route path="/" element={<> <UserInfo /> <UserLayout /> </>}>
          <Route index element={<Home />} />
          <Route path="/dangnhap" element={<Login />} />
          <Route path="/dangky" element={<Register />} />
          <Route path="/giohang" element={<Cart />} />
          <Route path="/pr_by_cate/:cate_id" element={<ProductC />} />
          <Route path="/pr_by_typecate/:cate_id" element={<Profcate />} />
          <Route path="/chi_tiet_san_pham/:id" element={<Prdetail />} />
          <Route path="/prlike/:user_id" element={<Favorite_Pr />} />
          <Route path="/user/:user_id" element={<Profileuser />} />
          <Route path="/xacminh-otp" element={<VerifyOTP />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Route dành cho Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;