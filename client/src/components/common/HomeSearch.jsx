import React, { useEffect, useState } from 'react'
import { IoArrowBack } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { useNavigate, Link } from "react-router-dom";
import { setShownavbar } from '../../slices/searchSlice';
// import { fetchSpecificCityTurfs } from '../../services/operation/TurfDetailsAPI';
import { fetchSpecificCityTurfs } from '../../services/operation/TurfDetailsAPI';
import { useSelector, useDispatch } from "react-redux";
import Spinner from './spinner/Spinner';
import { CiSearch } from "react-icons/ci";

export default function HomeSearch() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchData, setSearchData] = useState("");

    const [turfs, setTurfs] = useState([]);
    const { name } = useSelector((state) => state.search);
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    // Haversine formula to calculate distance between two lat/lng pairs in kilometers
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return R * c; // Distance in km
    };
    const handlerCancle = () => {
        dispatch(setShownavbar(true));
        navigate("/");
    }
    useEffect(() => {
        const fetchTurfs = async () => {
            try {
                setLoading(true);
                const data = { cityName: name }
                const result = await fetchSpecificCityTurfs(data);
                
                // Fetch User Location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;
                            setUserLocation({ lat: latitude, lng: longitude });
                            
                            // Sort turfs by distance
                            const sortedTurfs = [...result].map(t => {
                                const dist = calculateDistance(latitude, longitude, t.location?.lat, t.location?.lng);
                                return { ...t, distance: dist };
                            }).sort((a, b) => a.distance - b.distance);
                            
                            setTurfs(sortedTurfs);
                        },
                        (error) => {
                            console.log("Geolocation error:", error);
                            setTurfs(result);
                        }
                    );
                } else {
                    setTurfs(result);
                }
                
                setLoading(false);

            }
            catch (error) {
                console.log(error);
                setLoading(false);
                return;
            }
        }
        fetchTurfs();
    }, []);


    const filteredNames = turfs.filter(name =>
        (name.turfName).toLowerCase().includes(searchData.toLowerCase())
    );

    // console.log(filteredNames);s

    const listHandler = (turfName, id) => {
        console.log(turfName);
        console.log(id);
    }

    return (
        <div>
            {
                loading ? (<><Spinner></Spinner></>) : (<>
                    <div className=' hidden md:flex  justify-between w-full items-center bg-neutral-100 sm:p-2 p-5'>
                        <div onClick={handlerCancle}><span className='text-3xl cursor-pointer'> <IoArrowBack /></span>
                        </div>

                        <div className='w-2/3'>
                            <input onChange={(e) => setSearchData(e.target.value)} value={searchData} type="text" placeholder='Search TurfName' className='bg-white p-3 sm:p-1 placeholder:px-2 text-xl outline-0 border w-11/12  border-neutral-100' />
                        </div>

                        <div onClick={handlerCancle}><span className='text-3xl cursor-pointer'><RxCross1></RxCross1></span>
                        </div>
                    </div>
                         {/* mobile search bar */}
                    <div className='md:hidden'>
                        <div className='flex bg-green-500 justify-between align-middle items-center px-2 py-3'>
                            <div onClick={handlerCancle}><span className='text-3xl cursor-pointer'> <IoArrowBack />  </span>
                            </div>
                            <div>
                                <h1 className='text-[1.5rem]'><span className='font-bold'>Turf</span>XL</h1>
                            </div>
                            <div onClick={handlerCancle}><span className='text-3xl cursor-pointer'><RxCross1></RxCross1></span>
                            </div>
                        </div>
                        <div className='w-[94%] mt-3 m-auto bg-red-500 relative'>
                            <span className='absolute bottom-[28%] text-black px-2 text-xl'><CiSearch /></span>
                        
                            <input onChange={(e) => setSearchData(e.target.value)} value={searchData} type="text" placeholder='Search TurfName' className='bg-white py-2 px-10 text-xl outline-0 border w-full  border-neutral-100' />
                        </div>
                    </div>

                    <div className='w-[100vw]'>
                        {
                            searchData &&

                            <div className='absolute top-32 sm:top-28 px-2 w-[98%] sm:w-[95%] drop-shadow-md shadow-neutral-700'>
                                    {filteredNames.map((name, index) => (
                                        <Link to={`/turfs/${name._id}`} onClick={() => dispatch(setShownavbar(true))} >

                                            <div className={`${index == 0 ? ('bg-neutral-200') : ('bg-white')} flex w-[100%] sm:w-[62%] items-center m-auto align-middle p-1 sm:p-2 border-b-2 `}>
                                                <img src={name.image} className='w-[60px] hidden sm:block mt-2 h-[60px]' alt="" />
                                                <div className="flex-1">
                                                    <li onClick={() => listHandler(name.turfName, name._id)} className='sm:p-2 sm:px-4 text-black text-base w-full rounded-md cursor-pointer' key={index}>{name.turfName}</li>
                                                    {name.distance && name.distance !== Infinity && (
                                                        <span className="text-xs text-blue-600 font-bold ml-4 bg-blue-100 px-2 py-1 rounded-full">{name.distance.toFixed(1)} km away</span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>

                                    ))}
                            </div>
                        }
                    </div>
                    

                    <div className='p-5 flex gap-2 flex-col justify-center  w-full'>
                        {
                            turfs.map((turf, index) => (
                                <Link to={`/turfs/${turf._id}`} onClick={() => dispatch(setShownavbar(true))} >

                                    <div className='flex justify-between w-full md:w-1/2 mx-auto bg-slate-900 border border-slate-800 p-4 rounded-xl mb-2 items-center hover:bg-slate-800 transition'>
                                        <li className='list-none cursor-pointer text-white font-medium'>{turf.turfName}</li>
                                        {turf.distance && turf.distance !== Infinity && (
                                            <span className="text-sm text-emerald-400 font-bold bg-emerald-900/40 px-3 py-1 rounded-full">📍 {turf.distance.toFixed(1)} km</span>
                                        )}
                                    </div>
                                </Link>
                            ))
                        }
                    </div>

                </>)
            }



        </div>
    )
} 
