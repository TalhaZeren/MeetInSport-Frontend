import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { coachService } from '../../api/services/coachService';
import heroVideo from '../../assets/turkolimipiyatlar.mp4';

// --- DATA ---
const SERVICES = [
  { num: '01', name: 'Bire Bir Antrenör', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80' },
  { num: '02', name: 'Grup Antrenmanları', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80' },
  { num: '03', name: 'Online Dersler', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80' },
];

const TICKERS = ['Bire Bir Antrenörler', 'Grup Dersleri', 'Online Coaching', '15+ Spor Dalı', '12.000 Rezervasyon', '4.9 Ortalama Puan', 'İstanbul\'da ve Online'];

// --- CUSTOM ANIMATIONS ---
const customStyles = `
  .reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s ease-out; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .delay-100 { transition-delay: 100ms; }
  .delay-200 { transition-delay: 200ms; }
  .delay-300 { transition-delay: 300ms; }
  
  @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .animate-ticker { display: flex; width: max-content; animation: ticker 25s linear infinite; }
  
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  .text-shimmer {
    background: linear-gradient(90deg, #fff 0%, #C9A84C 50%, #fff 100%);
    background-size: 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4s linear infinite;
  }

  /* Slider için scrollbar gizleme */
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

export default function Home() {
  
  // Animasyonlar için Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full font-sans text-gray-900 bg-white overflow-x-hidden">
      <style>{customStyles}</style>

      <HeroSection />
      <TickerSection />
      <ServicesSection />
      <StatsSection />
      <CoachesSection />
      <CtaSection />
      
    </div>
  );
}

// ==========================================
// BİLEŞENLER
// ==========================================

const HeroSection = () => (
  <section className="relative min-h-screen flex items-end px-6 md:px-16 pb-24 overflow-hidden">
    <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
      <source src={heroVideo} type="video/mp4" />
    </video>
    
    <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#0B1628]/90 via-[#093A32]/60 to-[#0B1628]/80" />

    <div className="relative z-20 w-full max-w-7xl mx-auto">
      <p className="text-[#C9A84C] text-xs md:text-sm tracking-[0.25em] uppercase mb-6 flex items-center gap-3 animate-fade-in">
        <span className="w-8 h-[1px] bg-[#C9A84C]"></span> Türkiye'nin Antrenör Platformu
      </p>
      
      <h1 className="text-white text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-tight max-w-4xl reveal">
        Sporunuzu <em className="text-[#C9A84C] font-serif italic">özel</em> antrenörle üst seviyeye taşıyın
      </h1>
      
      <p className="text-white/80 text-lg md:text-xl font-light max-w-lg mt-8 mb-10 reveal delay-100">
        Profesyonel antrenörlerle spor tutkunlarını bir araya getiriyoruz. Hedefine giden en kısa yol.
      </p>
      
      <div className="flex flex-wrap gap-4 reveal delay-200">
        <Link to="/coaches" className="bg-[#C9A84C] text-[#0B1628] px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white transition-all duration-300 shadow-lg hover:shadow-[#C9A84C]/40 hover:-translate-y-1">
          Antrenörleri Keşfet
        </Link>
        <Link to="/register" className="border border-white/40 text-white px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300">
          Kayıt Ol
        </Link>
      </div>
    </div>
  </section>
);

const TickerSection = () => (
  <div className="bg-[#0B1628] py-4 border-y border-[#C9A84C]/20 overflow-hidden">
    <div className="animate-ticker">
      {[...TICKERS, ...TICKERS].map((text, i) => (
        <span key={i} className="flex items-center gap-6 px-8 text-xs tracking-widest uppercase text-white/50 whitespace-nowrap">
          <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
          {text}
        </span>
      ))}
    </div>
  </div>
);

const ServicesSection = () => (
  <section className="bg-[#F5F0E8] py-24 px-6 md:px-16">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div className="reveal">
          <p className="text-[#093A32] text-xs tracking-[0.2em] uppercase flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-[#093A32]"></span> Hizmetlerimiz
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0B1628] leading-tight">
            Spor tutkununu <span className="text-[#093A32]">profesyonel</span><br />bir antrenörle buluştur
          </h2>
        </div>
        <p className="text-gray-600 max-w-sm reveal delay-100">
          Bire bir derslerden online seanslara kadar ihtiyacına en uygun formatı seç. Her seviyeye uygun antrenörler seni bekliyor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        {SERVICES.map((service, i) => (
          <div key={i} className="group relative aspect-[3/4] bg-[#0B1628] overflow-hidden cursor-pointer reveal" style={{ transitionDelay: `${(i+1)*100}ms` }}>
            <img src={service.img} alt={service.name} className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#093A32]/90 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
            
            <div className="absolute bottom-0 left-0 p-8">
              <p className="text-[#C9A84C] text-xs tracking-widest uppercase mb-2">{service.num}</p>
              <h3 className="text-white font-serif text-2xl font-bold mb-3">{service.name}</h3>
              <span className="flex items-center gap-2 text-white/60 text-xs tracking-widest uppercase opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                İncele &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const StatsSection = () => (
  <section className="bg-[#0B1628] py-32 px-6 md:px-16 relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] md:text-[18rem] font-serif font-black text-white/5 whitespace-nowrap select-none pointer-events-none">
      STATS
    </div>

    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
      <div>
        <p className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase flex items-center gap-3 mb-6 reveal">
          <span className="w-6 h-[1px] bg-[#C9A84C]"></span> Rakamlarla Platform
        </p>
        <h2 className="text-white text-4xl md:text-5xl font-serif font-bold mb-12 reveal delay-100">
          Gerçek Sonuçlar, <em className="text-[#C9A84C] italic">Kanıtlanmış</em> Uzmanlık
        </h2>
        
        <div className="grid grid-cols-2 gap-[1px] bg-white/10 border border-white/10 reveal delay-200">
          {[
            { v: '15+', l: 'Spor Dalı' }, { v: '12K', l: 'Rezervasyon' },
            { v: '1500', l: 'Aktif Kullanıcı' }, { v: '4.9', l: 'Ortalama Puan' }
          ].map((stat, i) => (
            <div key={i} className="p-8 bg-[#0B1628] hover:bg-[#093A32]/40 transition-colors">
              <p className="text-4xl md:text-5xl font-serif font-black mb-2 text-shimmer">{stat.v}</p>
              <p className="text-white/40 text-xs tracking-widest uppercase">{stat.l}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="hidden lg:block h-[600px] border border-[#C9A84C]/30 p-2 reveal delay-300 relative group">
        <img src="kayaklikosu.png" alt="Stats" className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
      </div>
    </div>
  </section>
);

// DİNAMİK VE SLIDER'LI ANTRENÖRLER BÖLÜMÜ (HATA DÜZELTİLDİ)
const CoachesSection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const { data: coaches, isLoading } = useQuery({
    queryKey: ['coaches'],
    queryFn: coachService.getAllCoaches,
  });

  const slide = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white py-24 px-6 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="reveal">
            <p className="text-[#093A32] text-xs tracking-widest uppercase mb-4">Öne Çıkan Antrenörler</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0B1628]">
              Sana <em className="text-[#093A32] italic">özel</em> koçunu seç
            </h2>
          </div>
          
          <div className="flex items-center gap-4 reveal delay-100">
            <div className="flex gap-2">
              <button 
                onClick={() => slide('left')}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[#0B1628] hover:bg-[#093A32] hover:text-white hover:border-[#093A32] transition-colors"
              >
                &larr;
              </button>
              <button 
                onClick={() => slide('right')}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[#0B1628] hover:bg-[#093A32] hover:text-white hover:border-[#093A32] transition-colors"
              >
                &rarr;
              </button>
            </div>
            <Link to="/coaches" className="hidden md:block text-[#0B1628] font-bold border-b-2 border-[#C9A84C] pb-1 hover:text-[#093A32] transition-colors ml-4">
              Tümünü Gör
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((n) => (
              <div key={n} className="min-w-[300px] md:min-w-[350px] aspect-[3/4] bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        )}

        {!isLoading && coaches?.length === 0 && (
          <div className="py-20 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Henüz platformda antrenör bulunmuyor.</p>
          </div>
        )}

        {!isLoading && coaches && coaches.length > 0 && (
          <div 
            ref={sliderRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 pt-4 -mt-4 px-2 -mx-2"
          >
            {coaches.map((coach, i) => (
              <Link 
                to={`/coaches/${coach.id}`} 
                key={coach.id} 
                className="snap-start min-w-[85vw] sm:min-w-[350px] md:min-w-[380px] bg-[#F5F0E8] rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group reveal" 
                style={{ transitionDelay: `${(i % 5) * 100}ms` }}
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-[#0B1628]">
                  <div className="w-full h-full flex items-center justify-center text-7xl font-serif font-bold text-white/50 group-hover:scale-110 group-hover:text-white transition-all duration-500">
                    {coach.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <span className="absolute top-4 left-4 bg-[#093A32] text-white text-[10px] tracking-widest uppercase px-3 py-1 rounded shadow-md">
                    {coach.sport}
                  </span>
                </div>
                
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-[#0B1628] mb-1 group-hover:text-[#093A32] transition-colors">
                    {coach.fullName}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-1">
                    {coach.bio && coach.bio !== "Not Specified" ? coach.bio : "Profesyonel Antrenör"}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-[#C9A84C] font-bold text-sm flex items-center gap-1">
                      ★ {coach.avarageRating > 0 ? coach.avarageRating.toFixed(1) : "Yeni"}
                    </span>
                    <span className="text-[#093A32] font-bold text-sm">
                      ₺{coach.hourlyRate} <span className="text-xs text-gray-400 font-normal">/saat</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
           <Link to="/coaches" className="inline-block text-[#0B1628] font-bold border-b-2 border-[#C9A84C] pb-1">
             Tüm Antrenörleri Gör &rarr;
           </Link>
        </div>

      </div>
    </section>
  );
};

const CtaSection = () => (
  <section className="bg-[#093A32] py-24 px-6 text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(201,168,76,0.1)_0%,transparent_70%)]" />
    <div className="relative z-10 max-w-2xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-6 reveal">
        Hedefine giden yolda <br/><em className="text-[#C9A84C] italic">ilk adımı</em> at
      </h2>
      <p className="text-white/70 text-lg mb-10 reveal delay-100">
        Bugün kaydol, sana en uygun antrenörü bul ve limitlerini zorlamaya başla.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 reveal delay-200">
        <Link to="/register" className="bg-[#C9A84C] text-[#0B1628] px-8 py-4 font-bold tracking-widest uppercase hover:bg-white transition-all shadow-lg hover:-translate-y-1 rounded">
          Ücretsiz Başla
        </Link>
      </div>
    </div>
  </section>
);