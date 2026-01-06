import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProviderProvider } from "./context/ProviderContext.jsx";
import "./assets/tw.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ProviderProvider>
        <App />
      </ProviderProvider>
    </AuthProvider>
  </React.StrictMode>
);
