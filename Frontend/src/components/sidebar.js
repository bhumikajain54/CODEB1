import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ activePage }) => {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Manage Groups", path: "/groups" },
    { name: "Manage Chain", path: "/chains" },
    { name: "Manage Brands", path: "/brands" },
    { name: "Manage Zones", path: "/subzones" },
    { name: "Manage Estimate", path: "/estimates" },
    // { name: "Create Invoice", path: "/create-invoice" },
    { name: "Manage Invoices", path: "/invoice" }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Invoice System</h2>
      </div>
      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <Link to={item.path} key={index}>
            <div className={`menu-item ${activePage === item.name ? "active" : ""}`}>
              <span>{item.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;