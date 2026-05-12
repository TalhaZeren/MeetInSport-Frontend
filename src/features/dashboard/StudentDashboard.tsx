import { useMemo, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../auth/authStore';
import { reservationService } from '../../api/services/reservationService';
import { coachService } from '../../api/services/coachService';
import { lessonPackageService } from '../../api/services/lessonPackageService';
import type { ReservationResponse } from '../../types';

const Icon = ({d, ...p}: any) => (
    <svg fill ="none" stroke="currentColor" strokeWidth="1.8" viewBox='0 0 24 24' strokeLinecap='round' strokeLinejoin='round' {...p}> <path d={d} /></svg> 
);

function formatDate(dateStr: string | undefined, locale = 'tr-TR') {
  if (!dateStr) return { date: '—', time: '' };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { date: '—', time: '' };
  return {
    date: d.toLocaleDateString(locale),
    time: d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
  };
}

export default function StudentDashboard (){
    const {name} = useAuthStore();
    
    const [resTab, setResTab] = useState('upcoming');


const {data : reservations = []} = useQuery({
    queryKey : ['my-reservation'],
    queryFn : reservationService.getMyReservations,
});

const uniqueCoachId = useMemo(
  () => [...new Set(reservations.map((r) => r.coachId).filter(Boolean))],
  [reservations], 
);
const uniquePackageId = useMemo(
  () => [...new Set(reservations.map((r) => r.packageId).filter(Boolean))],
  [reservations], 
);

const coachQueries = useQueries({
  queries : uniqueCoachId.map((id) => ({
    queryKey: ['coach' , id],
    queryFn : () => coachService.getCoachById(id),
    staleTime : 5 * 60 * 1000 ,
  })),
});
const packageQueries = useQueries({
  queries : uniquePackageId.map((id) => ({
    queryKey: ['package' , id],
    queryFn : () => lessonPackageService.getPackageById(id),
    staleTime : 5 * 60 * 1000,
  })),
});

const coachMap = useMemo(() => {
  const map : Record<string, string> = {};
  coachQueries.forEach((q,i) => {
    if(q.data) map[uniqueCoachId[i]] = q.data.fullName; 
});
return map;
}, [coachQueries,uniqueCoachId]);


const packageMap = useMemo(() => {
  const map : Record<string, string> = {}
  packageQueries.forEach((q,i) => {
    if(q.data) map[uniquePackageId[i]] = q.data.packageName;
  });
  return map; 
}, [packageQueries,uniquePackageId]);


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
            <div className="db-nav-item active"><Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> Rezervasyonlarım</div>
          </nav>
        </aside>

        <main className="db-main">
          <div className="db-topbar">
            <p className="db-topbar-title">Öğrenci Paneli</p>
          </div>

          <div className="db-content">
            <div className="db-section-header">
              <h2 className="db-section-title">Ders Rezervasyonlarım</h2>
            </div>

            <div className="db-res-tabs">
              {[{ id: 'upcoming', label: 'Yaklaşan' }, { id: 'completed', label: 'Geçmiş' }, { id: 'cancelled', label: 'İptal' }].map(t => (
                <button key={t.id} className={`db-tab ${resTab === t.id ? 'active' : ''}`} onClick={() => setResTab(t.id)}>{t.label}</button>
              ))}
            </div>

            <div className="res-grid">
              {filteredReservations.length === 0 && <div className="db-empty">Bu kategoride rezervasyon bulunmuyor.</div>}
              {filteredReservations.map((res: any) => {
                const statusClass = mapStatusToTab(res.status);
                const formatted  = formatDate(res.scheduledAt);
                const coachName = coachMap[res.coachId] ?? 'Yükleniyor...';
                const packageName = packageMap[res.packageId] ?? 'Yükleniyor...';
                return (
                  <div key={res.id} className={`res-card ${statusClass}`}>
                    <div className="res-card-top">
                      <div className="res-date-block">
                        <span className="res-date">{formatted.date}</span>
                        <span className="res-time">{formatted.time}</span>  
                      </div>
                      <span className={`res-status ${statusClass}`}>{res.status}</span>
                    </div>
                    <div className="res-card-body">
                      <div className="res-student">
                        <div className="w-[42px] h-[42px] bg-[#C9A84C] rounded-full flex items-center justify-center font-bold text-white">C</div>
                        <div>
                          <p className="res-student-name">{coachName}</p>
                          <p className="res-student-meta">{res.locationType}</p>
                        </div>
                      </div>
                      <div className="res-pkg-row">
                        <p className="res-pkg-name">{packageName}</p>
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
