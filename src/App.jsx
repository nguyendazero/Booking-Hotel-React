import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import HotelDetailPage from "./pages/HotelDetail";
import HotelsPage from "./pages/Hotels";
import RootLayout from "./pages/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "hotels",
        // element: <HotelsRootLayout />,
        children: [
          {
            index: true,
            element: <HotelsPage />,
            // loader: eventsLoader,
          },
          {
            path: ":hotelId",
            id: "hotel-detail",
            // loader: hotelDetailLoader,
            children: [
              {
                index: true,
                element: <HotelDetailPage />,
                // action: deleteEventAction,
              },
            ],
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
