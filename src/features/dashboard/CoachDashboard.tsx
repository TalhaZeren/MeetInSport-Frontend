import { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../auth/authStore';
import { coachService } from '../../api/services/coachService';
import { lessonPackageService } from '../../api/services/lessonPackageService';
import { reservationService } from '../../api/services/reservationService';
import { calculateRemainingDays, formatDate } from '../../utils/dateUtils';
import AvatarUpload from '../../components/common/AvatarUpload';

const Icon = ({d, ...p} : any) => (
  <svg fill="none" stroke="currentColor" strokeWidth ="1.8" viewBox='0 0 24 24' strokeLinecap='round' strokeLinejoin='round' {...p} > 
  <path d = {d}/>
  </svg >
);



export default function CoachDashboard() {
 const {name} = useAuthStore();
 const [activeNav, setActiveNav] = useState('dashboard');
 const [resTab, setResTab] = useState('upcoming');
 const navigate = useNavigate();
 
 
 const {data : myProfile}  = useQuery({
  queryKey : ['my-coach-profile'],
  queryFn : coachService.getMyProfile,
 });


 const {data: packages = [] } = useQuery({
  queryKey : ['coach-packages' , myProfile?.id],
  queryFn  : () => lessonPackageService.getPackagesByCoachId(myProfile!.id),
  enabled : !!myProfile?.id,
 });
 
 const {data : reservations = []}  = useQuery({
    queryKey : ['my-reservations'],
    queryFn : reservationService.getMyReservations,
 });

 const queryClient = useQueryClient();

 const {mutate : confirmRes} = useMutation({
  mutationFn : reservationService.confirmReservation,
  onSuccess : () => {
    queryClient.invalidateQueries({queryKey : ['my-reservations']});
    alert('Rezervasyon başarıyla onaylandı ve onay, öğrenciye e-posta ile iletildi.')
  },
  onError: (error : any) => {
     alert(error.response?.data?.message || "Onaylama sırasında bir hata oluştu.");
  }
 });

 const {mutate : cancelRes} = useMutation({
  mutationFn : ({id, reason}: {id :string, reason: string}) => 
    reservationService.cancelReservation(id, {cancelReason: reason}),
  onSuccess : () =>{ 
    queryClient.invalidateQueries({queryKey: ['my-reservations']});
    alert("Rezervasyon reddedildi.");
  },
  onError : (error : any) => {
    alert(error.response?.data?.message || "Reddetme sırasında bir hata oluştu.")
  }
 });

 const handleConfirm = (id : string) => {
  if(window.confirm("Bu isteği onaylamak istediğinizden emin misiniz?")){
    confirmRes(id);
  }
 }
 const handleReject = (id : string) => {
  const reason = window.prompt("Rezervasyonu reddetme nedeninizi girin. (Öğrenciye iletilecektir.)");
  if(reason !== null){
    cancelRes({id,reason});
  }
 }


 const {mutate : deletePackage, isPending : isDeleting} = useMutation({
  mutationFn : lessonPackageService.deletePackage,
  onSuccess : () => {
    queryClient.invalidateQueries({queryKey : ['coach-packages', myProfile?.id ]});
    alert("Paket başaıyla silindi.")
  },
  onError : (error : any) => {
    alert(error.response?.data?.message || "Paket silinirken bir hata meydana geldi.");
  } 
 })

 const handleDeleteClick = (packageId : string) => {
  if (window.confirm("Paketi silmek istediğinize emin misiniz?")) {
    deletePackage(packageId);
  }
 }


const mapStatusToTab = (status : string) => {
  if(status === 'Pending' || status === 'Confirmed') return 'upcoming';
  if(status === 'Cancelled' || status === 'Refunded') return 'cancelled';
  return 'completed';
};

const filteredReservations = reservations.filter(r=> resTab === 'all' ? true : mapStatusToTab(r.status) === resTab);


const upcomingCount = reservations.filter(r => mapStatusToTab(r.status) === 'upcoming').length;

const navItems = [
    { id: 'dashboard', label: 'Genel Bakış', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'reservations', label: 'Rezervasyonlar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', badge: upcomingCount },
    { id: 'packages', label: 'Ders Paketleri', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'profile', label: 'Profilim', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <div className="db">
      <div className="db-layout">
        
        <aside className="db-sidebar">
          <div className="db-sidebar-logo"><span>Meet<em>InSport</em></span></div>
          <div className="db-coach-card">
            <div className="db-coach-avatar-wrap">
            
              <div className="w-[52px] h-[52px] bg-[#C9A84C] rounded-full border-2 border-[#C9A84C] flex items-center justify-center text-white font-bold text-xl">
                {name?.charAt(0).toUpperCase()}
              </div>
              <div className="db-online-dot" />
            </div>
            <div>
              <p className="db-coach-name">{name}</p>
              <p className="db-coach-sport">{myProfile?.sport || "Antrenör"}</p>
            </div>
          </div>

          <nav className="db-nav">
            <p className="db-nav-section">Menü</p>
            {navItems.map(item => (
              <div key={item.id} className={`db-nav-item ${activeNav === item.id ? 'active' : ''}`} onClick={() => setActiveNav(item.id)}>
                <Icon d={item.icon} />
                {item.label}
                {item.badge > 0 && <span className="badge">{item.badge}</span>}
              </div>
            ))}
           
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="db-main">
          <div className="db-topbar">
            <p className="db-topbar-title">Genel Bakış</p>
            <div className="db-topbar-right">
              <span className="db-topbar-date">{new Date().toLocaleDateString('tr-TR', { weekday:'long', day:'numeric', month:'long' })}</span>
            </div>
          </div>

          <div className="db-content">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
                    <AvatarUpload />
                    <div>
                        <h1 className="text-3xl font-bold text-[#0B1628] mb-2">Hoşgeldiniz, {name}!</h1>
                      
                    </div>
                </div>
            {/* STATS */}
            <div className="db-stats">
              <div className="stat-card">
                <div className="stat-card-accent" style={{ background: 'var(--gold)' }} />
                <p className="stat-label">Yaklaşan Ders</p>
                <p className="stat-value">{upcomingCount}</p>
                <p className="stat-sub">Sıradaki randevular</p>
              </div>
              <div className="stat-card">
                <div className="stat-card-accent" style={{ background: 'var(--forest)' }} />
                <p className="stat-label">Aktif Paket</p>
                <p className="stat-value">{packages.filter((p: any) => p.isActive).length}</p>
                <p className="stat-sub">Toplam {packages.length} paket</p>
              </div>
            </div>

            {/* RESERVATIONS SECTION */}
            {(activeNav === 'dashboard' || activeNav === 'reservations') && (
              <>
                <div className="db-section-header mt-8">
                  <h2 className="db-section-title">Ders Rezervasyonları</h2>
                </div>

                <div className="db-res-tabs">
                  {[{ id: 'upcoming', label: 'Yaklaşan' }, { id: 'completed', label: 'Tamamlanan' }, { id: 'cancelled', label: 'İptal' }, { id: 'all', label: 'Tümü' }].map(t => (
                    <button key={t.id} className={`db-tab ${resTab === t.id ? 'active' : ''}`} onClick={() => setResTab(t.id)}>
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="res-grid">
                  {filteredReservations.length === 0 && (
                    <div className="db-empty">Bu kategoride rezervasyon bulunmuyor.</div>
                  )}
                  
                  {filteredReservations.map((res: any) => {
                    const statusClass = mapStatusToTab(res.status);
                    const formatted = formatDate(res.scheduledAt);
                    const displayStudentName = res.studentName || 'Antrenör';
                    const displayPackageName = res.packageName || 'Ders Paketi';
                    
                    const daysLeft = calculateRemainingDays(res.expirationAt)
                    return (
                      <div key={res.id} className={`res-card ${statusClass} cursor-pointer hover:shadow-md transition-shadow`}
                      onClick={() => navigate(`/reservation/${res.id}`)}
                      >
                        <div className="res-card-top">
                          <div className="res-date-block">
                            <span className="res-time mr-3">{formatted.time}</span>
                            <span className="res-date font-bold">{formatted.date}</span>
                          </div>
                          <span className={`res-status ${statusClass}`}>{res.status}</span>
                        </div>
                        <div className="res-card-body">
                          <div className="res-student">
                             {/* Fallback avatar */}
                             <div className="w-[42px] h-[42px] bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                {displayStudentName.charAt(0).toUpperCase()}
                             </div>
                            <div>
                              {/* Assumes backend includes StudentName via Option A */}
                              <p className="res-student-name">{displayStudentName || "Öğrenci"}</p>
                              <p className="res-student-meta">Konum : {res.locationType === 'CoachLocation' ? 'Antrenör Konumu' : 
                              res.locationType === 'StudentLocation' ? 'Öğrenci Konumu' : res.locationType === 'Online' ? 'Online Oturum' : 'Bilinmiyor'}</p>
                            </div>

                            <div className="res-card-body">
                              {res.status === 'Pending' && (
                                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                      <button 
                                          onClick={() => handleConfirm(res.id)}
                                          className="flex-1 bg-[#093A32] text-white py-2 rounded text-xs font-bold hover:bg-[#062923] transition">
                                          ONAYLA
                                      </button>
                                      <button 
                                          onClick={() => handleReject(res.id)}
                                          className="flex-1 bg-red-50 text-red-600 border border-red-100 py-2 rounded text-xs font-bold hover:bg-red-100 transition">
                                          REDDET
                                      </button>
                                  </div>
                              )}
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
              </>
            )}
            {/* PACKAGES SECTION */}
            {(activeNav === 'dashboard' || activeNav === 'packages') && (
              <>
                <div className="db-section-header mt-8">
                  <h2 className="db-section-title">Ders Paketlerim</h2>
                  <Link to="/coaches/dashboard/create-package">
                   <button className="db-btn-sm db-btn-primary" style={{display:'inline-flex', alignItems:'center', gap:6, whiteSpace:'nowrap'}}>
                    <Icon d="M12 4v16m8-8H4" /> Yeni Paket
                  </button>
                  </Link>
                </div>
                
                {packages.length === 0 ? (
                  <div className="db-empty">Henüz paket oluşturmadınız.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {packages.map((pkg: any) => (
                      <div key={pkg.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                        
                        {/* Image & Status Area */}
                        <div className="relative h-48 bg-[#093A32]/10 flex items-center justify-center">
                          {pkg.coverImageUrl ? (
                            <img
                              src={pkg.coverImageUrl}
                              alt={pkg.packageName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Icon d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" className="w-12 h-12 text-[#093A32]/30" />
                          )}
                          
                          {/* Floating Active/Inactive Badge */}
                          <span className={`absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm ${pkg.isActive ? 'bg-[#093A32] text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {pkg.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                        
                        {/* Package Details Area */}
                        <div className="p-6 flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-[#0B1628]">{pkg.packageName}</h3>
                            <span className="bg-[#093A32]/10 text-[#093A32] font-bold px-2 py-1 rounded text-xs whitespace-nowrap ml-2">
                              {pkg.lessonModel === "OneOnOne" ? "Bireysel" : "Grup"}
                            </span>
                          </div>
                          
                          <p className="text-2xl font-black text-[#C9A84C] mb-4">₺{pkg.packagePrice}</p>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {pkg.packageDescription || "Açıklama bulunmuyor."}
                          </p>
                          
                          <div className="text-xs text-gray-500 space-y-2 font-medium">
                            <p>⏳ {pkg.durationInMinutes} Dakika / Oturum</p>
                            <p>📍 {pkg.locationType === 'CoachLocation' ? 'Antrenör Tesisi' : pkg.locationType === 'StudentLocation' ? 'Öğrenci Konumu' : pkg.locationType}</p>
                          </div>
                        </div>

                        {/* Dashboard Action Buttons */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                          <button 
                          onClick={() =>  navigate(`update-package/${pkg.id}`)}
                          className="flex-1 bg-white border border-gray-300 text-[#0B1628] py-2 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition">
                            Düzenle
                          </button>
                          <button 
                          onClick={() => handleDeleteClick(pkg.id)}
                          disabled = {isDeleting}
                          className="flex-1 bg-white border border-red-200 text-red-500 py-2 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-red-50 transition">
                            {isDeleting ? 'Siliniyor...' : 'Sil'}
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            

          </div>
        </main>
      </div>
    </div>
  );
  

}