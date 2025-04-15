import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import HotelDetailPage from "./pages/HotelDetail";
import HotelsPage from "./pages/Hotels";
import RootLayout from "./pages/Root";
import LoginPage from "./pages/Login";
import BookingSuccessPage from "./pages/BookingSuccess";
import CheckinPage from "./pages/Checkin";
import Statistic from "./pages/Statistic";
import WishList from "./pages/WishList";
import AdminDashboardPage from "./pages/AdminDashboard";
import BookingHistoryPage from "./pages/BookingHistory";
import ManageHotelOwner from "./pages/ManageHotelOwner";
import AdminLayout from "./pages/AdminLayout";
import AdminProtectedRoute from "./components/ProtectRoute/AdminProtectedRoute";
import OwnerProtectedRoute from "./components/ProtectRoute/OwnerProtectedRoute";
import UserProtectedRoute from "./components/ProtectRoute/UserProtectedRoute";
import Unauthorized from "./components/Unauthorized";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "hotels",
        children: [
          { index: true, element: <HotelsPage /> },
          {
            path: ":hotelId",
            id: "hotel-detail",
            children: [{ index: true, element: <HotelDetailPage /> }],
          },
        ],
      },
      // Các route cần bảo vệ cho người dùng đã đăng nhập
      {
        path: "user",
        element: <UserProtectedRoute />,
        children: [
          { path: "checkin", element: <CheckinPage /> },
          { path: "booking-history", element: <BookingHistoryPage /> },
          { path: "wish-list", element: <WishList /> },
          { path: "booking-success", element: <BookingSuccessPage /> },
        ],
      },
      //Owner
      {
        path: "owner",
        element: <OwnerProtectedRoute />,
        children: [
          { path: "manage-hotel-owner", element: <ManageHotelOwner /> },
          { path: "statistics", element: <Statistic /> },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />, // Trang login sẽ không có MainNavigation và Footer
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/admin",
    element: <AdminProtectedRoute />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: "dashboard", // Thêm path rõ ràng
        element: <AdminLayout />,
        children: [
          // Các route con của dashboard nếu có
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
