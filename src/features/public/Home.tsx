import { Link } from 'react-router-dom';
import Footer from '../../components/Footer'; // Import the Footer!
import heroVideo from '../../assets/turkolimipiyatlar.mp4';

const Home = () => {
  return (
    // THE PARENT: h-screen, scrollable, and snap-mandatory
    <div className="w-full h-screen overflow-y-scroll snap-y snap-mandatory font-sans text-gray-900 scroll-smooth">
      
      {/* SECTION 1: THE HERO */}
      <section className="snap-start min-h-screen relative w-full flex items-end pb-20 pt-32 px-4 md:px-16 overflow-hidden">

        {/* 1. The Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* 2. The Dark Overlay (I used a gradient here for a cooler effect) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#062621] to-black/40 z-10"></div>

        <div className="grid md:grid-cols-2 gap-10 w-full max-w-7xl mx-auto relative z-20 mb-10">
          <div className="flex flex-col justify-end">
            <h1 className="text-5xl md:text-7xl font-semibold leading-tight tracking-tight mb-8 text-white">
            Sporunuzu özel antrenörle <br />  üst seviyeye taşıyın!
            </h1>
            <p className="text-lg md:text-xl font-light text-gray-200 max-w-md">
             Profesyonel antrenörlerle spor tutkunlar bir araya getiriyoruz.
            </p>
          </div>
          <div className="flex items-end justify-start md:justify-end">
            <Link to="/coaches" className="bg-[#0a3a32] hover:bg-[#062621] text-white px-8 py-6 flex items-center gap-4 transition duration-300 w-full md:w-auto">
              <span className="text-lg tracking-wide">Antrenörleri Keşfet!</span>
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-40 pointer-events-none z-0">
          <img src="https://images.unsplash.com/photo-1541252876598-a3f81e3a4e9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Sports" className="w-full h-full object-cover object-left" />
        </div>
      </section>

      {/* Section 2: Our Services */}
      <section className="snap-start min-h-screen flex flex-col justify-center py-24 px-4 md:px-16 max-w-7xl mx-auto bg-white">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl leading-snug">
            <span className="text-gray-400">Sporunuzu Bire Bir Antrenörlerle Özelleştirin</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1"><h3 className="text-3xl font-bold ">Antrenörlerimiz</h3></div>
          <div className="col-span-1 group cursor-pointer">
            <div className="aspect-square bg-gray-100 mb-6 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3" alt="1-on-1" className="w-full h-full object-cover group-hover:grayscale-0 transition duration-500" />
            </div>
            <p className="text-gray-500 flex items-center gap-2 uppercase tracking-wide text-sm">Bire Bir Antrenör <span>→</span></p>
          </div>
          <div className="col-span-1 group cursor-pointer">
            <div className="aspect-square bg-gray-100 mb-6 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3" alt="Group" className="w-full h-full  object-cover  grayscale group-hover:grayscale-0 transition duration-500" />
            </div>
            <p className="text-gray-500 flex items-center gap-2 uppercase tracking-wide text-sm">Grup Antrenmanları <span>→</span></p>
          </div>
          <div className="col-span-1 group cursor-pointer">
            <div className="aspect-square bg-gray-100 mb-6 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3" alt="Online" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500" />
            </div>
            <p className="text-gray-500 flex items-center gap-2 uppercase tracking-wide text-sm mb-6">Online Dersler <span>→</span></p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1"><h3 className="text-3xl font-bold">Ders Paketlerine Göz At!</h3></div>
          <div className="col-span-1 group cursor-pointer">
            <div className="aspect-square bg-gray-100 mb-6 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3" alt="1-on-1" className="w-full h-full object-cover group-hover:grayscale-0 transition duration-500" />
            </div>
            <p className="text-gray-500 flex items-center gap-2 uppercase tracking-wide text-sm">Bire Bir Antrenör <span>→</span></p>
          </div>
          <div className="col-span-1 group cursor-pointer">
            <div className="aspect-square bg-gray-100 mb-6 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3" alt="Group" className="w-full h-full  object-cover  grayscale group-hover:grayscale-0 transition duration-500" />
            </div>
            <p className="text-gray-500 flex items-center gap-2 uppercase tracking-wide text-sm">Grup Antrenmanları <span>→</span></p>
          </div>
          <div className="col-span-1 group cursor-pointer">
            <div className="aspect-square bg-gray-100 mb-6 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3" alt="Online" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500" />
            </div>
            <p className="text-gray-500 flex items-center gap-2 uppercase tracking-wide text-sm">Online Dersler <span>→</span></p>
          </div>
        </div>
      </section>

      {/* SECTION 3: STATS */}
      <section className="snap-start min-h-screen flex items-center py-24 px-4 md:px-16 max-w-7xl mx-auto w-full gap-16 bg-white">
        <div className="w-full md:w-1/2">
          <h2 className="text-4xl font-bold tracking-tight mb-16"><span className="text-gray-400">REAL RESULTS,</span><br />RECOGNIZED EXPERTISE</h2>
          <div className="grid grid-cols-2 gap-y-16 gap-x-8">
            <div className="border-l border-gray-300 pl-6"><p className="text-xs uppercase text-gray-500 mb-4">Sports Covered</p><p className="text-6xl font-medium">15+</p></div>
            <div className="border-l border-gray-300 pl-6"><p className="text-xs uppercase text-gray-500 mb-4">Lessons Booked</p><p className="text-6xl font-medium">12K</p></div>
            <div className="border-l border-gray-300 pl-6"><p className="text-xs uppercase text-gray-500 mb-4">Active Users</p><p className="text-6xl font-medium">1500</p></div>
            <div className="border-l border-gray-300 pl-6"><p className="text-xs uppercase text-gray-500 mb-4">Average Rating</p><p className="text-6xl font-medium">4.9/5</p></div>
          </div>
        </div>
        <div className="hidden md:block w-full md:w-1/2 h-[600px]">
          <img src="https://images.unsplash.com/photo-1526676037777-05a232554f77?ixlib=rb-4.0.3" alt="Coaching" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* SECTION 4: FOOTER (Now acts as the final snap point!) */}
      <div className="snap-start">
        <Footer />
      </div>

    </div>
  );
};

export default Home;