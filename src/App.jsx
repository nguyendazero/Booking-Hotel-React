import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import HotelDetailPage from "./pages/HotelDetail";
import HotelsPage from "./pages/Hotels";
import RootLayout from "./pages/Root";
import LoginPage from "./pages/Login";
import BookingSuccessPage from "./pages/BookingSuccess"
import CheckinPage from "./pages/Checkin";
import Statistic from "./pages/Statistic";
import WishList from "./pages/WishList";
import BookingHistoryPage from "./pages/BookingHistory";
import ManageHotelOwner from "./pages/ManageHotelOwner";


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
          {
            index: true,
            element: <HotelsPage />,
          },
          {
            path: ":hotelId",
            id: "hotel-detail",
            children: [
              {
                index: true,
                element: <HotelDetailPage />,
              },
            ],
          },
        ],
      },
      {
        path: "checkin",
        element: <CheckinPage />,
      },
      {
        path: "booking-history",
        element: <BookingHistoryPage />,
      },
      {
        path: "wish-list",
        element: <WishList />,
      },
      {
        path: "booking-success",
        element: <BookingSuccessPage />,
      },
      //Owner
      {
        path: "manage-hotel-owner",
        element: <ManageHotelOwner />,
      },
      {
        path: "statistics",
        element: <Statistic />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />, // Trang login sẽ không có MainNavigation và Footer
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
