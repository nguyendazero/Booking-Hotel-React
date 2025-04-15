import React from "react";
import { Link } from "react-router-dom";

function HeaderAdmin() {
  return (
    <header style={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
      <h1>Admin Dashboard</h1>
      <nav>
        <Link to="/admin">Dashboard</Link> |{" "}
        <Link to="/admin/users">Users</Link> |{" "}
        <Link to="/admin/settings">Settings</Link>
      </nav>
    </header>
  );
}

export default HeaderAdmin;
