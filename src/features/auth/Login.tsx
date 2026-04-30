import { useForm } from "react-hook-form";
import { useNavigate} from "react-router-dom";
import {authService} from "../../api/services/authService";
import { useAuthStore } from "./authStore";
import { type LoginRequest } from "../../types/auth";


const Login = () => {
    const navigate = useNavigate();

    const {register , handleSubmit , formState: { errors, isSubmitting }} = useForm<LoginRequest>();  
    
    const setAuth = useAuthStore((state) => state.setAuth);

    const onSubmit = async (data : LoginRequest) => {
        try {
            // data is sent to to backend.
            const response = await authService.login(data);

            // Save token and user details to Zustand and LocalStorage
            setAuth(response.token, response.userId, response.name, response.role);

            alert("Giriş Başarılı! yönlendiriliyorsunuz...");
            navigate('/dashboard');
        } catch (error : any) {
            console.error("Login failed", error);
            alert(error.response?.data?.message || "Geçersiz email veya şifre");
        }
    };

    return(
<div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight ">Hesabınıza Giriş Yapın</h2>
          <p className="text-gray-500 mt-3 text-sm">Aşağıdaki gibi bilgileri kullanarak giriş yapabilirsiniz</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
        
          <div>
            <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">Email Address</label>
            <input 
              type="email" 
              {...register('email', { required: "Email is required" })} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a3a32] focus:border-transparent transition"
              placeholder="coach@example.com"
            />
            {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">Password</label>
            <input 
              type="password" 
              {...register('passwordHash', { required: "Password is required" })} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a3a32] focus:border-transparent transition"
              placeholder="••••••••"
            />
            {errors.passwordHash && <span className="text-red-500 text-sm mt-1">{errors.passwordHash.message}</span>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#0a3a32] text-white py-3 rounded-md font-semibold hover:bg-[#062621] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest mt-4"
          >
            {isSubmitting ? "Authenticating..." : "Sign In"}
          </button>
          
        </form>
      </div>
    </div>
    );
};

export default Login;