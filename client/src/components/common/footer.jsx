import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { FaTwitter, FaInstagram, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const Footer = () => {
  const { shownavbar } = useSelector((state) => state.search);

  if (!shownavbar) return null;

  return (
    <footer className="bg-slate-950 border-t border-slate-900 overflow-hidden relative pt-24 pb-12">
        {/* Subtle Ambient Background */}
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-turf-green/5 to-transparent pointer-events-none -z-10"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-turf-green/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
            
            {/* Top Section: CTA & Newsletter */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 border-b border-slate-800 pb-20">
                <div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                        Ready to hit <br /> the pitch?
                    </h2>
                    <p className="text-slate-400 text-lg mb-8 max-w-sm">
                        Join thousands of players and premium arenas already active on TurfXL.
                    </p>
                    <Link to="/signup">
                        <button className="px-8 py-3 bg-white text-slate-950 font-bold rounded-full hover:bg-turf-green hover:text-white transition-colors duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                            Start Booking Now
                        </button>
                    </Link>
                </div>

                <div className="flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-white mb-4">Stay updated</h3>
                    <p className="text-slate-400 mb-6">Get notified about new arenas and exclusive discounts in your city.</p>
                    <div className="flex gap-2">
                        <input 
                            type="email" 
                            placeholder="Enter your email address" 
                            className="bg-slate-900 border border-slate-800 text-white px-6 py-3 rounded-xl focus:outline-none focus:border-turf-green w-full transition-colors"
                        />
                        <button className="bg-turf-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Middle Section: Links Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-20">
                <div className="col-span-2 lg:col-span-2">
                    <div className="text-3xl font-black text-white tracking-tighter mb-6 flex items-center gap-1">
                        TurfXL<div className="w-2 h-2 rounded-full bg-turf-green mt-2"></div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-8">
                        The definitive platform for discovering and securing premium sporting facilities. Elevate your game today.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-turf-green hover:text-white transition-all">
                            <FaTwitter />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-turf-green hover:text-white transition-all">
                            <FaInstagram />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">Explore</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li><Link to="/" className="hover:text-turf-green transition-colors">Browse Arenas</Link></li>
                        <li><Link to="/" className="hover:text-turf-green transition-colors">Top Rated</Link></li>
                        <li><Link to="/" className="hover:text-turf-green transition-colors">New Additions</Link></li>
                        <li><Link to="/" className="hover:text-turf-green transition-colors">Tournaments</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">Company</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li><Link to="/about" className="hover:text-turf-green transition-colors">About Us</Link></li>
                        <li><Link to="/" className="hover:text-turf-green transition-colors">Careers</Link></li>
                        <li><Link to="/" className="hover:text-turf-green transition-colors">Press</Link></li>
                        <li><Link to="/contact" className="hover:text-turf-green transition-colors">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">Contact</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li className="flex items-center gap-3"><FaMapMarkerAlt className="text-turf-green"/> Surat, GJ</li>
                        <li className="flex items-center gap-3"><FaEnvelope className="text-turf-green"/> support@turfxl.com</li>
                        <li className="flex items-center gap-3"><FaPhoneAlt className="text-turf-green"/> +91 98765 43210</li>
                    </ul>
                </div>
            </div>

            {/* Bottom Section: Copyright */}
            <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <p>© {new Date().getFullYear()} TurfXL. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link to="/" className="hover:text-white transition-colors">Cookie Policy</Link>
                </div>
            </div>
            
        </div>
    </footer>
  );
};

export default Footer;