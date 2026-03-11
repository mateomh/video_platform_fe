import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./assets/stylesheets/variables.css";
import "./assets/stylesheets/base.css";
import "./assets/stylesheets/navbar.css";
import "./assets/stylesheets/messages.css";
import "./assets/stylesheets/buttons.css";
import "./assets/stylesheets/forms.css";


export default function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}