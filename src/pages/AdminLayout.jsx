import { Outlet } from "react-router-dom";
import HeaderAdmin from "../components/HeaderAdmin"; 
import Footer from "../components/Footer";

function AdminLayout() {
  return (
    <div>
      <HeaderAdmin />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AdminLayout;