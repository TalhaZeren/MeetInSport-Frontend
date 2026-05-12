import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { coachService } from '../../api/services/coachService';
import { lessonPackageService } from '../../api/services/lessonPackageService';
import { reservationService } from '../../api/services/reservationService';
import { useAuthStore } from '../auth/authStore';
import type{ LessonPackageResponse } from '../../types';



const bookingSchema = z.object({
  scheduleAt : z.string().min(1, "Lütfen tarih ve saati giriniz."),
  locationType : z.number().min(1,"Lütfen konumu seçiniz."),
  notes : z.string().max(500, "Not en fazla 500 karakter olabilir.").optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;



const CoachDetailPage = () => {

    const {id} = useParams<{id : string}>();
    const navigate = useNavigate();
    
    const userRole = useAuthStore((state) => state.role);
    const myEmail = useAuthStore((state) => state.email);

    const [selectedPackage, setSelectedPackage] = useState<LessonPackageResponse | null>(null);  


  const { data: coach, isLoading: isCoachLoading, isError } = useQuery({
    queryKey: ['coach', id],
    queryFn: () => coachService.getCoachById(id!),
    enabled: !!id, 
  });

    const {data : packages, isLoading : isPackagesLoading} = useQuery({
      queryKey: ['coach-packages', id],
      queryFn : () => lessonPackageService.getPackagesByCoachId(id!),
      enabled : !!id,
    });

    

    const {
      register, 
      handleSubmit,
      reset,
      formState: {errors}
    } = useForm<BookingFormValues>({
      resolver : zodResolver(bookingSchema),
      defaultValues:{locationType : 1}
    });

    const {mutate : createReservation, isPending : isBooking} =useMutation({
      mutationFn : reservationService.createReservation,
      onSuccess :() => {
        alert("Rezervasyon başarıyla yapıldı.")
        reset();
        navigate('/student/dashboard');
      },
      onError : (error :any) => {
        alert(error.response?.data?.message ||  "Rezervasyon yapılamadı.");
      }
    });
 
    const onBookSubmit = (data: BookingFormValues) => {
      if (!selectedPackage) return;

      const payload = {
        packageId : selectedPackage.id,
        scheduleAt : new Date(data.scheduleAt).toISOString(),
        locationType : data.locationType,
        notes : data.notes,
      };
      createReservation(payload);
    }

   if (isCoachLoading) {
    return <div className="min-h-screen bg-gray-50 py-20 text-center animate-pulse">Loading Coach Profile...</div>;
  }

  if (isError || !coach) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#0B1628]">Coach Not Found</h2>
        <button onClick={() => navigate('/coaches')} className="mt-6 text-[#C9A84C] font-semibold hover:underline">
          &larr; Back to Directory
        </button>
      </div>
    );
  }

  const isMyProfile = coach.email === myEmail;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        
        <button onClick={() => navigate('/coaches')} className="text-[#8A96A3] font-semibold hover:text-[#0B1628] mb-6 flex items-center transition">
          &larr; Geri Dön
        </button>

        {/* PROFILE HEADER (Same as before) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="h-32 bg-[#0B1628] w-full relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent"></div>
          </div>
          <div className="px-8 pb-8 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-8 gap-4">
              <div className="flex items-end gap-6">
                <div className="w-32 h-32 bg-white rounded-full p-2 shadow-md relative z-10">
                  <div className="w-full h-full bg-[#093A32] rounded-full flex items-center justify-center text-5xl font-bold font-serif text-white">
                    {coach.fullName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="pb-2">
                  <h1 className="text-3xl font-serif font-bold text-[#0B1628]">{coach.fullName}</h1>
                  <span className="inline-block bg-[#C9A84C]/20 text-[#C9A84C] px-3 py-1 rounded-md font-bold uppercase tracking-widest text-xs mt-2">
                    {coach.sport}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 pb-2">
                {userRole === 'Coach' && isMyProfile && (
                  <Link to="/coaches/profile/edit" className="px-5 py-2 border border-gray-300 text-[#0B1628] rounded-md font-bold uppercase text-sm hover:bg-gray-50 transition">
                    Profili Düzenle
                  </Link>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold text-[#0B1628] border-b border-gray-100 pb-2 mb-4">Hakkında</h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {coach.bio && coach.bio !== "Not Specified" ? coach.bio : "T"}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 h-fit">
                <h3 className="font-bold text-[#0B1628] mb-4 uppercase tracking-wide text-sm">Bilgilerim</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Saatlik Ücret</p>
                    <p className="font-bold text-[#093A32] text-lg">₺{coach.hourlyRate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Deneyim</p>
                    <p className="font-semibold text-[#0B1628]">{coach.experience} Yıl</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Değerlendirme</p>
                    <div className="flex items-center gap-1 font-semibold text-[#0B1628]">
                      <span className="text-[#C9A84C]">⭐</span> 
                      {coach.avarageRating > 0 ? coach.avarageRating.toFixed(1) : "New"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-serif font-bold text-[#0B1628] mb-6">Antrenörün Mevcut Ders Paketleri</h2>
        
        {isPackagesLoading ? (
          <div className="text-center py-10 text-gray-500 animate-pulse">Paketler Yükleniyor...</div>
        ) : packages && packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                <div className="relative h-48 overflow-hidden bg-[#093A32]/10">
                <img
                  src={pkg.coverImageUrl}
                  alt={pkg.packageName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-[#0B1628]">{pkg.packageName}</h3>
                  <span className="bg-[#093A32]/10 text-[#093A32] font-bold px-2 py-1 rounded text-xs">
                    {pkg.lessonModel === "OneOnOne" ? "Bire Bir Ders" : "Grup Dersi"}
                  </span>
                </div>
                <p className="text-2xl font-black text-[#C9A84C] mb-4">₺{pkg.packagePrice}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{pkg.packageDescription}</p>
                <div className="text-xs text-gray-500 space-y-2 font-medium">
                  <p>⏳ {pkg.durationInMinutes} Dakika / Oturum</p>
                  <p>📍 {pkg.locationType}</p>
                </div>
              </div>
                

                {(!isMyProfile && userRole) && (
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button 
                      onClick={() => setSelectedPackage(pkg)}
                      className="w-full bg-[#0B1628] text-white py-2 rounded-md font-bold  tracking-widest text-sm hover:bg-[#093A32] transition"
                    >
                      Ders Paketini Al
                    </button>
                  </div>
                )}
                {/* Prompt guest users to login */}
                {!userRole && (
                  <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                    <Link to="/login" className="text-sm font-bold text-[#C9A84C] hover:underline">Ders satın almak için Giriş yap.</Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 text-center rounded-xl border border-gray-200">
            <p className="text-gray-500">Bu antrenör henüz ders paketi yayınlamamış.</p>
          </div>
        )}
      </div>

      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1628]/70 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-fade-up">
            
            <div className="mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-xl font-serif font-bold text-[#0B1628]">Dersi Satın Al</h3>
              <p className="text-[#C9A84C] font-bold mt-1">{selectedPackage.packageName}</p>
            </div>

            <form onSubmit={handleSubmit(onBookSubmit)} className="space-y-5" >
              
              {/* Date & Time Picker */}
              <div>
                <label className="block text-sm font-medium text-[#0B1628] tracking-wide mb-2">İstediğiniz Tarih ve Saati Giriniz.</label>
                <input 
                  type="datetime-local" 
                  {...register('scheduleAt')} 
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093A32] ${errors.scheduleAt ? 'border-red-500' : 'border-gray-300'}`} 
                />
                {errors.scheduleAt && <span className="text-red-500 text-xs mt-1">{errors.scheduleAt.message}</span>}
              </div>

          
              <div>
                <label className="block text-sm font-medium text-[#0B1628]  tracking-wide mb-2">Ders Konumu</label>
                <select 
                  {...register('locationType', { valueAsNumber: true })} 
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093A32] bg-white ${errors.locationType ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value={0} disabled>-- Konum Seç --</option>
                  <option value={1}>Antrenör Konumu</option>
                  <option value={2}>Öğrenci Konumu</option>
                  <option value={3}>Online Ders</option>
                </select>
                {errors.locationType && <span className="text-red-500 text-xs mt-1">{errors.locationType.message}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0B1628] tracking-wide mb-2">Antrenöre Not  (İsteğe bağlı.)</label>
                <textarea 
                  {...register('notes')} 
                  rows={3}
                  placeholder=" örn : Herhangi bir sakatlık, özel hedef veya konum detayı..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093A32] resize-none text-sm" 
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setSelectedPackage(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-[#0B1628] rounded-md font-bold uppercase tracking-widest text-sm hover:bg-gray-50 transition"
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  disabled={isBooking}
                  className="flex-1 bg-[#093A32] text-white py-3 rounded-md font-bold uppercase tracking-widest text-sm hover:bg-[#062923] transition disabled:opacity-50"
                >
                  {isBooking ? "İşleniyor..." : "Onayla"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
export default CoachDetailPage;
