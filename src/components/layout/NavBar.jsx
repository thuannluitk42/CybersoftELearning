import React from "react";
import { NavLink } from "react-router-dom";
import { useUser } from '../../utils/UserContext';

const Navbar = () => {
  const { user, setUser } = useUser();

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary px-5 shadow sticky-top">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to={"/"}>
          Online Quiz App
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link disabled">Hello, {user.username}</span>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to={"/admin"}>
                    Admin
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to={"/quiz-stepper"}>
                    Take Quiz
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to={"/history-score"}>
                    History Score
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to={"/sign-in"}>
                    Sign In
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to={"/sign-up"}>
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
