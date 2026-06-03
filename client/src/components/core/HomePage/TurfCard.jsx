import React, { useEffect, useState } from 'react';
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

const TurfCard = ({ turf, index }) => {
    const [avgReviewCount, setAvgReviewCount] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [imgSrc, setImgSrc] = useState(turf?.image || '/images/turf.jpg');

    useEffect(() => {
        const count = GetAvgRating(turf.reviews);
        setAvgReviewCount(count);
    }, [turf]);

    const handleHover = (e) => {
      e.preventDefault();
      setIsHovered(!isHovered);
    };

    return (
        <div className="w-full relative z-30 group">
            <Link to={`/turfs/${turf._id}`} className="block w-full h-full outline-none">
                <div 
                    className="relative bg-white dark:bg-slate-900 rounded-3xl p-3 flex flex-col min-h-[400px] border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-elegant transition-all duration-300 ease-out"
                >
                    {/* Image Container */}
                    <div className="relative w-full h-[220px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10"></div>
                        <img
                            src={imgSrc}
                            alt={turf?.turfName || 'Turf thumbnail'}
                            onError={() => {
                                if (imgSrc !== '/images/turf.jpg') {
                                    setImgSrc('/images/turf.jpg');
                                }
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-0"
                        />
                        
                        {/* Favorite Button */}
                        <div className="absolute top-3 right-3 z-20">
                            <button 
                                onClick={handleHover} 
                                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/90 backdrop-blur-md border border-white/30 flex items-center justify-center transition-colors duration-300 shadow-sm group/btn"
                            >
                                {isHovered ? (
                                    <FaHeart className="text-lg text-red-500" />
                                ) : (
                                    <CiHeart className="text-xl text-white group-hover/btn:text-slate-900 stroke-[0.5]" />
                                )}
                            </button>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3 z-20">
                            <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-medium tracking-wide">
                                Available
                            </div>
                        </div>
                    </div>
                    
                    {/* Content Details */}
                    <div className="flex flex-col flex-grow pt-5 px-2 pb-2 relative z-20">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-extrabold text-turf-green tracking-tight line-clamp-1 pr-2 transition-colors">
                                {turf?.turfName}
                            </h3>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shrink-0">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{avgReviewCount > 0 ? avgReviewCount : "New"}</span>
                                <span className="text-yellow-500 text-xs">★</span>
                            </div>
                        </div>
                        
                        <div className="space-y-1.5 mb-6">
                            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2 line-clamp-1">
                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {turf.address ? turf.address : `${turf.area}, ${turf.city}`}
                            </p>
                            
                            {turf.contactNumber && (
                                <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2 line-clamp-1">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {turf.contactNumber}
                                </p>
                            )}
                        </div>
                        
                        {/* Footer area of card */}
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/50">
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                {turf?.reviews?.length || 0} Reviews
                            </span>
                            <span className="text-sm font-semibold text-turf-green flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                Book Now 
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default TurfCard;