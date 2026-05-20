import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../auth/authStore';
import { reservationService } from '../../api/services/reservationService';
import { formatDate, calculateRemainingDays } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import AvatarUpload from '../../components/common/AvatarUpload';


const Icon = ({d, ...p}: any) => (
    <svg fill ="none" stroke="currentColor" strokeWidth="1.8" viewBox='0 0 24 24' strokeLinecap='round' strokeLinejoin='round' {...p}> <path d={d} /></svg> 
);



export default function StudentDashboard (){
    const {name} = useAuthStore();
    const [resTab, setResTab] = useState('upcoming');
    const navigate = useNavigate();
  const {data : reservations = []} = useQuery({
    queryKey : ['my-reservation'],
    queryFn : reservationService.getMyReservations,
  });

const mapStatusToTab = (status : string) => {
    if(status === 'Pending' || status === 'Confirmed') return 'upcoming';
    if(status === 'Cancelled' || status === 'Refunded') return 'cancelled';
    return 'completed';
};

const filteredReservations = reservations.filter(r => 
    resTab === 'all' ? true : mapStatusToTab(r.status) === resTab 
);

return (
        <div className="db">
          <div className="db-layout">
            

            <aside className="db-sidebar">
              <div className="db-sidebar-logo"><span>Meet<em>InSport</em></span></div>
              <div className="db-coach-card">
                <div className="db-coach-avatar-wrap">
                  <div className="w-[52px] h-[52px] bg-[#093A32] rounded-full border-2 border-[#093A32] flex items-center justify-center text-white font-bold text-xl">
                    {name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <p className="db-coach-name">{name}</p>
                  <p className="db-coach-sport">Öğrenci</p>
                </div>
              </div>
              <nav className="db-nav">
                <div className="db-nav-item active">
                    <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> Rezervasyonlarım
                </div>
              
              </nav>
            </aside>
    
          
            <main className="db-main">
              <div className="db-topbar">
                <p className="db-topbar-title">Öğrenci Paneli</p>
              </div>
    
              <div className="db-content">
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
                    <AvatarUpload />
                    <div>
                        <h1 className="text-3xl font-bold text-[#0B1628] mb-2">Hoşgeldiniz, {name}! 🎓</h1>
                        <p className="text-[#8A96A3] text-lg">Bugün yeni bir şeyler öğrenmeye hazır mısınız?</p>
                    </div>
                </div>
                <div className="db-section-header">
                  <h2 className="db-section-title">Ders Rezervasyonlarım</h2>
                </div>
    
                <div className="db-res-tabs">
                  {[{ id: 'upcoming', label: 'Yaklaşan' }, { id: 'completed', label: 'Geçmiş' }, { id: 'cancelled', label: 'İptal' }].map(t => (
                    <button key={t.id} className={`db-tab ${resTab === t.id ? 'active' : ''}`} onClick={() => setResTab(t.id)}>
                        {t.label}
                    </button>
                  ))}
                </div>
    
                <div className="res-grid">
                  {filteredReservations.length === 0 && <div className="db-empty">Bu kategoride rezervasyon bulunmuyor.</div>}
                  
                  {filteredReservations.map((res: any) => {
                    const statusClass = mapStatusToTab(res.status);
                    const formatted = formatDate(res.scheduledAt);
                    
                    
                    const displayCoachName = res.coachName || 'Antrenör';
                    const displayPackageName = res.packageName || 'Ders Paketi';
                    
                    const daysLeft = calculateRemainingDays(res.expirationAt)
                    return (
                      <div key={res.id} className={`res-card ${statusClass} cursor-pointer hover:shadow-md transition-shadow`}
                      onClick={() => navigate(`/reservation/${res.id}`)}
                      >
                        <div className="res-card-top">
                          <div className="res-date-block">
                            <span className="res-time mr-3 ">{formatted.time}</span>  
                            <span className="res-date font-bold">{formatted.date}</span>
                          </div>
                          <span className={`res-status ${statusClass}`}>{res.status}</span>
                        </div>
                        <div className="res-card-body">
                          <div className="res-student">
                            <div className="w-[42px] h-[42px] bg-[#C9A84C] rounded-full flex items-center justify-center font-bold text-white">
                                {displayCoachName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="res-student-name">{displayCoachName}</p>
                              <p className='res-student-meta'>
                                {res.locationType === 'CoachLocation'
                                  ? 'Antrenör Konumu' 
                                  : res.locationType === 'StudentLocation'
                                  ? 'Öğrenci Konumu'
                                  : res.locationType === 'Online'
                                  ? 'Online Oturum'
                                  :res.locationType
                                }
                              </p>
                            </div>
                          </div>
                          <div className="res-pkg-row">
                            <p className="res-pkg-name">{displayPackageName}</p>
                          </div>
                          <br />
                          <div className="bg-[#093A32]/10 text-[#093A32] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                        ⏳ Kalan Süre: {daysLeft} Gün
                    </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </main>
          </div>
        </div>
      );
}
