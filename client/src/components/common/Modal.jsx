import { React, useEffect, useState } from 'react'
import IconBtn from './IconBtn'
import { CiSearch } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { setShow, setName } from '../../slices/searchSlice';
import { cities } from '../../data/cities';
import { TiDeleteOutline } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import { fetchAllCities } from '../../services/operation/TurfDetailsAPI';
import Spinner from './spinner/Spinner';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { show } = useSelector((state) => state.search);
    const [city, setCity] = useState("");
    const [view, setView] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setloading] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                setloading(true);
                const result = await fetchAllCities();
                console.log("result in modal: ", result);

                setData(result);
                setloading(false);

            }
            catch (error) {
                console.log(error.message);
                return;
            }
        }
        fetchCities();
    }, [])

    const filteredNames = data.filter(name =>
        name.toLowerCase().includes(city.toLowerCase())

    );
    const searchHandler = (e) => {
        e.preventDefault();
        console.log(city);
        console.log(filteredNames);
    }

    const listHandler = (name) => {
        dispatch(setName(name));
        navigate("/");
    }
    return (
        <>
            {
                loading ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                        <Spinner></Spinner> </div>) :
                    (<>  
                        <AnimatePresence>
                        {show &&

                        <div className='md:block'>
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: '-40%', x: '-50%' }}
                                animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
                                exit={{ opacity: 0, scale: 0.95, y: '-40%', x: '-50%' }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className='w-11/12 max-w-[1150px] max-h-[80vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900/95 backdrop-blur-xl p-8 z-50 fixed left-[50%] top-[50%] shadow-[0_0_50px_rgba(0,0,0,0.5)] scrollbar-hide'>
                                <div className='relative w-full mb-8'>
                                    <form action="" onSubmit={searchHandler}>
                                        <input onChange={(e) => setCity(e.target.value)} value={city} name='search' type="text" className='pl-12 text-lg bg-slate-800/80 text-slate-200 border-slate-600 border py-4 w-full rounded-xl outline-none focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all placeholder:text-slate-500' placeholder='Search for your city...' />
                                    </form>
                                    <span className='absolute top-4 left-4 text-2xl'><CiSearch className='text-slate-400'></CiSearch></span>
                                </div>

                                {
                                    city &&

                                    <div className='bg-slate-800 h-auto w-full shadow-2xl rounded-xl border border-slate-700 overflow-hidden mb-6 absolute top-[85px] z-20 left-0 right-0 mx-auto max-w-[calc(100%-4rem)]'>
                                        <ul className='bg-slate-800/90 backdrop-blur-md max-h-60 overflow-y-auto'>
                                            {filteredNames.map((name, index) => (
                                                <li onClick={() => listHandler(name)} className='p-3 px-6 text-slate-300 text-lg w-full cursor-pointer hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700 last:border-0' key={index}>{name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                }

                                <div className='pt-2 flex justify-center items-center mb-10 flex-col relative z-10'>
                                    <p className='p-3 text-2xl font-bold text-white mb-4'>Popular Cities</p>
                                    <div className='flex gap-6 sm:gap-10 flex-wrap justify-center cursor-pointer'>
                                        {
                                            cities.map((city, index) => (

                                                <div onClick={() => listHandler(city.name)} key={index} className='flex flex-col justify-center items-center p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-700 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300 group'>
                                                    <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-blue-400 transition-colors">
                                                        <img className='w-full h-full object-cover' src={city.image} alt="" />
                                                    </div>
                                                    <p className='text-slate-400 font-semibold group-hover:text-white transition-colors'>{city.name}</p>
                                                </div>
                                            ))

                                        }

                                    </div>
                                </div>

                                <div className='flex justify-center w-full items-center h-auto mt-4 border-t border-slate-800 pt-6'>
                                    {
                                        view ? (<p className='text-blue-400 text-lg font-medium py-2 cursor-pointer hover:text-blue-300 transition-colors flex items-center gap-2' onClick={() => setView(false)}>Hide All Cities <span className="text-xl">↑</span></p>) : (<p onClick={() => setView(true)} className='text-blue-400 py-2 text-lg font-medium cursor-pointer hover:text-blue-300 transition-colors flex items-center gap-2'>View All Cities <span className="text-xl">↓</span></p>)

                                    }
                                </div>

                                {
                                    view &&
                                    <div className='py-6 mt-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 p-6'>
                                        <div className='flex justify-center items-center pb-6 text-xl'>
                                            <p className="text-slate-300 font-semibold">Other Cities</p>
                                        </div>
                                        {
                                            data.length === 0 ? (<div className="text-slate-500 text-center">No City Found</div>) : (<div className='flex flex-wrap gap-x-8 gap-y-4 justify-center'>
                                                {
                                                    data.map((city, index) => (
                                                        <p key={index} className='text-slate-400 hover:text-blue-400 cursor-pointer hover:scale-105 transition-all bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-700/50' onClick={() => listHandler(city)}>{city}</p>
                                                    ))

                                                }
                                            </div>)
                                        }

                                    </div>

                                }
                                <div className='absolute top-4 right-4'>

                                    <button id='cancle' className='text-4xl text-slate-500 hover:text-white hover:rotate-90 transition-all duration-300' onClick={() => dispatch(setShow(false), navigate("/"))}>
                                        <TiDeleteOutline></TiDeleteOutline>
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className='fixed inset-0 z-40 !mt-0 grid place-items-center overflow-auto bg-black/80 backdrop-blur-sm'
                                onClick={() => dispatch(setShow(false))}
                            ></motion.div>

                        </div>
                    }
                    </AnimatePresence>
                    </>)
            }


        </>

    )
}

export default Modal