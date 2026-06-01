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

const moreCities = [
    "Aalo", "Abohar", "Abu Dhabi", "Abu Road", "Achampet", 
    "Acharapakkam", "Adilabad", "Adimali"
];

const CitySelector = () => {
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
        <>{
            loading ? (<><Spinner></Spinner></>):(<>
            {
                <div className="p-6 max-w-4xl mx-auto min-h-screen pt-20">
                <h1 className="text-3xl font-bold mb-6 text-white tracking-tight">Select your city</h1>
                <div className="mb-8">
                    <form action="" className='relative' onSubmit={searchHandler}>
                    <span className='absolute top-3.5 left-4 text-2xl text-slate-400'><CiSearch></CiSearch></span>
                        <input
                            onChange={(e) => setCity(e.target.value)} 
                            value={city} 
                            name='search'
                            type="text"
                            placeholder="Search for your city"
                            className="w-full pl-12 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-lg text-slate-200 outline-none focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
                        />
                    </form>
                </div>

                {
                    city &&

                    <div className='bg-slate-800 h-auto mt-[-20px] w-full shadow-2xl rounded-b-xl border-x border-b border-slate-700 z-50 relative overflow-hidden'>
                        <ul className='bg-slate-800/90 backdrop-blur-md'>
                            {filteredNames.map((name, index) => (
                                <li onClick={() => listHandler(name)} className='p-4 text-slate-300 text-lg w-full cursor-pointer hover:bg-slate-700/50 hover:text-white transition-colors border-b border-slate-700/50 last:border-0' key={index}>{name}</li>
                            ))}
                        </ul>
                    </div>
                }
                
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-slate-300">Popular cities</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {cities.map((city,index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center p-4 border border-slate-700 rounded-2xl cursor-pointer bg-slate-800/50 hover:bg-slate-700 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300 group"
                                onClick={() => listHandler(city.name)}
                            >
                                <div className="text-xl w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-400 transition-colors"><img src={city.image} alt="" className="w-full h-full object-cover" /></div>
                                <div className="text-center text-md mt-3 text-slate-300 group-hover:text-white font-medium">{city.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-12 bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50">
                    <h2 className="text-xl font-semibold mb-4 text-slate-300">More cities</h2>
                    <div className="divide-y divide-slate-700/50">
                        {data.length === 0 ? (<div className="text-slate-400 py-4">No City Found</div>):(<>
                        {
                            data.map((city, index) => (
                                <div
                                    key={index}
                                    className="py-4 flex justify-between items-center cursor-pointer hover:px-2 hover:bg-slate-700/30 text-slate-300 hover:text-white transition-all duration-200 rounded-lg"
                                    onClick={() => listHandler(city)}
                                >
                                    <span className="text-lg">{city}</span>
                                    <span className="text-xl text-slate-500">&gt;</span>
                                </div>
                            ))
                        }
                        </>)
                        }
                    </div>
                </div>
            </div>
            }</>)
          }
        </>

    );
};

export default CitySelector;