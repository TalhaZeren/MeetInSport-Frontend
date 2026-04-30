import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#062621] text-gray-300 py-16 px-4 md:px-16 w-full mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-700 pb-12 mb-8">
        

        <div className="md:col-span-1 flex flex-col">
          <Link to="/" className="text-3xl font-bold text-white tracking-wider mb-6">
            MeetInSport
          </Link>
          <p className="text-sm font-light text-gray-400 leading-relaxed mb-6">
            Connecting passionate athletes with elite professional coaches. Elevate your game with specialized 1-on-1 and group training.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="md:col-span-1 flex flex-col">
          <h4 className="text-white font-semibold uppercase tracking-wider mb-6">Platform</h4>
          <div className="flex flex-col space-y-3 text-sm font-light">
            <Link to="/coaches" className="hover:text-white transition">Browse Coaches</Link>
            <Link to="/packages" className="hover:text-white transition">Lesson Packages</Link>
            <Link to="/register" className="hover:text-white transition">Become a Coach</Link>
            <Link to="/login" className="hover:text-white transition">Sign In</Link>
          </div>
        </div>

        {/* Column 3: Legal & Support */}
        <div className="md:col-span-1 flex flex-col">
          <h4 className="text-white font-semibold uppercase tracking-wider mb-6">Support</h4>
          <div className="flex flex-col space-y-3 text-sm font-light">
            <Link to="#" className="hover:text-white transition">FAQ</Link>
            <Link to="#" className="hover:text-white transition">Contact Us</Link>
            <Link to="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>

        {/* Column 4: Newsletter / Social */}
        <div className="md:col-span-1 flex flex-col">
          <h4 className="text-white font-semibold uppercase tracking-wider mb-6">Stay Updated</h4>
          <p className="text-sm font-light text-gray-400 mb-4">
            Subscribe to our newsletter for training tips and exclusive offers.
          </p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-[#0a3a32] text-white px-4 py-2 w-full outline-none border border-gray-600 focus:border-white transition"
            />
            <button className="bg-white text-[#062621] px-4 py-2 font-semibold hover:bg-gray-200 transition">
              OK
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Bar: Copyright */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs font-light text-gray-500">
        <p>&copy; {currentYear} MeetInSport. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          {/* Social Media Placeholders */}
          <Link to="#" className="hover:text-white transition uppercase tracking-widest">Instagram</Link>
          <Link to="#" className="hover:text-white transition uppercase tracking-widest">LinkedIn</Link>
          <Link to="#" className="hover:text-white transition uppercase tracking-widest">Twitter</Link>
        </div>
      </div>
    </footer>
    );
};

export default Footer;