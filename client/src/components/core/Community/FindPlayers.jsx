import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiConnector } from '../../../services/apiConnector';
import { postEndpoints, turfEndpoints } from '../../../services/apis';
import { toast } from 'react-hot-toast';
import Spinner from '../../common/spinner/Spinner';
import { FaUserPlus, FaTrash } from 'react-icons/fa';

export default function FindPlayers() {
    const { token, user } = useSelector((state) => state.auth);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state
    const [turfs, setTurfs] = useState([]);
    const [formData, setFormData] = useState({
        turfId: '',
        sport: 'Cricket',
        time: '',
        date: '',
        playersNeeded: 1,
        description: ''
    });

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await apiConnector("GET", postEndpoints.GET_ALL_POSTS_API, null, {
                Authorisation: `Bearer ${token}`
            });
            if (res.data.success) {
                setPosts(res.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load community posts");
        } finally {
            setLoading(false);
        }
    };

    const fetchTurfs = async () => {
        try {
            // Need a generic list of all turfs to populate dropdown
            const res = await apiConnector("POST", turfEndpoints.SEARCH_TURF_API, { searchQuery: "" });
            if (res?.data?.success) {
                setTurfs(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching turfs for dropdown", error);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchTurfs();
    }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            const toastId = toast.loading("Creating post...");
            const res = await apiConnector("POST", postEndpoints.CREATE_POST_API, formData, {
                Authorisation: `Bearer ${token}`
            });
            toast.dismiss(toastId);
            
            if (res.data.success) {
                toast.success("Post created successfully!");
                setIsModalOpen(false);
                fetchPosts();
                setFormData({
                    turfId: '',
                    sport: 'Cricket',
                    time: '',
                    date: '',
                    playersNeeded: 1,
                    description: ''
                });
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to create post");
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const toastId = toast.loading("Deleting post...");
            const res = await apiConnector("POST", postEndpoints.DELETE_POST_API, { postId }, {
                Authorisation: `Bearer ${token}`
            });
            toast.dismiss(toastId);
            
            if (res.data.success) {
                toast.success("Post deleted!");
                fetchPosts();
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to delete post");
        }
    };

    if (loading) return <div className="h-screen flex justify-center items-center"><Spinner /></div>;

    return (
        <div className="w-11/12 max-w-maxContent mx-auto pt-28 pb-10">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 mb-2">Find Players</h1>
                    <p className="text-slate-400">Join a game or find players for your team.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-full transition shadow-lg shadow-emerald-500/30"
                >
                    + Create Post
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.length === 0 ? (
                    <div className="col-span-full text-center text-slate-500 py-10">
                        No active posts. Be the first to create one!
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative flex flex-col justify-between">
                            {user?._id === post.user?._id && (
                                <button 
                                    onClick={() => handleDeletePost(post._id)}
                                    className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition"
                                >
                                    <FaTrash />
                                </button>
                            )}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <img 
                                        src={post.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${post.user?.firstName}`} 
                                        alt="user" 
                                        className="w-12 h-12 rounded-full border-2 border-slate-700"
                                    />
                                    <div>
                                        <p className="text-white font-semibold">{post.user?.firstName} {post.user?.lastName}</p>
                                        <p className="text-slate-500 text-xs text-emerald-400">{post.sport}</p>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{post.turf?.turfName}</h3>
                                <div className="text-slate-400 text-sm mb-4 space-y-1">
                                    <p>📅 {post.date} at {post.time}</p>
                                    <p>📍 {post.turf?.area}, {post.turf?.city}</p>
                                </div>
                                {post.description && (
                                    <p className="text-slate-300 text-sm mb-4 italic">"{post.description}"</p>
                                )}
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                                <span className="flex items-center gap-2 text-emerald-400 font-medium">
                                    <FaUserPlus /> {post.playersNeeded} Player{post.playersNeeded > 1 ? 's' : ''} Needed
                                </span>
                                <a 
                                    href={`https://wa.me/?text=Hi! I want to join your ${post.sport} game at ${post.turf?.turfName} on ${post.date}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-xs bg-slate-800 hover:bg-slate-700 text-white py-1 px-3 rounded-full transition"
                                >
                                    Connect
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Post Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold text-white mb-6">Create Community Post</h2>
                        <form onSubmit={handleCreatePost} className="space-y-4">
                            <div>
                                <label className="block text-slate-300 text-sm mb-1">Select Turf</label>
                                <select 
                                    required
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-emerald-500"
                                    value={formData.turfId}
                                    onChange={(e) => setFormData({...formData, turfId: e.target.value})}
                                >
                                    <option value="">-- Choose Turf --</option>
                                    {turfs.map(t => (
                                        <option key={t._id} value={t._id}>{t.turfName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-slate-300 text-sm mb-1">Sport</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="Cricket, Football..."
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-emerald-500"
                                        value={formData.sport}
                                        onChange={(e) => setFormData({...formData, sport: e.target.value})}
                                    />
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-slate-300 text-sm mb-1">Players</label>
                                    <input 
                                        required
                                        type="number" 
                                        min="1" max="20"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-emerald-500"
                                        value={formData.playersNeeded}
                                        onChange={(e) => setFormData({...formData, playersNeeded: Number(e.target.value)})}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-slate-300 text-sm mb-1">Date</label>
                                    <input 
                                        required
                                        type="date" 
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-emerald-500"
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-slate-300 text-sm mb-1">Time</label>
                                    <input 
                                        required
                                        type="time" 
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-emerald-500"
                                        value={formData.time}
                                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm mb-1">Description (Optional)</label>
                                <textarea 
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-emerald-500 h-24"
                                    placeholder="Looking for a fast bowler..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition"
                            >
                                Post Request
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
