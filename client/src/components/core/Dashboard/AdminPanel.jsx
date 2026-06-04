import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { adminEndpoints } from '../../../services/apis';
import { apiConnector } from '../../../services/apiConnector';
import { toast } from 'react-hot-toast';
import Spinner from '../../common/spinner/Spinner';
import { FaUsers, FaCalendarCheck, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const { GET_ALL_USERS_API, GET_ALL_BOOKINGS_API, DELETE_USER_API, ALLOT_BOOKING_API, APPROVE_CANCELLATION_API } = adminEndpoints;

const AdminPanel = () => {
    const { token } = useSelector((state) => state.auth);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [verifyingBookingId, setVerifyingBookingId] = useState(null);
    const [enteredToken, setEnteredToken] = useState("");

    useEffect(() => {
        const fetchAdminData = async () => {
            setLoading(true);
            try {
                // Fetch Users
                const userRes = await apiConnector("GET", GET_ALL_USERS_API, null, {
                    Authorisation: `Bearer ${token}`,
                });
                if (userRes.data.success) {
                    setUsers(userRes.data.data);
                }

                // Fetch Bookings
                const bookingRes = await apiConnector("GET", GET_ALL_BOOKINGS_API, null, {
                    Authorisation: `Bearer ${token}`,
                });
                if (bookingRes.data.success) {
                    setBookings(bookingRes.data.data);
                }
            } catch (error) {
                console.error("Error fetching admin data:", error);
                toast.error("Failed to load admin dashboard data");
            }
            setLoading(false);
        };
        fetchAdminData();
    }, [token]);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        
        try {
            const res = await apiConnector("DELETE", DELETE_USER_API, { userId }, {
                Authorisation: `Bearer ${token}`,
            });
            if (res.data.success) {
                toast.success("User deleted successfully");
                setUsers(users.filter(user => user._id !== userId));
            }
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    const handleVerifyClick = (bookingId) => {
        setVerifyingBookingId(bookingId);
        setEnteredToken("");
    };

    const handleAllotBooking = async (bookingId, actualToken) => {
        if (enteredToken.trim().toUpperCase() !== actualToken) {
            return toast.error("Invalid Token! Cross-check with the user.");
        }

        try {
            const res = await apiConnector("PUT", ALLOT_BOOKING_API, { bookingId }, {
                Authorisation: `Bearer ${token}`,
            });
            if (res.data.success) {
                toast.success("Token Verified! Turf Successfully Allotted.");
                setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: "Allotted" } : b));
                setVerifyingBookingId(null);
            }
        } catch (error) {
            toast.error("Failed to allot turf");
        }
    };

    const handleApproveCancellation = async (bookingId) => {
        if (!window.confirm("Are you sure you want to approve this cancellation? The slot will be instantly freed up.")) return;

        try {
            const res = await apiConnector("PUT", APPROVE_CANCELLATION_API, { bookingId }, {
                Authorisation: `Bearer ${token}`,
            });
            if (res.data.success) {
                toast.success("Cancellation Approved! Slot is now free.");
                setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: "Cancelled" } : b));
            }
        } catch (error) {
            toast.error("Failed to approve cancellation");
        }
    };

    if (loading) return <div className="h-full flex justify-center items-center"><Spinner /></div>;

    const formatTime12Hour = (timeStr) => {
        if (!timeStr) return '';
        const slots = timeStr.split(',');
        const start = parseInt(slots[0].split(':')[0], 10);
        const ampm = start >= 12 && start < 24 ? 'PM' : 'AM';
        const displayHour = start % 12 || 12;
        return `${displayHour}:00 ${ampm} (${slots.length} hr${slots.length > 1 ? 's' : ''})`;
    };

    return (
        <div className="text-white p-6 md:p-10 w-full bg-slate-950 min-h-screen">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">Admin Dashboard</h1>
                <p className="text-slate-400">Manage all registrations and platform bookings.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-6 shadow-xl">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-3xl">
                        <FaUsers />
                    </div>
                    <div>
                        <p className="text-slate-400 font-medium">Total Registered Users</p>
                        <h2 className="text-4xl font-black text-white">{users.length}</h2>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-6 shadow-xl">
                    <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 text-3xl">
                        <FaCalendarCheck />
                    </div>
                    <div>
                        <p className="text-slate-400 font-medium">Total Platform Bookings</p>
                        <h2 className="text-4xl font-black text-white">{bookings.length}</h2>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-slate-800 pb-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-2 font-semibold transition-all ${activeTab === 'users' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Users Directory
                </button>
                <button 
                    onClick={() => setActiveTab('requested')}
                    className={`px-6 py-2 font-semibold transition-all ${activeTab === 'requested' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Requested Bookings
                </button>
                <button 
                    onClick={() => setActiveTab('booked')}
                    className={`px-6 py-2 font-semibold transition-all ${activeTab === 'booked' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Booked List
                </button>
                <button 
                    onClick={() => setActiveTab('cancellations')}
                    className={`px-6 py-2 font-semibold transition-all ${activeTab === 'cancellations' ? 'text-red-400 border-b-2 border-red-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Cancellation Requests
                </button>
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-sm">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium">Role</th>
                                    <th className="px-6 py-4 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {users.map(user => (
                                    <tr key={user._id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={user.image} alt={user.firstName} className="w-10 h-10 rounded-full border border-slate-700" />
                                                <span className="font-semibold">{user.firstName} {user.lastName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                user.accountType === 'Admin' ? 'bg-red-500/20 text-red-400' : 
                                                user.accountType === 'Owner' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                                            }`}>
                                                {user.accountType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.accountType !== 'Admin' && (
                                                <button onClick={() => handleDeleteUser(user._id)} className="text-slate-500 hover:text-red-400 transition-colors p-2 bg-slate-950 rounded-lg">
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Requested Bookings Tab */}
            {activeTab === 'requested' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.filter(b => b.status === "Pending").map((booking, index) => (
                        <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/50 transition-colors relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-amber-500/20 text-amber-500 text-xs font-bold px-3 py-1 rounded-bl-lg">Pending</div>
                            <h3 className="text-xl font-bold text-white mb-4 line-clamp-1 pr-16">{booking.turfId?.turfName || "Deleted Turf"}</h3>
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-slate-400">Total Price</span>
                                    <span className="font-bold text-emerald-400">₹{booking.price}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-slate-400">Date</span>
                                    <span className="font-semibold text-white">{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : "N/A"}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-slate-400">Slot Time</span>
                                    <span className="font-semibold text-white">{formatTime12Hour(booking.time)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-800">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Token</span>
                                    <span className="font-mono text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{booking.bookingToken || "N/A"}</span>
                                </div>
                            </div>
                            
                            {verifyingBookingId === booking._id ? (
                                <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
                                    <p className="text-xs text-slate-400 mb-2">Enter the token provided by the user:</p>
                                    <input 
                                        type="text" 
                                        value={enteredToken}
                                        onChange={(e) => setEnteredToken(e.target.value)}
                                        placeholder="e.g. TRF-A1B2C3"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white mb-3 focus:outline-none focus:border-amber-500 font-mono"
                                    />
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setVerifyingBookingId(null)}
                                            className="flex-1 py-2 font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={() => handleAllotBooking(booking._id, booking.bookingToken)}
                                            className="flex-1 py-2 font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all text-sm"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => handleVerifyClick(booking._id)}
                                    className="w-full py-2 font-bold rounded-lg transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] mt-2"
                                >
                                    Verify & Allot Turf
                                </button>
                            )}
                        </div>
                    ))}
                    {bookings.filter(b => b.status === "Pending").length === 0 && (
                        <div className="col-span-full text-center py-12 text-slate-500">
                            No requested bookings found.
                        </div>
                    )}
                </motion.div>
            )}

            {/* Booked List Tab */}
            {activeTab === 'booked' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.filter(b => b.status === "Allotted" || b.status === "Cancelled").map((booking, index) => (
                        <div key={index} className={`bg-slate-900 border ${booking.status === "Cancelled" ? "border-red-500/30 opacity-60" : "border-emerald-500/30 opacity-80"} rounded-2xl p-6 relative overflow-hidden`}>
                            <div className={`absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 ${booking.status === "Cancelled" ? "bg-red-500" : "bg-emerald-500"}`}>
                                {booking.status === "Cancelled" ? "Cancelled" : <><FaCalendarCheck /> Allotted</>}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 line-clamp-1 pr-20">{booking.turfId?.turfName || "Deleted Turf"}</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-slate-400">Total Price</span>
                                    <span className={`font-bold ${booking.status === "Cancelled" ? "text-red-400" : "text-emerald-400"}`}>₹{booking.price}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-slate-400">Date</span>
                                    <span className="font-semibold text-white">{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : "N/A"}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-slate-400">Slot Time</span>
                                    <span className="font-semibold text-white">{formatTime12Hour(booking.time)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-800">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Token Used</span>
                                    <span className="font-mono text-sm font-black text-slate-500 line-through decoration-slate-600">{booking.bookingToken || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {bookings.filter(b => b.status === "Allotted" || b.status === "Cancelled").length === 0 && (
                        <div className="col-span-full text-center py-12 text-slate-500">
                            No confirmed bookings in the list yet.
                        </div>
                    )}
                </motion.div>
            )}

            {/* Cancellations Tab */}
            {activeTab === 'cancellations' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.filter(b => b.status === "Cancellation_Requested").map((booking, index) => (
                        <div key={index} className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-bl-lg">Cancellation Req.</div>
                            <h3 className="text-xl font-bold text-white mb-4 line-clamp-1 pr-24">{booking.turfId?.turfName || "Deleted Turf"}</h3>
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-slate-400">Total Price</span>
                                    <span className="font-bold text-emerald-400">₹{booking.price}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-slate-400">Date</span>
                                    <span className="font-semibold text-white">{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : "N/A"}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-slate-400">Slot Time</span>
                                    <span className="font-semibold text-white">{formatTime12Hour(booking.time)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-800">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Token</span>
                                    <span className="font-mono text-sm font-black text-slate-500">{booking.bookingToken || "N/A"}</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handleApproveCancellation(booking._id)}
                                className="w-full py-2 font-bold rounded-lg transition-all bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)] mt-2"
                            >
                                Approve Cancellation
                            </button>
                        </div>
                    ))}
                    {bookings.filter(b => b.status === "Cancellation_Requested").length === 0 && (
                        <div className="col-span-full text-center py-12 text-slate-500">
                            No pending cancellation requests.
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default AdminPanel;
