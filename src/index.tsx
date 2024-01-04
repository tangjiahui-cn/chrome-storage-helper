import { createRoot } from "react-dom/client";
import "antd/dist/antd.min.css";
import App from './pages';

const mount: HTMLElement = document.getElementById("root") || document.body;
createRoot(mount).render(<App />);
