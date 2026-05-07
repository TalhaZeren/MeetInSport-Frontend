import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";
import Footer from "./Footer";

const Layout = () => {
  // userId'yi çıkardık çünkü doğrudan Coach ID'ye sahip değiliz, Dashboard'a yönlendireceğiz
  const { isAuthenticated, name, role, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isHomePage = location.pathname === "/";

  const navClasses = isHomePage
    ? "absolute top-0 left-0 w-full z-50 text-white px-8 py-5"
    : "sticky top-0 z-50 text-white px-8 py-4 shadow-lg";

  const navStyle = isHomePage
    ? { backgroundColor: "transparent" }
    : { backgroundColor: "rgb(9, 58, 50)" };

  // DİNAMİK YÖNLENDİRME MANTIĞI
  // Kullanıcı Antrenör ise kendi çalışma alanına, Öğrenci ise öğrenci paneline yönlendirilir.
  const profileRoute = role === 'Coach' ? '/coaches/dashboard' : '/student/dashboard';

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <nav className={navClasses} style={navStyle}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-bold tracking-wide hover:scale-105 transition-all duration-300"
          >
            Meet<span className="text-emerald-400">InSport</span>
          </Link>

          {/* Navbar Links */}
          <div className="flex items-center gap-4">
            <Link
              to="/coaches"
              className="px-4 py-2 rounded-xl text-gray-100 font-medium hover:bg-white/10 hover:text-white transition-all duration-300 bg-white/10 "
            >
              Antrenör Ara
            </Link>

            {isAuthenticated ? (
              <>
                {/* DÜZELTİLDİ: /coaches/${userId} yerine profileRoute kullanıldı */}
                <Link
                  to={profileRoute}
                  className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-md hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
                >
                  <span className="font-semibold">Profilim</span>
                  <span className="opacity-70 group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </Link>

                <div className="hidden md:flex items-center px-4 py-2 rounded-xl bg-[rgb(11,22,40)]/80 border border-white/10 shadow-md">
                  <span className="font-semibold text-gray-100">{name}</span>
                  <span className="ml-2 text-xs bg-[rgb(9,58,50)] text-emerald-100 px-2 py-1 rounded-lg">
                    {role === 'Coach' ? 'Antrenör' : 'Öğrenci'}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-white text-[rgb(11,22,40)] font-semibold hover:bg-gray-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 transition-all duration-300"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-gray-100 font-medium hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  Giriş
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl bg-white text-[rgb(11,22,40)] font-semibold hover:bg-gray-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 transition-all duration-300"
                >
                  Kaydol
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow w-full h-full">
        <Outlet />
      </main>

      {!isHomePage && <Footer />}
    </div>
  );
};

export default Layout;