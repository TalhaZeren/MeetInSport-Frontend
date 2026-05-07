import { useState } from 'react';
import { Link } from 'react-router-dom';

/* ─── MOCK DATA ────────────────────────────────────────────── */
const COACH = {
  name: 'Mert Kaya',
  sport: 'Fitness & Kişisel Antrenör',
  avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&q=80',
  rating: 4.9,
  totalStudents: 34,
  totalEarnings: '₺18.400',
};

const PACKAGES = [
  { id: 1, name: 'Başlangıç Paketi', sessions: 4, price: 1600, duration: '60 dk', type: 'Bire Bir', sold: 12, active: true },
  { id: 2, name: 'Haftalık Program', sessions: 8, price: 2800, duration: '60 dk', type: 'Bire Bir', sold: 8, active: true },
  { id: 3, name: 'Aylık Yoğun', sessions: 16, price: 4800, duration: '75 dk', type: 'Bire Bir', sold: 5, active: true },
  { id: 4, name: 'Grup Seansı', sessions: 6, price: 900, duration: '45 dk', type: 'Grup', sold: 20, active: false },
  { id: 5, name: 'Online Koçluk', sessions: 4, price: 1200, duration: '45 dk', type: 'Online', sold: 15, active: true },
];

const RESERVATIONS = [
  {
    id: 1, status: 'upcoming',
    date: '2026-05-10', time: '10:00',
    package: 'Haftalık Program',
    session: '3 / 8',
    student: { name: 'Ayşe Yılmaz', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', age: 26, level: 'Orta' },
  },
  {
    id: 2, status: 'upcoming',
    date: '2026-05-10', time: '12:30',
    package: 'Başlangıç Paketi',
    session: '1 / 4',
    student: { name: 'Emre Demir', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', age: 31, level: 'Başlangıç' },
  },
  {
    id: 3, status: 'upcoming',
    date: '2026-05-12', time: '09:00',
    package: 'Aylık Yoğun',
    session: '7 / 16',
    student: { name: 'Selin Çelik', avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&q=80', age: 24, level: 'İleri' },
  },
  {
    id: 4, status: 'completed',
    date: '2026-05-06', time: '11:00',
    package: 'Haftalık Program',
    session: '2 / 8',
    student: { name: 'Ayşe Yılmaz', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', age: 26, level: 'Orta' },
  },
  {
    id: 5, status: 'completed',
    date: '2026-05-05', time: '14:00',
    package: 'Online Koçluk',
    session: '4 / 4',
    student: { name: 'Kaan Arslan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', age: 29, level: 'Orta' },
  },
  {
    id: 6, status: 'cancelled',
    date: '2026-05-04', time: '16:00',
    package: 'Başlangıç Paketi',
    session: '2 / 4',
    student: { name: 'Zeynep Kurt', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', age: 22, level: 'Başlangıç' },
  },
];

/* ─── CSS ──────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:wght@300;400;500&display=swap');

  :root {
    --forest: rgb(9, 58, 50);
    --navy:   rgb(11, 22, 40);
    --gold:   #c9a84c;
    --cream:  #f4efe6;
    --muted:  #8a9aaa;
    --line:   rgba(11,22,40,0.08);
    --card:   #ffffff;
    --bg:     #f0ece4;
  }

  .db * { box-sizing: border-box; margin: 0; padding: 0; }
  .db {
    font-family: 'Instrument Sans', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    color: var(--navy);
    overflow-x: hidden;
  }

  /* ── LAYOUT ── */
  .db-layout { display: flex; min-height: 100vh; }

  /* ── SIDEBAR ── */
  .db-sidebar {
    width: 260px; flex-shrink: 0;
    background: var(--navy);
    display: flex; flex-direction: column;
    padding: 0;
    position: sticky; top: 0; height: 100vh;
    overflow-y: auto;
  }
  .db-sidebar-logo {
    padding: 32px 28px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .db-sidebar-logo span {
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 800;
    color: #fff; letter-spacing: -0.02em;
  }
  .db-sidebar-logo span em {
    font-style: normal; color: var(--gold);
  }
  .db-coach-card {
    padding: 24px 28px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; flex-direction: column; gap: 12px;
  }
  .db-coach-avatar-wrap { position: relative; width: 52px; }
  .db-coach-avatar {
    width: 52px; height: 52px; border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--gold);
  }
  .db-online-dot {
    position: absolute; bottom: 2px; right: 0;
    width: 10px; height: 10px; border-radius: 50%;
    background: #4ade80; border: 2px solid var(--navy);
  }
  .db-coach-name {
    font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 700; color: #fff;
  }
  .db-coach-sport { font-size: 12px; color: rgba(255,255,255,0.45); }
  .db-coach-rating {
    font-size: 12px; color: var(--gold); font-weight: 500;
  }

  .db-nav { padding: 16px 0; flex: 1; }
  .db-nav-section {
    padding: 8px 28px 4px;
    font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(255,255,255,0.25);
  }
  .db-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 28px;
    font-size: 14px; font-weight: 400;
    color: rgba(255,255,255,0.5);
    cursor: pointer; transition: all 0.2s ease;
    border-left: 2px solid transparent;
    user-select: none;
  }
  .db-nav-item svg { width: 16px; height: 16px; flex-shrink: 0; }
  .db-nav-item:hover { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.04); }
  .db-nav-item.active {
    color: #fff; border-left-color: var(--gold);
    background: rgba(201,168,76,0.08);
  }
  .db-nav-item .badge {
    margin-left: auto; background: var(--forest);
    color: #fff; font-size: 10px; font-weight: 600;
    padding: 2px 7px; border-radius: 99px;
  }

  .db-sidebar-footer {
    padding: 20px 28px;
    border-top: 1px solid rgba(255,255,255,0.07);
    font-size: 12px; color: rgba(255,255,255,0.3);
  }

  /* ── MAIN ── */
  .db-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

  /* ── TOPBAR ── */
  .db-topbar {
    background: #fff;
    padding: 0 40px;
    height: 64px; min-height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--line);
    position: sticky; top: 0; z-index: 10;
  }
  .db-topbar-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px; font-weight: 700; color: var(--navy);
  }
  .db-topbar-right { display: flex; align-items: center; gap: 16px; }
  .db-topbar-date {
    font-size: 13px; color: var(--muted);
  }
  .db-notif-btn {
    width: 36px; height: 36px; border-radius: 8px;
    border: 1px solid var(--line);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.2s; background: transparent;
    position: relative;
  }
  .db-notif-btn:hover { background: var(--bg); }
  .db-notif-btn svg { width: 16px; height: 16px; color: var(--navy); }
  .db-notif-dot {
    position: absolute; top: 6px; right: 6px;
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--gold); border: 1.5px solid #fff;
  }

  /* ── CONTENT ── */
  .db-content { padding: 36px 40px; flex: 1; }

  /* ── STAT CARDS ── */
  .db-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 36px; }
  .stat-card {
    background: var(--card);
    padding: 24px;
    border: 1px solid var(--line);
    position: relative; overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(11,22,40,0.08); }
  .stat-card-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
  }
  .stat-label { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 2rem; font-weight: 800; color: var(--navy); line-height: 1;
    margin-bottom: 6px;
  }
  .stat-sub { font-size: 12px; color: var(--muted); }
  .stat-icon {
    position: absolute; top: 20px; right: 20px;
    width: 36px; height: 36px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    opacity: 0.12;
  }
  .stat-icon svg { width: 20px; height: 20px; }

  /* ── SECTION HEADER ── */
  .db-section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
  }
  .db-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px; font-weight: 700; color: var(--navy);
    display: flex; align-items: center; gap: 10px;
  }
  .db-section-title::before {
    content: ''; width: 4px; height: 18px;
    background: var(--gold); display: block;
    border-radius: 2px;
  }
  .db-btn-sm {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; font-size: 13px; font-weight: 500;
    cursor: pointer; border: none; transition: all 0.2s;
    letter-spacing: 0.03em;
  }
  .db-btn-sm svg { width: 14px; height: 14px; }
  .db-btn-primary { background: var(--forest); color: #fff; }
  .db-btn-primary:hover { background: var(--navy); }
  .db-btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--line); }
  .db-btn-ghost:hover { border-color: var(--forest); color: var(--forest); background: rgba(9,58,50,0.05); }

  /* ── PACKAGES TABLE ── */
  .db-packages { background: var(--card); border: 1px solid var(--line); overflow: hidden; margin-bottom: 36px; }
  .pkg-table { width: 100%; border-collapse: collapse; }
  .pkg-table th {
    padding: 12px 20px; text-align: left;
    font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--muted); font-weight: 500;
    border-bottom: 1px solid var(--line);
    background: var(--bg);
  }
  .pkg-table td {
    padding: 16px 20px; font-size: 14px; color: var(--navy);
    border-bottom: 1px solid var(--line);
    vertical-align: middle;
  }
  .pkg-table tr:last-child td { border-bottom: none; }
  .pkg-table tbody tr { transition: background 0.15s; }
  .pkg-table tbody tr:hover { background: rgba(9,58,50,0.03); }
  .pkg-name { font-weight: 600; color: var(--navy); }
  .pkg-type-badge {
    display: inline-block; padding: 3px 10px;
    font-size: 11px; font-weight: 500; letter-spacing: 0.06em;
    border-radius: 2px;
  }
  .type-solo { background: rgba(9,58,50,0.1); color: var(--forest); }
  .type-group { background: rgba(11,22,40,0.08); color: var(--navy); }
  .type-online { background: rgba(201,168,76,0.15); color: #9a6f1a; }
  .pkg-price { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; }
  .pkg-status-toggle {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; cursor: pointer; user-select: none;
  }
  .toggle-track {
    width: 32px; height: 18px; border-radius: 99px;
    position: relative; transition: background 0.25s;
    flex-shrink: 0;
  }
  .toggle-track.on { background: var(--forest); }
  .toggle-track.off { background: #d0d5dd; }
  .toggle-thumb {
    position: absolute; top: 3px;
    width: 12px; height: 12px; border-radius: 50%;
    background: #fff; transition: left 0.25s;
  }
  .toggle-track.on .toggle-thumb { left: 17px; }
  .toggle-track.off .toggle-thumb { left: 3px; }
  .pkg-actions { display: flex; gap: 6px; }
  .pkg-action-btn {
    width: 30px; height: 30px; border-radius: 6px;
    border: 1px solid var(--line); background: transparent;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s; color: var(--muted);
  }
  .pkg-action-btn svg { width: 14px; height: 14px; }
  .pkg-action-btn:hover { border-color: var(--forest); color: var(--forest); background: rgba(9,58,50,0.05); }
  .pkg-sold { font-size: 13px; color: var(--muted); }
  .pkg-sold strong { color: var(--navy); }

  /* ── RESERVATIONS ── */
  .db-res-tabs { display: flex; gap: 4px; margin-bottom: 20px; }
  .db-tab {
    padding: 8px 20px; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
    border-radius: 4px; color: var(--muted); background: transparent;
    border: none; user-select: none;
  }
  .db-tab.active { background: var(--navy); color: #fff; }
  .db-tab:not(.active):hover { background: var(--line); color: var(--navy); }

  .res-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }

  .res-card {
    background: var(--card); border: 1px solid var(--line);
    overflow: hidden; transition: transform 0.25s, box-shadow 0.25s;
    cursor: pointer; position: relative;
  }
  .res-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(11,22,40,0.1); }
  .res-card-top {
    padding: 16px 18px 14px;
    border-bottom: 1px solid var(--line);
    display: flex; align-items: center; justify-content: space-between;
  }
  .res-date-block { display: flex; flex-direction: column; }
  .res-date { font-size: 11px; color: var(--muted); }
  .res-time {
    font-family: 'Syne', sans-serif;
    font-size: 22px; font-weight: 800; color: var(--navy); line-height: 1;
  }
  .res-status {
    font-size: 11px; font-weight: 600; padding: 4px 10px;
    letter-spacing: 0.08em; text-transform: uppercase; border-radius: 2px;
  }
  .res-status.upcoming { background: rgba(9,58,50,0.1); color: var(--forest); }
  .res-status.completed { background: rgba(11,22,40,0.06); color: var(--muted); }
  .res-status.cancelled { background: rgba(220,53,69,0.08); color: #dc3545; }

  .res-card-body { padding: 16px 18px; }
  .res-student { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .res-student-avatar {
    width: 42px; height: 42px; border-radius: 50%;
    object-fit: cover; flex-shrink: 0;
    border: 2px solid var(--line);
  }
  .res-student-name { font-size: 14px; font-weight: 600; color: var(--navy); }
  .res-student-meta { font-size: 12px; color: var(--muted); margin-top: 1px; }
  .res-level {
    display: inline-block; margin-left: 6px;
    font-size: 10px; padding: 1px 6px; border-radius: 2px;
    background: rgba(201,168,76,0.15); color: #9a6f1a;
  }

  .res-pkg-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px;
    background: var(--bg); border-radius: 4px;
  }
  .res-pkg-name { font-size: 13px; font-weight: 500; color: var(--navy); }
  .res-pkg-session { font-size: 12px; color: var(--muted); }
  .res-session-bar {
    width: 60px; height: 4px; background: var(--line); border-radius: 2px;
    overflow: hidden; margin-top: 4px;
  }
  .res-session-fill { height: 100%; background: var(--gold); border-radius: 2px; }

  .res-card-footer {
    padding: 12px 18px;
    border-top: 1px solid var(--line);
    display: flex; gap: 8px;
  }
  .res-action {
    flex: 1; padding: 8px; font-size: 12px; font-weight: 500;
    cursor: pointer; border: none; border-radius: 3px;
    transition: all 0.2s; letter-spacing: 0.04em;
    text-align: center;
  }
  .res-action.primary { background: var(--forest); color: #fff; }
  .res-action.primary:hover { background: var(--navy); }
  .res-action.ghost { background: transparent; border: 1px solid var(--line); color: var(--muted); }
  .res-action.ghost:hover { border-color: var(--forest); color: var(--forest); }

  /* ── UPCOMING INDICATOR ── */
  .res-card.upcoming::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px; background: var(--gold);
  }

  /* ── EMPTY STATE ── */
  .db-empty {
    text-align: center; padding: 60px 20px;
    color: var(--muted); font-size: 14px;
    background: var(--card); border: 1px solid var(--line);
    grid-column: 1 / -1;
  }
  .db-empty svg { width: 40px; height: 40px; margin: 0 auto 12px; opacity: 0.3; display: block; }

  @media (max-width: 1100px) {
    .db-stats { grid-template-columns: repeat(2, 1fr); }
    .db-sidebar { width: 220px; }
    .db-content { padding: 24px 24px; }
    .db-topbar { padding: 0 24px; }
  }
  @media (max-width: 768px) {
    .db-sidebar { display: none; }
    .db-stats { grid-template-columns: repeat(2, 1fr); }
  }
`;

/* ─── HELPERS ──────────────────────────────────────────────── */
function formatDate(d) {
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}
function sessionRatio(s) {
  const [a, b] = s.split('/').map(Number);
  return b ? (a / b) * 100 : 0;
}
function typeClass(t) {
  if (t === 'Bire Bir') return 'type-solo';
  if (t === 'Grup') return 'type-group';
  return 'type-online';
}

/* ─── ICON COMPONENTS ──────────────────────────────────────── */
const Icon = ({ d, ...p }) => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d={d} />
  </svg>
);

/* ─── MAIN COMPONENT ───────────────────────────────────────── */
export default function CoachDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [resTab, setResTab] = useState('upcoming');
  const [packages, setPackages] = useState(PACKAGES);

  const togglePackage = (id) =>
    setPackages(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));

  const filtered = RESERVATIONS.filter(r =>
    resTab === 'all' ? true : r.status === resTab
  );

  const upcomingCount = RESERVATIONS.filter(r => r.status === 'upcoming').length;

  const navItems = [
    { id: 'dashboard', label: 'Genel Bakış', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'reservations', label: 'Rezervasyonlar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', badge: upcomingCount },
    { id: 'packages', label: 'Ders Paketleri', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'students', label: 'Öğrencilerim', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'earnings', label: 'Kazançlar', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'profile', label: 'Profilim', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <div className="db">
      <style>{css}</style>
      <div className="db-layout">

        {/* ── SIDEBAR ── */}
        <aside className="db-sidebar">
          <div className="db-sidebar-logo">
            <span>Turkol<em>im</em></span>
          </div>

          <div className="db-coach-card">
            <div className="db-coach-avatar-wrap">
              <img src={COACH.avatar} alt={COACH.name} className="db-coach-avatar" />
              <div className="db-online-dot" />
            </div>
            <div>
              <p className="db-coach-name">{COACH.name}</p>
              <p className="db-coach-sport">{COACH.sport}</p>
              <p className="db-coach-rating">★ {COACH.rating} · {COACH.totalStudents} öğrenci</p>
            </div>
          </div>

          <nav className="db-nav">
            <p className="db-nav-section">Menü</p>
            {navItems.map(item => (
              <div
                key={item.id}
                className={`db-nav-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                <Icon d={item.icon} />
                {item.label}
                {item.badge ? <span className="badge">{item.badge}</span> : null}
              </div>
            ))}
          </nav>

          <div className="db-sidebar-footer">v1.0 · Antrenör Paneli</div>
        </aside>

        {/* ── MAIN ── */}
        <main className="db-main">
          {/* Topbar */}
          <div className="db-topbar">
            <p className="db-topbar-title">
              {activeNav === 'dashboard' && 'Genel Bakış'}
              {activeNav === 'reservations' && 'Rezervasyonlar'}
              {activeNav === 'packages' && 'Ders Paketleri'}
              {activeNav === 'students' && 'Öğrencilerim'}
              {activeNav === 'earnings' && 'Kazançlar'}
              {activeNav === 'profile' && 'Profilim'}
            </p>
            <div className="db-topbar-right">
              <span className="db-topbar-date">{new Date().toLocaleDateString('tr-TR', { weekday:'long', day:'numeric', month:'long' })}</span>
              <button className="db-notif-btn">
                <Icon d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                <div className="db-notif-dot" />
              </button>
            </div>
          </div>

          <div className="db-content">

            {/* ── STAT CARDS ── */}
            <div className="db-stats">
              {[
                { label: 'Toplam Kazanç', value: COACH.totalEarnings, sub: 'Bu ay', color: 'var(--forest)', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { label: 'Aktif Öğrenci', value: COACH.totalStudents, sub: '+3 bu hafta', color: 'var(--navy)', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
                { label: 'Yaklaşan Ders', value: upcomingCount, sub: 'Önümüzdeki 7 gün', color: 'var(--gold)', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { label: 'Aktif Paket', value: packages.filter(p => p.active).length, sub: `${packages.length} paketten`, color: '#7c5cbf', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
              ].map(s => (
                <div className="stat-card" key={s.label}>
                  <div className="stat-card-accent" style={{ background: s.color }} />
                  <div className="stat-icon" style={{ background: s.color }}>
                    <Icon d={s.icon} style={{ color: s.color, opacity: 1 }} />
                  </div>
                  <p className="stat-label">{s.label}</p>
                  <p className="stat-value">{s.value}</p>
                  <p className="stat-sub">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* ── PACKAGES ── */}
            <div className="db-section-header">
              <h2 className="db-section-title">Ders Paketlerim</h2>
              <Link to="/coaches/dashboard/create-package">
                <button className="db-btn-sm db-btn-primary">
                <Icon d="M12 4v16m8-8H4" />
                Yeni Paket
              </button>
              </Link>
            
            </div>

            <div className="db-packages" style={{ marginBottom: 36 }}>
              <table className="pkg-table">
                <thead>
                  <tr>
                    <th>Paket Adı</th>
                    <th>Tür</th>
                    <th>Seans / Süre</th>
                    <th>Fiyat</th>
                    <th>Satış</th>
                    <th>Durum</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map(pkg => (
                    <tr key={pkg.id}>
                      <td><span className="pkg-name">{pkg.name}</span></td>
                      <td>
                        <span className={`pkg-type-badge ${typeClass(pkg.type)}`}>{pkg.type}</span>
                      </td>
                      <td style={{ color: 'var(--muted)', fontSize: 13 }}>
                        {pkg.sessions} seans · {pkg.duration}
                      </td>
                      <td>
                        <span className="pkg-price">₺{pkg.price.toLocaleString('tr-TR')}</span>
                      </td>
                      <td>
                        <span className="pkg-sold"><strong>{pkg.sold}</strong> satış</span>
                      </td>
                      <td>
                        <div className="pkg-status-toggle" onClick={() => togglePackage(pkg.id)}>
                          <div className={`toggle-track ${pkg.active ? 'on' : 'off'}`}>
                            <div className="toggle-thumb" />
                          </div>
                          <span style={{ fontSize: 12, color: pkg.active ? 'var(--forest)' : 'var(--muted)' }}>
                            {pkg.active ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="pkg-actions">
                          <button className="pkg-action-btn" title="Düzenle">
                            <Icon d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </button>
                          <button className="pkg-action-btn" title="Kopyala">
                            <Icon d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── RESERVATIONS ── */}
            <div className="db-section-header">
              <h2 className="db-section-title">Ders Rezervasyonları</h2>
              <button className="db-btn-sm db-btn-ghost">
                <Icon d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                Filtrele
              </button>
            </div>

            <div className="db-res-tabs">
              {[
                { id: 'upcoming',  label: 'Yaklaşan' },
                { id: 'completed', label: 'Tamamlanan' },
                { id: 'cancelled', label: 'İptal' },
                { id: 'all',       label: 'Tümü' },
              ].map(t => (
                <button
                  key={t.id}
                  className={`db-tab ${resTab === t.id ? 'active' : ''}`}
                  onClick={() => setResTab(t.id)}
                >
                  {t.label}
                  {t.id !== 'all' && (
                    <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>
                      ({RESERVATIONS.filter(r => r.status === t.id).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="res-grid">
              {filtered.length === 0 && (
                <div className="db-empty">
                  <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  Bu kategoride rezervasyon bulunmuyor.
                </div>
              )}
              {filtered.map(res => {
                const ratio = sessionRatio(res.session);
                return (
                  <div key={res.id} className={`res-card ${res.status}`}>
                    {/* Top */}
                    <div className="res-card-top">
                      <div className="res-date-block">
                        <span className="res-date">{formatDate(res.date)}</span>
                        <span className="res-time">{res.time}</span>
                      </div>
                      <span className={`res-status ${res.status}`}>
                        {res.status === 'upcoming'  ? 'Yaklaşan'    : ''}
                        {res.status === 'completed' ? 'Tamamlandı'  : ''}
                        {res.status === 'cancelled' ? 'İptal'       : ''}
                      </span>
                    </div>
                    {/* Body */}
                    <div className="res-card-body">
                      {/* Student */}
                      <div className="res-student">
                        <img
                          src={res.student.avatar}
                          alt={res.student.name}
                          className="res-student-avatar"
                        />
                        <div>
                          <p className="res-student-name">{res.student.name}</p>
                          <p className="res-student-meta">
                            {res.student.age} yaş
                            <span className="res-level">{res.student.level}</span>
                          </p>
                        </div>
                      </div>
                      {/* Package */}
                      <div className="res-pkg-row">
                        <div>
                          <p className="res-pkg-name">{res.package}</p>
                          <div className="res-session-bar">
                            <div className="res-session-fill" style={{ width: `${ratio}%` }} />
                          </div>
                        </div>
                        <p className="res-pkg-session">Seans {res.session}</p>
                      </div>
                    </div>
                    {/* Footer */}
                    {res.status === 'upcoming' && (
                      <div className="res-card-footer">
                        <button className="res-action primary">Onayla</button>
                        <button className="res-action ghost">İptal</button>
                      </div>
                    )}
                    {res.status === 'completed' && (
                      <div className="res-card-footer">
                        <button className="res-action ghost" style={{ flex: 'none', width: '100%' }}>Not Ekle</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>{/* /db-content */}
        </main>
      </div>
    </div>
  );
}