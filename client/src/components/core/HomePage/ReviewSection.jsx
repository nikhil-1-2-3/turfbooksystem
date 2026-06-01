import { React, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Slider from "../../common/Slider";
import { ratingsEndpoints } from '../../../services/apis';
import { apiConnector } from '../../../services/apiConnector';
import Spinner from '../../common/spinner/Spinner';

export default function ReviewSection() {
    const [Reviews, setReviews] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [isdata, setIsdata] = useState(false);
    const name = "Surat";

    useEffect(() => {
        const getReviews = async () => {
            setLoading(true);
            try {
                const res = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API);
                const turfs = res.data.data || [];
                
                if (turfs.length > 0) {
                    setIsdata(true);
                }
                setReviews(turfs);
            } catch (error) {
                console.log("LOGGING Review ERROR", error);
            } finally {
                setLoading(false);
            }
        }
        getReviews();
    }, [])

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            {
                Loading ? (<><Spinner></Spinner></>) : (
                    <div className='pt-12 pb-24'>
                        <div className='w-full mb-12 flex align-middle items-center justify-center text-center' >
                            <h2 className='md:text-5xl text-3xl font-black text-slate-900 dark:text-white pb-2 tracking-tighter'>
                                Trusted by <span className="text-turf-green dark:text-slate-400 italic font-medium">Players</span>
                            </h2>
                        </div>
                        <div className="px-4">
                            {
                                isdata ? (
                                    <div className="rounded-3xl overflow-hidden shadow-sm dark:shadow-none bg-slate-50/50 dark:bg-slate-900/20 backdrop-blur-sm p-4 md:p-8 border border-slate-200/50 dark:border-slate-800/30">
                                        <Slider Courses={Reviews}></Slider>
                                    </div>
                                ) : (
                                    <div className="text-center text-slate-500 dark:text-slate-400 py-16 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800/50 shadow-sm backdrop-blur-md max-w-2xl mx-auto">
                                        <p className="text-xl font-medium">No reviews available for {name} yet.</p>
                                        <p className="mt-2 text-sm">Be the first to review your favorite turf!</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )
            }
        </motion.div>
    )
}
