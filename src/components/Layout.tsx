import { Outlet, Link, useNavigate } from "react-router-dom";
import {useAuthStore} from "../features/auth/authStore";

const Layout = () => {
    const {isAuthenticated, name, role, logout} = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login') 
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
 
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-wider">MeetInSport</Link>
          
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
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
    );      
    };

export default Layout;
