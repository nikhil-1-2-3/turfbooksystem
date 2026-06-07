import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaRupeeSign, FaShieldAlt, FaCheckCircle, FaCalendarCheck, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { apiConnector } from '../services/apiConnector';
import { studentEndpoints } from '../services/apis';
import { toast } from 'react-hot-toast';

const { BOOK_OFFLINE_API } = studentEndpoints;

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { turfId } = useParams();
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);

    const [isProcessing, setIsProcessing] = useState(false);
    const [bookingToken, setBookingToken] = useState(null);

    // Get the state passed from Turf.jsx
    const { price, time, turfDetails, duration = 1, date, sport, equipment, equipmentTotal = 0 } = location.state || {};

    const formatTime12Hour = (timeStr) => {
        if (!timeStr) return '';
        const hour = parseInt(timeStr.split(':')[0], 10);
        const ampm = hour >= 12 && hour < 24 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:00 ${ampm}`;
    };

    useEffect(() => {
        // Protect the route from direct access without state
        if (!price || !time || !turfDetails || !token || !date) {
            navigate('/');
        }
    }, [price, time, turfDetails, token, date, navigate]);

    if (!turfDetails) return null;

    const handleConfirmPayment = async () => {
        if (!token) return navigate('/login');
        setIsProcessing(true);
        
        try {
            const response = await apiConnector("POST", BOOK_OFFLINE_API, {
                turf: turfId,
                amount: price,
                time: time,
                date: date,
                sport: sport,
                equipment: equipment,
                equipmentTotal: equipmentTotal
            }, {
                Authorisation: `Bearer ${token}`,
            });

            if (response.data.success) {
                toast.success("Booking Confirmed!");
                setBookingToken(response.data.bookingToken);
            }
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.message || error.message || "Booking Failed";
            toast.error(`Error: ${errMsg}`);
        } finally {
            setIsProcessing(false);
        }
    };

    if (bookingToken) {
        return (
            <div className="min-h-screen bg-slate-950 flex justify-center items-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="bg-slate-900 border border-emerald-500/50 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(16,185,129,0.15)]"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                        <FaTicketAlt />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2">Booking Confirmed!</h2>
                    <p className="text-slate-400 mb-8">Please take a screenshot of this ticket and show it to the Arena Admin upon arrival.</p>
                    
                    <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-8">
                        <p className="text-slate-500 text-sm mb-1 uppercase tracking-widest font-bold">Booking Token</p>
                        <p className="text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            {bookingToken}
                        </p>
                    </div>

                    <div className="text-left text-sm text-slate-400 space-y-3 mb-8">
                        <div className="flex justify-between border-b border-slate-800 pb-2">
                            <span>Arena</span> <strong className="text-white">{turfDetails.turfName}</strong>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-2">
                            <span>Date</span> <strong className="text-white">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-2">
                            <span>Time Slot</span> <strong className="text-white">{formatTime12Hour(time?.split(',')[0])} ({duration} hr)</strong>
                        </div>
                        <div className="flex justify-between">
                            <span>Amount to Pay at Arena</span> <strong className="text-emerald-400">₹{price}</strong>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/')}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all"
                    >
                        Return Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-24 selection:bg-turf-green/30 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[40vh] bg-blue-600/10 rounded-[100%] blur-[120px] pointer-events-none -z-10"></div>
            
            <div className="max-w-5xl mx-auto px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center md:text-left"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">Checkout</h1>
                    <p className="text-slate-400 text-lg font-light">Review your arena booking details before confirming.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl"
                        >
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <FaCheckCircle className="text-emerald-400" /> Booking Summary
                            </h2>
                            
                            <div className="flex flex-col sm:flex-row gap-6 mb-8 pb-8 border-b border-slate-800">
                                <div className="w-full sm:w-1/3 h-32 rounded-2xl overflow-hidden border border-slate-700 relative">
                                    <img src={turfDetails.image} alt="Turf Thumbnail" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <h3 className="text-2xl font-bold text-white mb-2">{turfDetails.turfName}</h3>
                                    <p className="text-slate-400 flex items-center gap-2 mb-1 text-sm">
                                        <FaMapMarkerAlt /> {turfDetails.address ? turfDetails.address : `${turfDetails.area}, ${turfDetails.city}`}
                                    </p>
                                    <p className="text-slate-400 flex items-center gap-2 text-sm">
                                        <FaCalendarCheck /> 
                                        <span className="text-white font-semibold">
                                            {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {formatTime12Hour(time?.split(',')[0])} ({duration} hr{duration > 1 ? 's' : ''})
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm font-medium">
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>Arena Base Price</span>
                                    <div className="flex items-center text-white">
                                        <FaRupeeSign className="text-xs" /> {price - equipmentTotal - 14}.00
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>Sport</span>
                                    <div className="flex items-center text-white font-bold text-emerald-400">
                                        {sport}
                                    </div>
                                </div>
                                {equipment?.length > 0 && (
                                    <div className="flex justify-between items-start text-slate-400">
                                        <span>Equipment Rental</span>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center text-white">
                                                <FaRupeeSign className="text-xs" /> {equipmentTotal}.00
                                            </div>
                                            <span className="text-xs text-slate-500 max-w-[150px] text-right mt-1">{equipment.join(', ')}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>Platform Processing Fee</span>
                                    <div className="flex items-center text-white">
                                        <FaRupeeSign className="text-xs" /> 14.00
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-800 text-lg">
                                    <span className="font-bold text-white">Total Amount</span>
                                    <div className="flex items-center font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 text-2xl">
                                        <span className="text-emerald-400 mr-1 text-xl">₹</span> {price}.00
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-5">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 sticky top-32"
                        >
                            <h3 className="text-xl font-bold text-white mb-6">Payment Method</h3>
                            
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between mb-8 ring-2 ring-emerald-500/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-400">
                                        <FaTicketAlt />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">Pay at Arena</p>
                                        <p className="text-xs text-slate-400">Generate Booking Token</p>
                                    </div>
                                </div>
                                <div className="w-5 h-5 rounded-full border-4 border-emerald-500 bg-slate-900"></div>
                            </div>

                            <button 
                                onClick={handleConfirmPayment}
                                disabled={isProcessing}
                                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {isProcessing ? 'Generating Token...' : 'Confirm Offline Booking'}
                            </button>
                            
                            <p className="text-center text-xs text-slate-500 mt-6 flex items-center justify-center gap-2">
                                <FaShieldAlt className="text-slate-600" /> Pay securely when you arrive
                            </p>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
