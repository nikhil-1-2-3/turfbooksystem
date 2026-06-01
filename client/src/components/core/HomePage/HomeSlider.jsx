import React, { useEffect, useRef, useState } from 'react';
import MagneticButton from '../../common/MagneticButton';
import { BsArrowDown } from 'react-icons/bs';
import { motion } from 'framer-motion';

export default function HomeSlider() {
    const vantaRef = useRef(null);
    const [vantaEffect, setVantaEffect] = useState(null);

    useEffect(() => {
        // Only initialize if it hasn't been initialized and VANTA is loaded in the window
        if (!vantaEffect && window.VANTA) {
            setVantaEffect(
                window.VANTA.RINGS({
                    el: vantaRef.current,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: 0x426a15,
                    backgroundColor: 0x020617 // Slate 950 to match the dark theme
                })
            );
        }
        
        // Cleanup function to prevent memory leaks and duplicate canvases
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    return (
        <div ref={vantaRef} className="relative h-[100dvh] w-full overflow-hidden flex flex-col justify-center">
            
            {/* Deep gradient overlay to ensure text remains readable over the rings */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-0 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950 z-0 pointer-events-none"></div>

            {/* --- FOREGROUND CONTENT --- */}
            <div className="relative z-10 flex flex-col items-start justify-center px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto w-full text-left pt-16 h-full">
                
                {/* Soft blur pulsing badge with Entrance */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                        opacity: 1, 
                        y: 0,
                        boxShadow: ["0px 0px 0px rgba(34,197,94,0)", "0px 0px 30px rgba(34,197,94,0.2)", "0px 0px 0px rgba(34,197,94,0)"] 
                    }}
                    transition={{ 
                        opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                        y: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                        boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 } 
                    }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
                >
                    <motion.span 
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-turf-green"
                    />
                    <span className="text-xs font-medium text-slate-300 tracking-[0.2em] uppercase">The Standard for Booking</span>
                </motion.div>

                {/* Main Heading with floating elements nearby */}
                <div className="relative mb-6 py-2">
                    {/* Entrance Text Reveal */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        className="text-5xl md:text-7xl lg:text-[7.5rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 tracking-tighter leading-[1.05] relative z-10"
                        style={{ textShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                    >
                        Book the finest <br /> arenas in Surat.
                    </motion.h1>
                </div>
                
                <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                    className="text-lg md:text-xl text-slate-400 max-w-xl font-light leading-relaxed"
                >
                    Experience pristine pitches, premium facilities, and a completely seamless booking process designed for serious players.
                </motion.p>

                {/* Call to Actions with gentle pulsing */}
                <div className="mt-12 flex flex-col sm:flex-row gap-4 relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: [0, -5, 0] }}
                        transition={{ 
                            opacity: { duration: 0.8, delay: 0.6 },
                            y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.4 } 
                        }}
                    >
                        <MagneticButton 
                            onClick={() => {
                                document.getElementById('turfs-section')?.scrollIntoView({ behavior: 'smooth' });
                            }} 
                            className="px-8 py-4 bg-white text-slate-900 font-semibold text-base rounded-full shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            Explore Arenas
                            <BsArrowDown className="text-lg group-hover:translate-y-1 transition-transform" />
                        </MagneticButton>
                    </motion.div>
                    
                    <motion.button 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: [0, 5, 0] }}
                        transition={{ 
                            opacity: { duration: 0.8, delay: 0.7 },
                            y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 } 
                        }}
                        onClick={() => {}} 
                        className="px-8 py-4 bg-transparent border border-slate-700 hover:border-slate-500 text-white font-medium text-base rounded-full hover:bg-slate-800/50 transition-colors duration-300 backdrop-blur-sm"
                    >
                        Learn More
                    </motion.button>
                </div>
            </div>

            {/* Gradient Fade to next section */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-slate-950 to-transparent z-30 pointer-events-none"></div>
        </div>
    );
}
