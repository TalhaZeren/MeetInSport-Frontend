import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {useAuthStore} from "../features/auth/authStore";
import Footer from "./Footer";

const Layout = () => {
    const {isAuthenticated, name, role, logout} = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login') 
    };

    const isHomePage = location.pathname === "/";
    const navClasses = isHomePage 
    ? "absolute top-0 w-full z-50 text-white p-6"
    : "text-white p-4 shadow-md w-full";

    const navStyle = isHomePage
    ? { backgroundColor: 'transparent' }
    : { backgroundColor: 'rgb(9, 58, 50)' };


    return (
    <div className = {`bg-gray-50 flex flex-col ${isHomePage ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
 
      <nav className={navClasses} style={navStyle}>
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold tracking-wider ">MeetInSport</Link>
          
          <div className="space-x-6">
            <Link to="/coaches" className="hover:text-blue-200 transition">Antrenör ara</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200 transition">Ana Sayfa</Link>
                <span className="text-sm bg-blue-700 px-3 py-1 rounded-full border border-blue-500">
                  {name} ({role})
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100 transition font-semibold"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition">Giriş</Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100 transition font-semibold">
                  Kaydol
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>



      {/* --- PAGE CONTENT --- */}
      <main className="flex-grow w-full h-full">
        <Outlet />
      </main>

      {/* --- FOOTER --- */}
      {!isHomePage && <Footer />}
    </div>
    );      
    };

export default Layout;
