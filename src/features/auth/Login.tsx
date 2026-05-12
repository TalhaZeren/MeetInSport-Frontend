import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../api/services/authService';
import { useAuthStore } from './authStore';

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"), 
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);


  const [showPassword, setShowPassword] = useState(false);

  const { 
    register, 
    handleSubmit, 
    setError, // Allows us to manually set API errors to the form
    formState: { errors } 
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) // Connects Zod to React Hook Form
  });

  
  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: authService.login, // The API function to call
    onSuccess: (data) => {
      // If the API returns 200 OK, this block runs automatically
      setAuth(data.token, data.userId, data.name, data.email, data.role);
      
   
      if (data.role === 'Coach') {
        navigate('/coaches/dashboard'); 
      } else {
        navigate('/student/dashboard'); 
      }
    },
    onError: (error: any) => {
   
      console.error("Login failed:", error);
     
      setError('root', { 
        message: error.response?.data?.message || "Invalid email or password. Please try again." 
      });
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    loginUser({
      email: data.email, password: data.password
    }); 
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-[#0B1628] tracking-tight uppercase">Hoşgeldin</h2>
          <p className="text-[#8A96A3] mt-2 text-sm">Devam etmek için lütfen giriş yapın</p>
        </div>
        
        {/* We use noValidate to disable standard HTML popups so Zod handles it beautifully */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-[#3D4A5C] uppercase tracking-wide mb-2">Email Adresi</label>
            <input 
              type="email" 
              {...register('email')} 
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D6E6E] transition ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="athlete@example.com"
            />
            {errors.email && <span className="text-red-500 text-sm mt-1 block">{errors.email.message}</span>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-[#3D4A5C] uppercase tracking-wide mb-2">Şifre</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                {...register('password')} 
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D6E6E] transition ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                {showPassword ? "Gizle" : "Göster"}
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-sm mt-1 block">{errors.password.message}</span>}
          </div>

          {/* Global API Error Display */}
          {errors.root && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
              {errors.root.message}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-[#0B1628] text-white py-3 rounded-md font-semibold hover:bg-[#0D6E6E] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest mt-4"
          >
            {isPending ? "Kontrol Ediliyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;