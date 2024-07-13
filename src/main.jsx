import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { UserProvider } from '../src/utils/UserContext.jsx';
import "../node_modules/jquery/dist/jquery.min.js";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
