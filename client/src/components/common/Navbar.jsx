import React, { useEffect, useState } from 'react';
import { matchPath, useLocation, useNavigate, Link } from 'react-router-dom';
import { NavbarLinks } from "../../data/navbar-links";
import { useDispatch, useSelector } from 'react-redux';
import ProfileDropDown from '../core/auth/ProfileDropDown';
import { CiLocationOn, CiSearch } from "react-icons/ci";
import { setShownavbar, setshowlogo } from '../../slices/searchSlice';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from './MagneticButton';

const MobileMenuToggle = ({ isOpen, toggle }) => (
    <button onClick={toggle} className="relative z-50 flex flex-col justify-center items-center w-8 h-8 ml-2 group">
        <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'}`}></span>
        <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
        <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'}`}></span>
    </button>
);

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { token } = useSelector((state) => state.auth);
    const { shownavbar, showlogo2 } = useSelector((state) => state.search);

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const location = useLocation();

    const matchRoutes = (route) => {
        return matchPath({ path: route }, location.pathname);
    };

    useEffect(() => {
        if (location.pathname === "/") {
            dispatch(setshowlogo(true));
        } else {
            dispatch(setshowlogo(false));
        }
    }, [location.pathname, dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    const handleSearch = () => {
        navigate("/homeSearch");
        dispatch(setShownavbar(false));
    };

    return (
        <AnimatePresence>
            {shownavbar && (
                <motion.header
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`fixed top-0 w-full z-50 transition-all duration-500 border-b border-transparent ${
                        isScrolled ? 'glass-premium shadow-soft !border-slate-800/50' : 'bg-transparent'
                    }`}
                >
                    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl py-4 transition-all duration-500">
                        <div className="flex justify-between items-center gap-4">
                            
                            {/* Logo */}
                            <Link to='/' className={`flex items-center shrink-0 z-50 ${showlogo2 ? 'hidden sm:flex' : ''}`}>
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="text-2xl font-bold text-white tracking-tighter"
                                >
                                    TurfXL<span className="text-turf-green">.</span>
                                </motion.div>
                            </Link>

                            {/* Mobile Search & Controls (When logo is hidden on mobile) */}
                            {showlogo2 && (
                                <div className="sm:hidden flex-1 relative flex items-center gap-3 z-40">
                                    <div className="relative w-full group">
                                        <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-turf-green transition-colors" />
                                        <input 
                                            type="text" 
                                            onClick={handleSearch} 
                                            className="w-full py-2 pl-10 pr-4 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white outline-none focus:border-turf-green focus:bg-slate-900 transition-all shadow-sm" 
                                            placeholder="Search turfs..." 
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Desktop Search */}
                            {showlogo2 && (
                                <div className="hidden md:flex flex-1 max-w-sm relative group z-40">
                                    <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-turf-green transition-colors" />
                                    <input 
                                        type="text" 
                                        onClick={handleSearch} 
                                        className="w-full py-2 pl-12 pr-4 rounded-full bg-slate-800/50 border border-transparent hover:border-slate-700 text-sm text-white outline-none focus:border-slate-600 focus:bg-slate-900 transition-all duration-300" 
                                        placeholder="Search turfs, arenas..." 
                                    />
                                </div>
                            )}

                            {/* Desktop Navigation Links */}
                            <nav className="hidden lg:flex items-center justify-center flex-1 z-40">
                                <ul className="flex gap-1 p-1 bg-slate-800/50 rounded-full border border-slate-700/50 backdrop-blur-md">
                                    {NavbarLinks?.map((element, index) => {
                                        const isActive = matchRoutes(element?.path);
                                        return (
                                            <li 
                                                key={index} 
                                                className="relative"
                                                onMouseEnter={() => setHoveredIndex(index)}
                                                onMouseLeave={() => setHoveredIndex(null)}
                                            >
                                                <Link to={element?.path} className="relative block px-5 py-2">
                                                    <span className={`relative z-20 text-sm font-medium transition-colors duration-300 ${isActive ? 'text-slate-900' : 'text-slate-400 hover:text-white'}`}>
                                                        {element?.title}
                                                    </span>
                                                    {isActive && (
                                                        <motion.div 
                                                            layoutId="nav-active"
                                                            className="absolute inset-0 bg-white rounded-full z-10"
                                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                        />
                                                    )}
                                                    {hoveredIndex === index && !isActive && (
                                                        <motion.div 
                                                            layoutId="nav-hover"
                                                            className="absolute inset-0 bg-slate-700/50 rounded-full z-0"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                        />
                                                    )}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>

                            {/* Desktop Actions */}
                            <div className="hidden md:flex items-center gap-4 z-40 shrink-0">
                                <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                                    <CiLocationOn className="text-lg" />
                                    <span className="text-sm">Surat</span>
                                </div>
                                
                                {token === null ? (
                                    <div className="flex items-center gap-2">
                                        <Link to='/login'>
                                            <button className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-full hover:bg-slate-800">
                                                Log in
                                            </button>
                                        </Link>
                                        <Link to='/signup'>
                                            <MagneticButton className="px-6 py-2.5 text-sm font-semibold bg-turf-green text-white rounded-full shadow-lg shadow-turf-green/20 hover:bg-turf-neon transition-colors duration-300">
                                                Sign up
                                            </MagneticButton>
                                        </Link>
                                    </div>
                                ) : (
                                    <ProfileDropDown />
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <div className={`lg:hidden flex items-center z-50 ${showlogo2 && 'md:hidden'}`}>
                                <MobileMenuToggle isOpen={mobileMenuOpen} toggle={toggleMobileMenu} />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Drawer */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <>
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                                    onClick={toggleMobileMenu}
                                />
                                <motion.div
                                    initial={{ x: '100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '100%', transition: { ease: [0.16, 1, 0.3, 1], duration: 0.5 } }}
                                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                    className="fixed top-0 right-0 h-[100dvh] w-full max-w-sm bg-slate-950 border-l border-slate-800 shadow-2xl z-40 flex flex-col px-6 py-24"
                                >
                                    <div className="flex flex-col gap-6 flex-1">
                                        {NavbarLinks?.map((element, index) => {
                                            const isActive = matchRoutes(element?.path);
                                            return (
                                                <motion.div 
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 + (index * 0.1) }}
                                                    key={index}
                                                >
                                                    <Link 
                                                        to={element?.path} 
                                                        onClick={toggleMobileMenu} 
                                                        className={`text-3xl font-semibold tracking-tight transition-colors ${isActive ? 'text-turf-green' : 'text-white hover:text-turf-green'}`}
                                                    >
                                                        {element?.title}
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-auto border-t border-slate-800 pt-8 pb-8">
                                        {token === null ? (
                                            <div className="flex flex-col gap-4">
                                                <Link to='/login' onClick={toggleMobileMenu}>
                                                    <button className="w-full py-4 text-center text-lg font-medium bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-colors">
                                                        Log in
                                                    </button>
                                                </Link>
                                                <Link to='/signup' onClick={toggleMobileMenu}>
                                                    <button className="w-full py-4 text-center text-lg font-semibold bg-turf-green text-white rounded-2xl shadow-lg shadow-turf-green/20 hover:bg-turf-neon transition-colors">
                                                        Sign up
                                                    </button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center" onClick={toggleMobileMenu}>
                                                <ProfileDropDown />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </motion.header>
            )}
        </AnimatePresence>
    );
}
