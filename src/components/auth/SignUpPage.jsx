import React, { useState } from "react";
import { signUpFunction } from "../../utils/AuthService";
import { Navigate } from 'react-router-dom';

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (!username || !password) {
                setErrorMessage('Please enter both username and password.');
                return;
            }

            const param = { username, password };
            const response = await signUpFunction(param);
            console.log('Register successful:', response);

            // Handle successful signup
            setSuccessMessage('Register successful');
            setErrorMessage('');
            
            // Delay redirection to show success message
            setTimeout(() => {
                setRedirectToLogin(true);
            }, 2000); // 2 seconds delay

        } catch (error) {

            console.error('Register failed:', error);
            setErrorMessage(error.status ? error.message : 'Something went wrong. Please try again.');
            setSuccessMessage('');
        }
    };

    if (redirectToLogin) {
        return <Navigate to="/sign-in" />;
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 mt-5">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Register Page</h5>
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

                                {errorMessage && <p className="error-message text-danger">{errorMessage}</p>}
                                {successMessage && <p className="success-message text-success">{successMessage}</p>}

                                <button type="submit" className="form-control btn-primary" style={{ height: '50px', width: '100%' }}>
                                    Sign up
                                </button>

                                <div className="btn-group">
                                    <div className="text-center">
                                        <p>Already have an account? <a href="/sign-in">Login</a></p>
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

export default SignUpPage;
