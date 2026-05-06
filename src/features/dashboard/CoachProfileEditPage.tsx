import {useForm} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery} from "@tanstack/react-query";
import { coachService } from "../../api/services/coachService";
import { sportService } from "../../api/services/sportService";
import { useAuthStore } from "../auth/authStore";
import { useState } from "react";
import { useEffect } from "react";

const profileSchema = z.object({
    sportId : z.string().min(1, "Lütfen bir spor seçiniz."),
    bio: z.string().max(1000, "Biyografi 1000 karakteri aşamaz"),
    hourlyRate : z.number().min(0, "Saatlik ücret 0'dan büyük olmalıdır."),
    experience  : z.number().min(0, "Deneyim negatif olamaz.").max(80, "Lütfen geçerli bir deneyim süresi giriniz."),
    location : z.string().max(255,"Lokasyon en fazla 255 karakter olmalıdır."),
    iban : z.string().max(34, "IBAN en fazla 34 karakter olmalıdır."),
});

type ProfileFormValues = z.infer<typeof profileSchema>

const CoachProfileEditPage = () => {

    const navigate = useNavigate();
    const myEmail = useAuthStore((state) => state.email);
    const name = useAuthStore((state) => state.name);
    
    // Custom UI States for pop up 
    const [showSportModal, setShowSportModal] = useState(false);
    const [tempSportId, setTempSportId] = useState("");
    const [isSportLocked, setIsSportLocked] = useState(false);

    // 2. FETCH DATA
  const { data: sportsList, isLoading: isLoadingSports } = useQuery({
    queryKey: ['sports'],
    queryFn: sportService.getAllSports,
  });
  
   const { data: coaches, isLoading: isLoadingCoaches } = useQuery({
    queryKey: ['coaches'],
    queryFn: coachService.getAllCoaches,
  });

  const myProfile = coaches?.find(coach => coach.email === myEmail);
  
    const { 
    register, 
    handleSubmit, 
    setError,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty } 
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      sportId: "", 
      bio: "",
      hourlyRate: 0,
      experience: 0,
      location: "",
      iban: "",
    }
  });

  const currentSportId = watch('sportId');

    // We watch the sportId so we can display the selected sport's name in the locked box.
    useEffect(() => {
      if (myProfile && sportsList) {
        const matchedSport = sportsList.find(s => s.name === myProfile.sport);
        const sportGuid = matchedSport ? matchedSport.id : "";      

        reset({
          sportId : sportGuid,
          bio : myProfile.bio && myProfile.bio !== "Not Specified" ? myProfile.bio : "",
          hourlyRate : myProfile.hourlyRate,
          experience : myProfile.experience,
          location : myProfile.location && myProfile.location !== "Not Specified" ? myProfile.location : "",
          iban : "",
        });

        if(sportGuid) {
          setIsSportLocked(true);
        }
      }
    }, [myProfile, sportsList,reset]);
    
    // TanStack Query  ---> save the data.
  const {mutate : updateProfile, isPending} = useMutation({
    mutationFn : coachService.updateProfile,
    onSuccess : () => {
      alert("Profil başarıyla güncellendi");
      navigate("/coach/dashboard");
    },
    onError : (error : any) => {
        console.error("Profile update failed.", error);
        setError('root' , {
            message : error.response?.data?.message || "Failed to update profile. Please try again."
        });
    }
  });

  const onSubmit  = (data: ProfileFormValues) => {
    updateProfile(data);
  };

  // Model Lock Confirmation Handler
  const handleConfirmLock = () => {
    if(!tempSportId) return; // 

    setValue('sportId', tempSportId, {shouldValidate : true, shouldDirty : true});

    setIsSportLocked(true);
    setShowSportModal(false);
  };
  // Prevent rendering the form until the data arrives to avoid flashing empty inputs.

  if(isLoadingCoaches || isLoadingSports) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0D6E6E] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#8A96A3] mt-4 animate-pulse">Loading your professional profile...</p>
      </div> 
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in relative">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[#0B1628]">Edit Professional Profile</h1>
        <p className="text-[#8A96A3] mt-2">Update your public details so students can find and book you, {name}.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Primary Sport (LOCKED LOGIC) */}
            <div>
              <label className="block text-sm font-medium text-[#3D4A5C] uppercase tracking-wide mb-2">Primary Sport</label>
              
              {isSportLocked ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed flex justify-between items-center">
                  <span>
                    {/* Display the active sport name, fallback to profile string if reverse-lookup fails */}
                    {sportsList?.find(s => s.id === currentSportId)?.name || myProfile?.sport || "Sport Locked"}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-200 px-2 py-1 rounded">Locked</span>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => setShowSportModal(true)}
                  className={`w-full px-4 py-3 border rounded-md text-left focus:outline-none focus:ring-2 focus:ring-[#0D6E6E] transition hover:border-[#0D6E6E] ${errors.sportId ? 'border-red-500' : 'border-gray-300 bg-white'}`}
                >
                  <span className="text-gray-500">Bir spor dalı seçiniz</span>
                </button>
              )}
              
              {/* Hidden input keeps Zod happy since we replaced the native <select> element */}
              <input type="hidden" {...register('sportId')} />
              {errors.sportId && <span className="text-red-500 text-sm mt-1">{errors.sportId.message}</span>}
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block text-sm font-medium text-[#3D4A5C] uppercase tracking-wide mb-2">Hourly Rate (₺)</label>
              <input 
                type="number" 
                step="0.01" 
                {...register('hourlyRate', { valueAsNumber: true })} 
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D6E6E] ${errors.hourlyRate ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {errors.hourlyRate && <span className="text-red-500 text-sm mt-1">{errors.hourlyRate.message}</span>}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-[#3D4A5C] uppercase tracking-wide mb-2">Experience (Years)</label>
              <input 
                type="number" 
                {...register('experience', { valueAsNumber: true })} 
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D6E6E] ${errors.experience ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {errors.experience && <span className="text-red-500 text-sm mt-1">{errors.experience.message}</span>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-[#3D4A5C] uppercase tracking-wide mb-2">General Location</label>
              <input 
                type="text" 
                {...register('location')} 
                placeholder="e.g. Istanbul, Kadikoy"
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D6E6E] ${errors.location ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {errors.location && <span className="text-red-500 text-sm mt-1">{errors.location.message}</span>}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-[#3D4A5C] uppercase tracking-wide mb-2">Professional Bio</label>
            <textarea 
              {...register('bio')} 
              rows={4}
              placeholder="Tell students about your coaching style, achievements, and what to expect..."
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D6E6E] resize-none ${errors.bio ? 'border-red-500' : 'border-gray-300'}`} 
            />
            {errors.bio && <span className="text-red-500 text-sm mt-1">{errors.bio.message}</span>}
          </div>

          {/* IBAN */}
          <div className="p-4 bg-[#F5F2EC] rounded-lg border border-[#E8500A] border-opacity-20">
            <label className="block text-sm font-bold text-[#E8500A] uppercase tracking-wide mb-2">Payment Details (IBAN)</label>
            <p className="text-xs text-[#8A96A3] mb-3">This is strictly private and used to pay you for completed lessons.</p>
            <input 
              type="text" 
              {...register('iban')} 
              placeholder="TR..."
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E8500A] ${errors.iban ? 'border-red-500' : 'border-gray-300'}`} 
            />
            {errors.iban && <span className="text-red-500 text-sm mt-1">{errors.iban.message}</span>}
          </div>

          {/* Global Form Errors */}
          {errors.root && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
              {errors.root.message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button 
              type="button"
              onClick={() => navigate('/coach/dashboard')}
              className="px-6 py-3 border border-gray-300 text-[#3D4A5C] rounded-md font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending || !isDirty}
              className="flex-1 bg-[#0B1628] text-white py-3 rounded-md font-semibold hover:bg-[#0D6E6E] transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
            >
              {isPending ? "Saving..." : "Save Profile"}
            </button>
          </div>

        </form>
      </div>

      {/* WARNING POP-UP MODAL */}
      {showSportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1628] bg-opacity-70 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-fade-up">
            
            <div className="mb-6">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#0B1628]">Önemli Bilgi</h3>
              <p className="text-red-600 font-semibold mt-2">Yalnızca bir kez seçebilirsiniz.</p>
              <p className="text-[#3D4A5C] mt-1 text-sm">
                Onaylandıktan sonra, spor branşınız profilinizde kalıcı olarak saklanacaktır. Lütfen dikkatli seçiniz.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#3D4A5C] uppercase mb-2">Spor Dalını Seçin</label>
              <select 
                value={tempSportId}
                onChange={(e) => setTempSportId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D6E6E] bg-white"
              >
                <option value="">-- Seçiniz --</option>
                {sportsList?.map((sport) => (
                  <option key={sport.id} value={sport.id}>{sport.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowSportModal(false)} className="flex-1 px-4 py-3 border border-gray-300 text-[#3D4A5C] rounded-md font-semibold hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleConfirmLock} disabled={!tempSportId} className="flex-1 bg-[#E8500A] text-white py-3 rounded-md font-semibold hover:bg-[#d64808] transition disabled:opacity-50">Confirm & Lock</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default CoachProfileEditPage;

