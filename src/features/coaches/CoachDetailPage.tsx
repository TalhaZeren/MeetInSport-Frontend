import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { coachService } from '../../api/services/coachService';
import { useAuthStore } from '../auth/authStore';


const CoachDetailPage = () => {

    const {id} = useParams<{id : string}>();
    const navigate = useNavigate();
    
    const userRole = useAuthStore((state) => state.role);
    const myEmail = useAuthStore((state) => state.email);

    const {data :coach, isLoading, isError} = useQuery({
        queryKey : ['coach', id],
        queryFn : () => coachService.getCoachById(id!),
        enabled : !!id, // Only run the query if we actually have an ID from the URL
    });

    if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm p-10 animate-pulse">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (isError || !coach) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#0B1628]">Antrenör bulunamadı.</h2>
        <p className="text-[#8A96A3] mt-2">Aradığın antrenör bulunamadı veya sistemden kaldırılmış olabilir.</p>
        <button onClick={() => navigate('/coaches')} className="mt-6 text-[#0D6E6E] font-semibold hover:underline">
          &larr; Antrenör Listesine Dön
        </button>
      </div>
    );
  }
  const isMyProfile = coach.email === myEmail;
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Navigation */}
        <button onClick={() => navigate('/coaches')} className="text-[#8A96A3] font-semibold hover:text-[#0B1628] mb-6 flex items-center transition">
          &larr; Antrenör Listesine Dön
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Decorative Cover Banner */}
          <div className="h-32 bg-[#0B1628] w-full relative">
            {/* We will eventually put a real CoverImage here if the backend supports it */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent"></div>
          </div>

          <div className="px-8 pb-8">
            {/* Header Section with Avatar */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-16 mb-8 gap-4">
              
              <div className="flex items-end gap-6 mt-6">
                {/* The "Image" Avatar */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full p-2 shadow-md relative z-10">
                  <div className="w-full h-full bg-[#0D6E6E] rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold font-display text-white">
                    {coach.fullName.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                <div className="pb-2">
                  <h1 className=" text-3xl font-display font-bold text-[#0B1628]">{coach.fullName}</h1>
                  <span className="inline-block bg-[#E8500A] bg-opacity-10 text-[#E8500A] px-3 py-1 rounded-md font-semibold mt-2">
                    {coach.sport}
                  </span>
                </div>
              </div>

              {/* Dynamic Action Buttons */}
              <div className="flex gap-3 pb-2">
                {/* If the user is a coach, show the edit button (Note: In the future, we will ensure it's ONLY their own profile) */}
                {userRole === 'Coach' && isMyProfile && (
                  <Link 
                    to="/coaches/profile/edit" 
                    className="px-5 py-2 border border-gray-300 text-[#3D4A5C] rounded-md font-semibold hover:bg-gray-50 transition"
                  >
                    Profili Düzenle
                  </Link>
                )}
                
                {
                  !isMyProfile && (
                    <button className="px-6 py-2 bg-[#0B1628] text-white rounded-md font-semibold hover:bg-[#0D6E6E] transition shadow-sm" >
                      Ders Paketlerini incele.
                    </button>
                  )
                }
              </div>

            </div>

            {/* Profile Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Left Column: Bio */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold text-[#0B1628] border-b border-gray-100 pb-2 mb-4">Hakkımda</h2>
                <div className="text-[#3D4A5C] leading-relaxed whitespace-pre-wrap">
                  {coach.bio && coach.bio !== "Not Specified" 
                    ? coach.bio 
                    : "İlgili antrenör henüz biyografi eklememiştir fakat koçluk yaparken size en iyi şekilde destek olmaya hazırdır!"}
                </div>
              </div>

              {/* Right Column: Stats & Info */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 h-fit">
                <h3 className="font-bold text-[#0B1628] mb-4 uppercase tracking-wide text-sm">Bilgiler</h3>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-[#8A96A3] mb-1">Saatlik Ücret</p>
                    <p className="font-bold text-[#0D6E6E] text-lg">₺{coach.hourlyRate}</p>
                  </div>
                  
                  <div>
                    <p className="text-[#8A96A3] mb-1">Deneyim</p>
                    <p className="font-semibold text-[#3D4A5C]">{coach.experience} Yıl</p>
                  </div>

                  <div>
                    <p className="text-[#8A96A3] mb-1">Konum</p>
                    <p className="font-semibold text-[#3D4A5C]">
                      {coach.location && coach.location !== "Not Specified" ? coach.location : "Remote / TBD"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#8A96A3] mb-1">Değerlendirme</p>
                    <div className="flex items-center gap-1 font-semibold text-[#3D4A5C]">
                      <span className="text-yellow-400">★</span> 
                      {coach.avarageRating > 0 ? coach.avarageRating.toFixed(1) : "New"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CoachDetailPage;
