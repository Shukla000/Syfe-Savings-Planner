import React from "react";
import ReactDOM from "react-dom/client"; // 👈 this is the change
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // 👈 this is the new API
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
