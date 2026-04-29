import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";


const ProtectedRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

   // If they are not logged in, teleport them to the login page immediately.
    if(!isAuthenticated){
        return <Navigate to="/login" replace />;
    }

    //If they ARE logged in, render whatever component they were trying to visit
  // The <Outlet /> acts as a placeholder for the child routes!

    return <Outlet/>
};

export default ProtectedRoute;