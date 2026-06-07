import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { getFullDetailsOfTurf } from '../services/operation/TurfDetailsAPI';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import RatingStars from '../components/common/RatingStars';
import GetAvgRating from '../utils/avgRating';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { BsGlobe } from 'react-icons/bs';
import { FaShareSquare } from 'react-icons/fa';
import { ACCOUNT_TYPE } from '../utils/constants';
import { FaRupeeSign } from "react-icons/fa";
import { setTime } from '../slices/paymenySlice';
import Spinner from '../components/common/spinner/Spinner';
import { MdSportsCricket, MdSportsSoccer, MdSportsTennis, MdTimer } from 'react-icons/md';
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4050/api/v1';
const SOCKET_URL = BASE_URL.replace('/api/v1', '');

const SPORTS_DATA = {
    Cricket: [
        { name: 'Cricket Kit', price: 300 },
        { name: 'Balls', price: 50 },
        { name: 'Shoes', price: 100 }
    ],
    Football: [
        { name: 'Football', price: 100 },
        { name: 'Shoes', price: 100 },
        { name: 'Bibs', price: 50 }
    ],
    Badminton: [
        { name: 'Rackets', price: 150 },
        { name: 'Shuttlecocks', price: 50 },
        { name: 'Shoes', price: 100 }
    ]
};

const Turf = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { turfId } = useParams();

    const [turfDetails, setTurfDetail] = useState(null);
    const [avgReviewCount, setAvgReviewCount] = useState(0);
    const [timePrices, setTimePrice] = useState([]);
    const [price, setPrice] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const { time } = useSelector((state) => state.payment);
    const [loading, setloading] = useState(false);
    const [booked , setBooked] = useState(null);
    const [duration, setDuration] = useState(1);
    
    // Default to today's date in local time
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);

    const [selectedSport, setSelectedSport] = useState(null);
    const [selectedEquipment, setSelectedEquipment] = useState([]);
    
    // WebSockets States
    const [socket, setSocket] = useState(null);
    const [lockedSlots, setLockedSlots] = useState([]);
    const [myLockTimer, setMyLockTimer] = useState(null);

    // Initialize Socket
    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    // Handle Socket Events
    useEffect(() => {
        if (socket && turfId && selectedDate) {
            socket.emit("join_turf", { turfId, date: selectedDate });
            
            socket.on("initial_locks", (locks) => setLockedSlots(locks));
            
            socket.on("slot_locked", ({ time: lockedTime }) => {
                setLockedSlots(prev => [...prev, lockedTime]);
            });
            
            socket.on("slot_unlocked", ({ time: unlockedTime }) => {
                setLockedSlots(prev => prev.filter(t => t !== unlockedTime));
                // if it was my slot
                if (time === unlockedTime) {
                    toast.error("Your slot lock expired!");
                    setPrice(null);
                    setActiveIndex(null);
                    setMyLockTimer(null);
                    dispatch(setTime(null));
                }
            });
            
            socket.on("lock_error", ({ message }) => {
                toast.error(message);
            });
        }
        
        return () => {
            if (socket) {
                socket.off("initial_locks");
                socket.off("slot_locked");
                socket.off("slot_unlocked");
                socket.off("lock_error");
            }
        }
    }, [socket, turfId, selectedDate, time]);

    // Countdown timer
    useEffect(() => {
        let interval;
        if (myLockTimer > 0) {
            interval = setInterval(() => {
                setMyLockTimer(prev => prev - 1);
            }, 1000);
        } else if (myLockTimer === 0) {
            setMyLockTimer(null);
        }
        return () => clearInterval(interval);
    }, [myLockTimer]);

    const equipmentTotal = selectedEquipment.reduce((acc, item) => acc + item.price, 0);

    const handleEquipmentToggle = (item) => {
        setSelectedEquipment((prev) => {
            const isSelected = prev.some((eq) => eq.name === item.name);
            if (isSelected) {
                return prev.filter((eq) => eq.name !== item.name);
            } else {
                return [...prev, item];
            }
        });
    };

    const formatTime12Hour = (timeStr) => {
        if (!timeStr) return '';
        const hour = parseInt(timeStr.split(':')[0], 10);
        const ampm = hour >= 12 && hour < 24 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:00 ${ampm}`;
    };


    const handelPayment = () => {
        if (token) {

            if(ACCOUNT_TYPE.OWNER === user?.accountType){
                return toast.error("The owner cannot book the turf.!")
            }

            if(time){
                // We rely on backend validation for past times.
                // It already marks past slots as booked=1.
            }

            if(booked===1){
                return toast.error("Turf Already Booked For Given Time");
            }
            if (!selectedSport) {
                return toast.error("Please select a sport to play");
            }
            if (!price) {
                toast.error("Please select the time");
                return;
            }
            if (time && price && selectedSport) {
                // Check contiguous availability
                let selectedTimes = [];
                let isAvailable = true;
                let calculatedPrice = 0;
                
                for(let i=0; i<duration; i++) {
                    const slot = timePrices[activeIndex + i];
                    if(!slot || slot.booked === 1) {
                        isAvailable = false;
                        break;
                    }
                    selectedTimes.push(slot.time);
                    calculatedPrice += parseInt(slot.price);
                }

                if(!isAvailable) {
                    return toast.error("Not enough contiguous available slots for this duration!");
                }

                navigate(`/checkout/${turfId}`, { 
                    state: { 
                        price: calculatedPrice + equipmentTotal + 14, 
                        time: selectedTimes.join(','), 
                        turfDetails, 
                        duration, 
                        date: selectedDate,
                        sport: selectedSport,
                        equipment: selectedEquipment.map(e => e.name),
                        equipmentTotal: equipmentTotal
                    } 
                });
            }
        }
        else {
            navigate('/login');
        }
    }

    useEffect(() => {
        const getTurfDetails = async () => {
            setloading(true);
            const response = await getFullDetailsOfTurf(turfId, selectedDate);
            console.log("getCourseDetails -> response", response);
            
            if (response?.turfDetails?.priceTime?.data) {
                setTimePrice(response.turfDetails.priceTime.data);
                setTurfDetail(response.turfDetails);
            }
            
            setPrice(null);
            setActiveIndex(null);
            setloading(false);
        }
        getTurfDetails();
    }, [turfId, selectedDate]);

    useEffect(() => {
        if (turfDetails?.reviews?.length > 0) {
            const count = GetAvgRating(turfDetails?.reviews);
            setAvgReviewCount(count);
            console.log("getCourseDetails -> count", parseInt(count));
        }
        console.log("turfDetails: ", turfDetails);
    }, [turfDetails?.reviews]);

    const timeHandler = (timePrice, index) => {

        if(timePrice.booked===1 || lockedSlots.includes(timePrice.time)){
            return; // do not allow selection if booked or locked
        }
        
        // Unlock previously selected slot if any
        if (time && socket) {
            socket.emit("unlock_slot", { turfId, date: selectedDate, time });
        }

        setBooked(null);
        setPrice(timePrice.price);
        setActiveIndex(index);
        setDuration(1); // Reset duration on new slot pick

        dispatch(setTime(timePrice.time));
        
        // Lock the new slot
        if (socket) {
            socket.emit("lock_slot", { turfId, date: selectedDate, time: timePrice.time });
            setMyLockTimer(300); // 5 mins
        }
    }



    if (!turfDetails) return <div className='flex justify-center items-center h-screen bg-slate-900'>
        <Spinner></Spinner>
    </div>

    return (
        <div className="bg-slate-900 min-h-screen pb-16">

            {
                loading ? (<div className="h-screen flex items-center justify-center"><Spinner></Spinner></div>) : (<>
                    <div className='w-full relative flex flex-col lg:flex-row max-w-7xl mx-auto pt-6 px-4 gap-8'>
                        
                        {/* Main Content Area */}
                        <div className='w-full lg:w-2/3 flex flex-col gap-6'>

                            {/* Hero Image Section */}
                            <div className='relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-800 group'>
                                <div className='absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10'></div>
                                <img src={turfDetails?.image} className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' alt="course img" />
                                
                                <div className='absolute right-4 top-4 z-20'>
                                    <button className='flex items-center gap-2 px-4 py-2 bg-slate-900/60 backdrop-blur-md rounded-full border border-slate-700 hover:bg-slate-800 transition-colors text-white' onClick={
                                        () => {
                                            navigator.clipboard.writeText(window.location.href);
                                            toast.success('URL copied to clipboard');
                                        }
                                    }>
                                        <FaShareSquare className='text-lg text-blue-400' />
                                        <span className='hidden md:block font-medium'>Share</span>
                                    </button>
                                </div>

                                {/* Title Overlay */}
                                <div className="absolute bottom-6 left-6 z-20 max-w-2xl">
                                    <h1 className='text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 drop-shadow-lg mb-2'>{turfDetails?.turfName}</h1>
                                    <p className="text-slate-300 text-lg flex items-center gap-2">📍 {turfDetails?.address ? turfDetails.address : `${turfDetails?.area}, ${turfDetails?.city}`}</p>
                                    {turfDetails?.contactNumber && (
                                        <p className="text-slate-300 font-medium text-lg flex items-center gap-2 mt-1">📞 {turfDetails.contactNumber}</p>
                                    )}
                                </div>
                            </div>



                            {/* Turf Details Box */}
                            <div className='bg-[#111827] rounded-3xl p-6 md:p-8 border border-slate-700 shadow-xl'>
                                <h2 className="text-2xl font-bold text-white mb-4">About this Turf</h2>
                                <p className='text-slate-300 leading-relaxed mb-6'>{turfDetails?.turfShortDesc}</p>
                                
                                <div className='flex flex-wrap items-center gap-6 border-t border-slate-700/50 pt-6'>
                                    <div className='flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-700/50'>
                                        <span className='text-yellow-400 font-bold'>{avgReviewCount || 0}</span>
                                        <RatingStars Review_Count={avgReviewCount} />
                                        <span className='text-slate-400 text-sm'>({turfDetails?.reviews?.length} Reviews)</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-slate-300 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-700/50">
                                        <span className="font-semibold text-white">Owner:</span> {turfDetails?.owner?.firstName} {turfDetails?.owner?.lastName}
                                    </div>
                                </div>
                                
                                <div className='flex flex-wrap gap-4 mt-6 text-sm text-slate-400'>
                                    <div className='flex items-center gap-2'>
                                        <AiOutlineInfoCircle className='text-xl text-blue-400' />
                                        <p>Listed on {new Date(turfDetails?.createdAt || turfDetails?.updatedAt).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric',
                                        })}</p>
                                    </div>
                                </div>
                            </div>

                        </div>


                        {/* Booking Widget Sidebar */}
                        <div className='w-full lg:w-1/3'>
                            <div className='sticky top-[100px] bg-[#111827] rounded-3xl p-6 border border-slate-700 shadow-2xl flex flex-col'>
                                
                                <div className='mb-6'>
                                    <h3 className='text-xl font-bold text-white mb-2'>Select a Date & Time</h3>
                                    <p className='text-slate-400 text-sm mb-4'>Choose your preferred date and time to book the arena.</p>
                                    
                                    <input 
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors mb-4 cursor-pointer"
                                    />
                                </div>

                                {/* time slots */}
                                <div className='grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3 mb-8'>
                                    {
                                        timePrices && (
                                            timePrices.map((timePrice, index) => {
                                                const isLocked = lockedSlots.includes(timePrice.time);
                                                const isMySelection = index === activeIndex;
                                                
                                                return (
                                                <div key={index} onClick={() => timeHandler(timePrice, index)} 
                                                    className={`
                                                        flex justify-center items-center py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-sm font-bold shadow-sm 
                                                        ${isMySelection ? "bg-gradient-to-r from-blue-500 to-purple-600 border-transparent text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:-translate-y-1" : ""} 
                                                        ${timePrice?.booked === 1 ? "border-slate-700 bg-slate-800/50 text-slate-500 opacity-50 cursor-not-allowed" : ""}
                                                        ${isLocked && !isMySelection ? "border-amber-500/50 bg-amber-500/10 text-amber-500 cursor-not-allowed" : ""}
                                                        ${!isMySelection && timePrice?.booked !== 1 && (!isLocked || isMySelection) ? "border-slate-600 text-slate-300 hover:border-blue-400 hover:text-blue-400 bg-slate-900/50 hover:-translate-y-1" : ""}
                                                    `}>
                                                    <div className="flex flex-col items-center">
                                                        <p className="font-semibold tracking-wide text-[13px]">{formatTime12Hour(timePrice.time)}</p>
                                                        {isLocked && !isMySelection && <span className="text-[9px] uppercase tracking-widest mt-1 opacity-80">Reserved</span>}
                                                    </div>
                                                </div>
                                            )})
                                        )
                                    }
                                </div>
                                
                                {myLockTimer !== null && price && (
                                    <div className="mb-6 bg-amber-500/10 border border-amber-500/50 rounded-xl p-3 flex items-center justify-between animate-pulse">
                                        <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
                                            <MdTimer className="text-xl" /> Slot locked for you
                                        </div>
                                        <div className="text-amber-400 font-mono font-bold">
                                            {Math.floor(myLockTimer / 60)}:{(myLockTimer % 60).toString().padStart(2, '0')}
                                        </div>
                                    </div>
                                )}

                                {/* Sport Selection */}
                                <div className='mb-6'>
                                    <h3 className='text-xl font-bold text-white mb-2'>What to play?</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button 
                                            onClick={() => { setSelectedSport('Cricket'); setSelectedEquipment([]); }}
                                            className={`flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all duration-200 ${selectedSport === 'Cricket' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500'}`}
                                        >
                                            <MdSportsCricket className="text-2xl" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Cricket</span>
                                        </button>
                                        <button 
                                            onClick={() => { setSelectedSport('Football'); setSelectedEquipment([]); }}
                                            className={`flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all duration-200 ${selectedSport === 'Football' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500'}`}
                                        >
                                            <MdSportsSoccer className="text-2xl" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Football</span>
                                        </button>
                                        <button 
                                            onClick={() => { setSelectedSport('Badminton'); setSelectedEquipment([]); }}
                                            className={`flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all duration-200 ${selectedSport === 'Badminton' ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500'}`}
                                        >
                                            <MdSportsTennis className="text-2xl" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Badminton</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Equipment Rental */}
                                {selectedSport && (
                                    <div className='mb-8 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50'>
                                        <h3 className='text-md font-bold text-white mb-3 flex items-center gap-2'>
                                            <span>Equipment Rental</span>
                                            <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">Optional</span>
                                        </h3>
                                        <div className="space-y-2">
                                            {SPORTS_DATA[selectedSport].map((item, idx) => (
                                                <label key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 cursor-pointer transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedEquipment.some(e => e.name === item.name) ? 'bg-blue-500 border-blue-500' : 'bg-slate-900 border-slate-600'}`}>
                                                            {selectedEquipment.some(e => e.name === item.name) && (
                                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-300">{item.name}</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-emerald-400">+₹{item.price}</span>
                                                    <input type="checkbox" className="hidden" checked={selectedEquipment.some(e => e.name === item.name)} onChange={() => handleEquipmentToggle(item)} />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Duration Selection */}
                                <div className='mb-6'>
                                    <h3 className='text-xl font-bold text-white mb-2'>Select Duration</h3>
                                    <select 
                                        value={duration} 
                                        onChange={(e) => setDuration(parseInt(e.target.value))}
                                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                        disabled={!price}
                                    >
                                        {[1, 2, 3, 4, 5].map(hrs => (
                                            <option key={hrs} value={hrs}>{hrs} Hour{hrs > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* price breakdown */}
                                <div className='bg-slate-900/60 rounded-2xl p-5 border border-slate-700/50 mb-6'>
                                    <h4 className='text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2'>Payment Details</h4>
                                    
                                    {
                                        price ? (
                                            <div className='flex flex-col gap-3 text-sm'>
                                                <div className='flex justify-between items-center text-slate-300'>
                                                    <p>Slot Price ({duration} hr{duration > 1 ? 's' : ''})</p>
                                                    <div className='flex items-center font-medium'>
                                                        <FaRupeeSign className="text-[12px]"/>
                                                        <span>{price * duration}.00</span>
                                                    </div>
                                                </div>

                                                <div className='flex justify-between items-center text-slate-300'>
                                                    <p>Platform Fee</p>
                                                    <div className='flex items-center font-medium'>
                                                        <FaRupeeSign className="text-[12px]"/>
                                                        <span>14.00</span>
                                                    </div>
                                                </div>

                                                {equipmentTotal > 0 && (
                                                    <div className='flex justify-between items-center text-slate-300'>
                                                        <p>Equipment Rental</p>
                                                        <div className='flex items-center font-medium text-emerald-400'>
                                                            <FaRupeeSign className="text-[12px]"/>
                                                            <span>{equipmentTotal}.00</span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className='flex justify-between items-center text-white pt-3 border-t border-slate-700 mt-1'>
                                                    <p className='font-bold text-lg'>Total Amount</p>
                                                    <div className='flex items-center text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-sm'>
                                                        <span className="text-blue-400 mr-1">₹</span>
                                                        <span>{(price * duration) + equipmentTotal + 14}.00</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center text-slate-500 py-4 italic">
                                                Select a time slot to see pricing
                                            </div>
                                        )
                                    }
                                </div>

                                {/* button  */}
                                <div className='w-full'>
                                    <button onClick={handelPayment} className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed'>
                                        Proceed to Book
                                    </button>
                                </div>

                                <div className='mt-6 bg-slate-900/40 p-4 rounded-xl border border-slate-700/50 text-xs text-slate-400 space-y-2'>
                                    <p className="font-semibold text-slate-300 mb-1">Important Info:</p>
                                    <p className="flex items-start gap-2"><span className="text-blue-400">•</span> Amount is refundable only up to 24 hours prior.</p>
                                    <p className="flex items-start gap-2"><span className="text-blue-400">•</span> Please carry a valid ID and booking confirmation.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className='max-w-7xl mx-auto px-4 mt-12 w-full'>
                        <div className='bg-[#111827] rounded-3xl p-6 md:p-10 border border-slate-700 shadow-xl'>
                            <p className='text-3xl font-bold text-white mb-8 border-b border-slate-700/50 pb-4'>
                                Customer Reviews
                            </p>
                            
                            <div className='flex items-center gap-6 mb-10 bg-slate-900/40 p-6 rounded-2xl border border-slate-700/30 w-fit'>
                                <div className='flex flex-col items-center gap-2'>
                                    <span className='text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600'>{avgReviewCount || 0}</span>
                                    <RatingStars Review_Count={avgReviewCount} />
                                </div>
                                <div className="w-[1px] h-16 bg-slate-700 mx-2"></div>
                                <div className="flex flex-col">
                                    <span className='text-lg text-slate-300 font-medium'>Based on</span>
                                    <span className='text-2xl text-white font-bold'>{turfDetails?.reviews?.length} ratings</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {
                                turfDetails?.reviews?.length > 0 ? turfDetails?.reviews?.map((item, index) => (
                                    <div key={index} className='bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors duration-300'>
                                        <div className='flex items-center justify-between mb-4'>
                                            <div className='flex items-center gap-3'>
                                                <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${item?.user?.firstName} ${item?.user?.lastName}`} alt="user img" className='w-12 h-12 rounded-full object-cover border-2 border-slate-600' />
                                                <div className='flex flex-col'>
                                                    <p className='text-lg font-bold text-white'>{item?.user?.firstName} {item?.user?.lastName}</p>
                                                    <div className="mt-1"><RatingStars Review_Count={item?.rating} /></div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className='text-slate-300 leading-relaxed italic'>"{item?.review}"</p>
                                    </div>
                                )) : (
                                    <div className="col-span-full text-center py-10 text-slate-500 italic">
                                        No reviews yet. Be the first to book and review!
                                    </div>
                                )
                            }
                            </div>
                        </div>
                    </div>
                </>)
            }

        </div>
    )
}

export default Turf;