import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./MainLayout.css";

function MainLayout({ children }) {
  return (
    <div className="main-layout">

      <Sidebar />

      <Navbar />

      <main className="main-content">
        {children}
      </main>

    </div>
  );
}

export default MainLayout;