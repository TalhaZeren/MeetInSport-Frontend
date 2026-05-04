import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../../api/services/authService';
import { sportService } from '../../api/services/sportService';
import { useState } from 'react';


const  registerSchema = z.object({
  name : z.string().min(2, "Ad-Soyad gerekli."),
  email : z.string().email("Lütfen geçerli bir email adresi girinizç"),
  password : z.string().min(6, "Şifre en az 6 karakter olmalı."),
  roleId : z.number(),
  sportId : z.string().optional(),
}).refine((data)=> {
  if(data.roleId ===2){
    return data.sportId !== undefined && data.sportId !== "";
  }
  return true;
},
{
  message : "Lütfen bir spor dalı seçiniz.",
  path : ["sportId"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const {
      register, 
      handleSubmit,
      watch,
      setError,
      formState : {errors},
    } = useForm<RegisterFormValues>({
      resolver : zodResolver(registerSchema),
      defaultValues : {
        roleId : 3,
      }
    });

    const selectedRoleId = watch('roleId');

    const {data : sportlist , isLoading : isLoadingSports} = useQuery({
      queryKey : ['sports'],
      queryFn : sportService.getAllSports,
    });

    const {mutate : registerUser, isPending} = useMutation({
      mutationFn : authService.register,
      onSuccess : () => {
        alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
        navigate('/login');
      },
      onError : (error :any)=>{
        console.error("Registration Failed : " , error);  
        setError('root', {
          message : error.response?.data?.message || "Kayıt başarısız. Lütfen bilgilerinizi kontrol edip tekrar deneyin."
        });
      }
    });
    // If they are a student, we strip out the sportId entirely before sending to backend.
    const onSubmit = (data :RegisterFormValues) => {
      const payload  = {
        name: data.name,
        email: data.email,
        password : data.password,
        roleId : data.roleId,
        sportId : data.roleId === 2 ? data.sportId : undefined,
      };
      registerUser(payload);
    };


    return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-[#0B1628] tracking-tight uppercase"> MeetInSport'a Katıl!</h2>
          <p className="text-[#8A96A3] mt-2 text-sm">Spor tutkunuzla birlikte gelişin!</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          
          <div>
            <label className="block text-sm font-medium text-[#3D4A5C] mb-2">Ad-Soyad</label>
            <input 
              type="text" 
              {...register('name')} 
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D6E6E] ${errors.name ? 'border-red-500' : 'border-gray-300'}`} 
            />
            {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3D4A5C]  mb-2">Email Adresi</label>
            <input 
              type="email" 
              {...register('email')} 
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D6E6E] ${errors.email ? 'border-red-500' : 'border-gray-300'}`} 
            />
            {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
          </div>

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

           {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
          <div>
            <label className="block text-sm font-medium text-[#3D4A5C] mb-2">Alınmak İstenen Hizmet</label>
            <select 
              {...register('roleId', { valueAsNumber: true })} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D6E6E] bg-white"
            >
              <option value={3}>Spor Hizmeti Al (Öğrenci)</option>
              <option value={2}>Spor Eğitimi Ver (Eğitmen)</option>
            </select>
          </div>

          {/* DYNAMIC DATABASE-DRIVEN DROPDOWN */}
          {selectedRoleId === 2 && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
              <label className="block text-sm font-medium text-[#0D6E6E] uppercase mb-2">
                Hangi Spor Dalında Eğitim Vermek İstiyorsunuz? 
              </label>
              
              {isLoadingSports ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-500 bg-gray-100">
                 Spor Dalları Yükleniyor...
                </div>
              ) : (
                <select 
                  {...register('sportId')} 
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D6E6E] bg-white ${errors.sportId ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Bir Spor Branşı Seçiniz</option>
                  {sportlist?.map((sport) => (
                    <option key={sport.id} value={sport.id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.sportId && <span className="text-red-500 text-sm mt-1 block">{errors.sportId.message}</span>}
            </div>
          )}

          {errors.root && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
              {errors.root.message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-[#0B1628] text-white py-3 rounded-md font-semibold hover:bg-[#0D6E6E] transition duration-300 disabled:opacity-50 uppercase tracking-widest mt-6"
          >
            {isPending ? "Hesap Oluşturuluyor..." : "Kayıt Ol"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Hesabın var mı? <Link to="/login" className="text-[#0D6E6E] font-semibold hover:underline">Giriş Yap</Link>
          </p>
          
        </form>
      </div>
    </div>
  );
};

export default Register;
