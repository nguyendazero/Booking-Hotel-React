import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import HotelDetailPage from "./pages/HotelDetail";
import HotelsPage from "./pages/Hotels";
import RootLayout from "./pages/Root";
import LoginPage from "./pages/Login";
import BookingSuccessPage from "./pages/BookingSuccess"

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
        path: "booking-success",
        element: <BookingSuccessPage />,
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
