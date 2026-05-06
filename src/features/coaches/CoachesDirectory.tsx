import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { coachService } from "../../api/services/coachService";


const CoachesDirectory = () =>{

    const { data: coaches, isLoading, isError} = useQuery({
        queryKey : ['coaches'], 
        queryFn : coachService.getAllCoaches,  
    });

return(

   <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
    
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl font-display font-bold text-[#0B1628] mb-4">
           Sana uygun antrenörleri keşfetmeye hazır mısın?
          </h1>
          <p className="text-lg text-[#8A96A3] max-w-2xl mx-auto">
           Antrenörlerimizin deneyimlerini, uzmanlık alanlarını ve kullanıcı yorumlarını keşfederek senin için en iyi eşleşmeyi bulabilirsin!
          </p>
        </div>

      {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-100 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-red-100">
            <p className="text-red-500 font-semibold"> Antrenörler yüklenemedi. Lütfen Tekrar deneyiniz.</p>
          </div>
        )}

        {/* Empty State (If database has no coaches yet) */}
        {!isLoading && !isError && coaches?.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">Henüz antrenör bulunamadı.</p>
          </div>
        )}

        {/* Success State: The Coaches Grid */}
        {!isLoading && !isError && coaches && coaches.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coaches.map((coach) => (
              <div 
                key={coach.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition duration-300 transform hover:-translate-y-1"
              >
                {/* Coach Header: Initial Avatar & Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-[#0B1628] text-white rounded-full flex items-center justify-center text-xl font-bold font-display">
                    {/* Grab the first letter of their name for the avatar */}
                    {coach.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1628] leading-tight">{coach.fullName}</h3>
                    <span className="inline-block bg-[#E8500A] bg-opacity-10 text-[#E8500A] text-xs px-2 py-1 rounded-md font-semibold mt-1">
                      {coach.sport}
                    </span>
                  </div>
                </div>

                {/* Coach Details */}
                <div className="flex-1">
                  <p className="text-sm text-[#8A96A3] line-clamp-3 mb-4">
                    {coach.bio && coach.bio !== "Not Specified" ? coach.bio : "Antrenör henüz biyografi eklememiştir fakat koçluk yaparken size en iyi şekilde destek olmaya hazırdır!"}
                  </p>
                
                  <div className="space-y-2 text-sm text-[#3D4A5C]">
                    <div className="flex justify-between">
                      <span className="font-medium">Deneyim:</span>
                      <span>{coach.experience} Deneyim Yıl:</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Eğitim Süresi:</span>
                      <span className="text-[#0D6E6E] font-bold">₺{coach.hourlyRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Lokasyon:</span>
                      <span className="truncate max-w-[120px]">{coach.location && coach.location !== "Not Specified" ? coach.location : "Remote / TBD"}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Link 
                  to={`/coaches/${coach.id}`} // We will build this detail page later!
                  className="mt-6 w-full text-center bg-gray-50 border border-gray-200 text-[#0B1628] py-2 rounded-md font-semibold hover:bg-[#0D6E6E] hover:text-white hover:border-[#0D6E6E] transition duration-300"
                >
                  Profile Görüntüle
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
);   
}

export default CoachesDirectory;