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
import UpcomingBookingsPage from "./pages/UpcomingBookingsPage";
import AllBookingsPage from "./pages/AllBookingPage";
import PendingRegistrationsPage from "./pages/PendingRegistrationsPage";
import AcceptedRegistrationsPage from "./pages/AcceptedRegistrationsPage";
import RejectedRegistrationsPage from "./pages/RejectedRegistrationsPage";
import HotelListPage from "./pages/HotelListPage";
import UserListPage from "./pages/UserListPage";
import UserBlockedPage from "./pages/UserBlockedPage";
import UserOwnerPage from "./pages/UserOwnerPage";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { login } from "./store/authSlice";
import GithubRedirect from "./components/GithubRedirect";

const router = createBrowserRouter(
  [
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
      path: "/github-redirect",
      element: <GithubRedirect />,
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
          element: <AdminLayout />,
          children: [
            {
              index: true,
              element: <AdminDashboardPage />,
            },
            {
              path: "regions/all",
              element: <RegionListPage />,
            },
            {
              path: "configs/all",
              element: <ConfigListPage />,
            },
            {
              path: "bookings/upcoming",
              element: <UpcomingBookingsPage />,
            },
            {
              path: "bookings/all",
              element: <AllBookingsPage />,
            },
            {
              path: "registrations/pending",
              element: <PendingRegistrationsPage />,
            },
            {
              path: "registrations/accepted",
              element: <AcceptedRegistrationsPage />,
            },
            {
              path: "registrations/rejected",
              element: <RejectedRegistrationsPage />,
            },
            {
              path: "hotels",
              element: <HotelListPage />,
            },
            {
              path: "users",
              element: <UserListPage />,
            },
            {
              path: "users/blocked",
              element: <UserBlockedPage />,
            },
            {
              path: "users/owners",
              element: <UserOwnerPage />,
            },
          ],
        },
      ],
    },
  ],
  { basename: "/Booking-Hotel-React" }
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("token");
    const refreshToken = Cookies.get("refreshToken");
    if (token && refreshToken) {
      dispatch(login({ token, refreshToken }));
    }
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
