import React, { useEffect, useState } from 'react';
import { fetchSpecificCityTurfs } from '../../../services/operation/TurfDetailsAPI';
import TurfCard from './TurfCard';

export default function TurfsSection() {
    const [turfs, setTurfs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTurfs = async () => {
            try {
                const data = { cityName: "Surat" };
                const result = await fetchSpecificCityTurfs(data);
                setTurfs(result);
            }
            catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTurfs();
    }, []);

    return (
        <section id="turfs-section" className="py-24 relative z-10 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-full shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-turf-green"></span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wider uppercase">Handpicked Arenas</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                            Premium Turfs in Surat
                        </h2>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                            Discover the highest quality playing surfaces. Meticulously maintained and ready for your next competitive match or casual game.
                        </p>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-4">
                        <button className="px-6 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                            View All Filters
                        </button>
                    </div>
                </div>
                
                {/* Turfs Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {[1, 2, 3, 4].map((skeleton) => (
                            <div key={skeleton} className="h-[420px] bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {turfs?.length > 0 ? (
                            turfs.map((turf, index) => (
                                <TurfCard key={index} turf={turf} index={index} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <span className="text-2xl">🏟️</span>
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Arenas Found</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm">We couldn't find any available turfs matching your criteria in Surat.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
