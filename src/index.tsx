import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { MantineEmotionProvider } from "@mantine/emotion";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <MantineEmotionProvider>
      <App />
    </MantineEmotionProvider>
  </React.StrictMode>
);
