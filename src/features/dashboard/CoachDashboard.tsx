import { useState } from 'react';
import { Link} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../auth/authStore';
import { coachService } from '../../api/services/coachService';
import { lessonPackageService } from '../../api/services/lessonPackageService';
import { reservationService } from '../../api/services/reservationService';


const Icon = ({d, ...p} : any) => (
  <svg fill="none" stroke="currentColor" strokeWidth ="1.8" viewBox='0 0 24 24' strokeLinecap='round' strokeLinejoin='round' {...p} > 
  <path d = {d}/>
  </svg >
);



export default function CoachDashboard() {
 const {name} = useAuthStore();
 const [activeNav, setActiveNav] = useState('dashboard');
 const [resTab, setResTab] = useState('upcoming');
 
 
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
                <div className="db-packages">
                  <table className="pkg-table">
                    <thead>
                      <tr>
                        <th>Paket Adı</th>
                        <th>Tür</th>
                        <th>Süre</th>
                        <th>Fiyat</th>
                        <th>Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packages.length === 0 && (
                        <tr><td colSpan={5} className="text-center text-gray-500">Henüz paket oluşturmadınız.</td></tr>
                      )}
                      {packages.map((pkg: any) => (
                        <tr key={pkg.id}>
                          <td><span className="pkg-name">{pkg.packageName}</span></td>
                          <td><span className="pkg-type-badge type-solo">{pkg.lessonModel}</span></td>
                          <td style={{ color: 'var(--muted)', fontSize: 13 }}>{pkg.durationInMinutes} dk</td>
                          <td><span className="pkg-price">₺{pkg.packagePrice}</span></td>
                          <td>
                             <span style={{ fontSize: 12, color: pkg.isActive ? 'var(--forest)' : 'var(--muted)' }}>
                              {pkg.isActive ? 'Aktif' : 'Pasif'}
                             </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

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
                    const dateObj = new Date(res.scheduleAt);
                    
                    return (
                      <div key={res.id} className={`res-card ${statusClass}`}>
                        <div className="res-card-top">
                          <div className="res-date-block">
                            <span className="res-date">{dateObj.toLocaleDateString('tr-TR')}</span>
                            <span className="res-time">{dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit' })}</span>
                          </div>
                          <span className={`res-status ${statusClass}`}>{res.status}</span>
                        </div>
                        <div className="res-card-body">
                          <div className="res-student">
                             {/* Fallback avatar */}
                             <div className="w-[42px] h-[42px] bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                S
                             </div>
                            <div>
                              {/* Assumes backend includes StudentName via Option A */}
                              <p className="res-student-name">{res.studentName || "Öğrenci"}</p>
                              <p className="res-student-meta">Konum: {res.locationType}</p>
                            </div>
                          </div>
                          <div className="res-pkg-row">
                            <p className="res-pkg-name">{res.packageName || "Ders Paketi"}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
  

}