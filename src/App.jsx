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
import AdminProtectedRoute from "./components/ProtectRoute/AdminProtectedRoute";
import OwnerProtectedRoute from "./components/ProtectRoute/OwnerProtectedRoute";
import UserProtectedRoute from "./components/ProtectRoute/UserProtectedRoute";
import Unauthorized from "./components/Unauthorized";
import RegionListPage from "./pages/RegionListPage";
import ConfigListPage from "./pages/ConfigListPage";
import AdminLayout from "./pages/AdminLayout";

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
        element: <AdminLayout />, // Use AdminLayout as the parent element
        children: [
          {
            index: true,
            element: <AdminDashboardPage />, // Render AdminDashboardPage inside AdminLayout's Outlet
          },
          {
            path: "regions/all",
            element: <RegionListPage />, // Render RegionListPage inside AdminLayout's Outlet
          },
          {
            path: "configs/all",
            element: <ConfigListPage />, // Thêm route cho ConfigListPage
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
