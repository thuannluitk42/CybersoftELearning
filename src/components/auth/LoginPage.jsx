import React, { useState } from "react";
import { signInFunction } from "../../utils/AuthService";
import { Navigate } from "react-router-dom";
import { useUser } from '../../utils/UserContext';

const LoginPage = () => {
  const { setUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectToHome, setRedirectToHome] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!username || !password) {
        setErrorMessage("Please enter both username and password.");
        return;
      }

      const param = { username, password };
      const response = await signInFunction(param);
      console.log("Login successful:", response);

      setUser({ username });
      setRedirectToHome(true);
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage(error.response ? "Invalid username or password." : error.message);
    }
  };

  if (redirectToHome) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 mt-5">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Login Page</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="p-2">
                <div className="mb-3">
                  <label htmlFor="username" className="form-label text-success">
                    Username:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label text-success">
                    Password:
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {errorMessage && (
                  <p className="error-message text-danger">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  className="form-control btn-primary"
                  style={{ height: "50px", width: "100%" }}
                >
                  Sign in
                </button>

                <div className="btn-group">
                  <div className="text-center">
                    <p>
                      Not a member? <a href="/sign-up">Register</a>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
