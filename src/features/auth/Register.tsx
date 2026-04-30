import {useForm} from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom';
import {authService} from '../../api/services/authService';
import {type RegisterRequest} from "../../types/auth"


const Register = () => {
    const navigate = useNavigate();

    const {register, handleSubmit, watch, formState : {errors, isSubmitting } }= useForm<RegisterRequest>({
        defaultValues: {
            roleId : 3  // We will a default value for Role.
        }
    });


    const selectedRoleId = watch('roleId');


    const onSubmit = async(data : RegisterRequest) => {
        try {
            await authService.register(data);
            alert("Kayıt Başarılı!");
            navigate("/login");
        } catch (error : any) {
            console.error("Registration Failed",error);
            alert(error.response?.data?.message || "An error occured during registration");
        }
    };


    return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight ">MeetInSport'a Katıl!</h2>
          <p className="text-gray-700 mt-3 text-md">Sen de Spora Bir Adım At!</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">Full Name</label>
            <input 
              type="text" 
              {...register('name', { required: "Lütfen isminizi giriniz" })} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a3a32] transition"
              placeholder="Serena Williams"
            />
            {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">Email Address</label>
            <input 
              type="email" 
                {...register('email',{required : "Email gerekli"})}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a3a32] transition"
              placeholder="athlete@example.com"
            />
            {errors.email && <span className="text-red-500"> {errors.email.message} </span> }
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2">Şifre</label>
            <input 
              type="password" 
              {...register('passwordHash', { 
                required: "Şifre Gerekli",
                minLength: { value: 6, message: "Password must be at least 6 characters" } 
              })} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a3a32] transition"
              placeholder="••••••••"
            />
            {errors.passwordHash && <span className="text-red-500 text-sm mt-1">{errors.passwordHash.message}</span>}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">I want to...</label>
            {/* valueAsNumber ensures it sends an integer (2 or 3) to your C# API, not a string ("2") */}
            <select 
              {...register('roleId', { valueAsNumber: true, required: "Role is required" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a3a32] transition bg-white"
            >
              <option value={3}>Learn a sport (Student)</option>
              <option value={2}>Teach a sport (Coach)</option>
            </select>
          </div>

          {/* CONDITIONAL FIELD: Only show if Role is Coach (2) */}
          {selectedRoleId === 2 && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md animate-fade-in">
              <label className="block text-sm font-medium text-[#0a3a32] uppercase tracking-wide mb-2">
                What sport do you coach?
              </label>
              <input 
                type="text" 
                {...register('sport', { required: "Sport is required for coaches" })} 
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a3a32] transition"
                placeholder="e.g. Tennis, Basketball, Chess"
              />
              {errors.sport && <span className="text-red-500 text-sm mt-1">{errors.sport.message}</span>}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#0a3a32] text-white py-3 rounded-md font-semibold hover:bg-[#062621] transition duration-300 disabled:opacity-50 uppercase tracking-widest mt-6"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            <Link to="/login" className="text-[#0a3a32] font-semibold hover:underline">Giriş Yap</Link>
          </p>
          
        </form>
      </div>
    </div>
    )
};

export default Register;
