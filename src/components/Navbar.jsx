// src/components/Navbar.jsx
import React from "react";
import { NavLink, Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../images/Logo.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          <img src={logo} alt="FlagGo Logo" className="logo-image" />
        </Link>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink
            to="/homepage"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Trang chủ
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/history"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Lịch sử
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/personalize"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Cá nhân hóa
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/shop"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Mua sắm
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
