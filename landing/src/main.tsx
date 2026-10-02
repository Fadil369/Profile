import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = document.getElementById("root")!;
const app = <React.StrictMode><App initialPath={window.location.pathname} /></React.StrictMode>;
if (root.hasChildNodes() && root.querySelector("main")) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
