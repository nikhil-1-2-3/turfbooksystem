import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiUsers, FiAward, FiMapPin } from 'react-icons/fi';

const stats = [
    { id: 1, label: "Active Members", value: "300+", icon: <FiUsers className="text-3xl text-turf-green" /> },
    { id: 2, label: "Premium Arenas", value: "20+", icon: <FiMapPin className="text-3xl text-turf-green" /> },
    { id: 3, label: "Matches Hosted", value: "50+", icon: <FiTarget className="text-3xl text-turf-green" /> },
    { id: 4, label: "Cities (More Loading...)", value: "2", icon: <FiAward className="text-3xl text-turf-green" /> }
];

const About = () => {
  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 overflow-hidden relative selection:bg-turf-green/30'>
        
        {/* Ambient Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-turf-green/10 rounded-[100%] blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vw] bg-turf-green/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-3xl"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-turf-green/30 bg-turf-green/10 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-turf-green animate-pulse"></span>
                    <span className="text-xs font-semibold text-turf-green tracking-wider uppercase">Our Story</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 tracking-tighter leading-tight mb-6">
                    Redefining how you <br /> book and play.
                </h1>
                <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-2xl">
                    We started TurfXL with a simple mission: to bridge the gap between passionate athletes and premium sports facilities. No more phone calls, no more double bookings. Just pure game time.
                </p>
            </motion.div>
        </section>

        {/* Cinematic Image Break */}
        <section className="w-full px-4 sm:px-8 lg:px-16 mx-auto mb-24">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="w-full h-[50vh] md:h-[70vh] rounded-3xl overflow-hidden relative group"
            >
                <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply z-10"></div>
                <img 
                    src="https://images.unsplash.com/photo-1518605368461-1ee7e161746f?q=80&w=2069&h=800&auto=format&fit=crop" 
                    alt="Premium Turf Action" 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[2s] ease-out"
                />
            </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-slate-800 bg-slate-900/50 mb-24">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x-0 md:divide-x divide-slate-800">
                    {stats.map((stat, idx) => (
                        <motion.div 
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="flex flex-col items-center text-center md:pl-8 first:pl-0"
                        >
                            <div className="mb-4 p-3 bg-slate-950 rounded-2xl shadow-soft border border-slate-800/50">
                                {stat.icon}
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">{stat.value}</h3>
                            <p className="text-sm text-slate-400 uppercase tracking-widest font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* Mission & Vision Split */}
        <section className="px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto mb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Built for athletes, <br/> by athletes.</h2>
                    <div className="space-y-6 text-slate-400 text-lg font-light leading-relaxed">
                        <p>
                            We know the frustration of coordinating a match. Finding an available turf, managing the payments, and gathering the squad shouldn't be harder than the game itself.
                        </p>
                        <p>
                            Our platform was engineered to eliminate friction. With real-time availability, instant booking confirmations, and a curated list of strictly premium arenas, we ensure that your focus remains entirely on the pitch.
                        </p>
                    </div>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-turf-green/20 to-transparent blur-2xl -z-10 rounded-full"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1000&h=800&auto=format&fit=crop" 
                        alt="Stadium Lights" 
                        className="rounded-3xl border border-slate-800 shadow-2xl"
                    />
                </motion.div>
            </div>
        </section>

    </div>
  )
}

export default About