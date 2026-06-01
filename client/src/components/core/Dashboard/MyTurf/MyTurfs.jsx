import {React,useState} from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import TurfTable from "./TurfTable";
import { fetchOwnerTurfs } from '../../../../services/operation/TurfDetailsAPI';
import { setStep, setTurf, setPriceTime } from '../../../../slices/turfSlice';
import Spinner from '../../../common/spinner/Spinner';
const MyTurfs = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const [courses, setCourses] = useState(null);
    const [loading, setloading] = useState(false);
    const fetchedCourses = async () => {
        setloading(true);
        const result = await fetchOwnerTurfs(token);
        setloading(false);
        console.log("result in my turf: ", result);
        if (result) {
            setCourses(result);
        }
    }

    useEffect(() => {
        fetchedCourses();
    }, []);

    const registerHandler = () => {
        dispatch(setStep(1));
        dispatch(setTurf(null));
        dispatch(setPriceTime(null));
        navigate('/dashboard/add-turf');
    }
    return (
        <>
            {
                loading ? (<><Spinner></Spinner></>) : (<>
                    <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
                        <div>
                            <div className='mb-14 flex items-center justify-between'>
                                <h1 className='text-3xl font-medium text-richblack-5' >Listed Turfs</h1>
                                <button onClick={registerHandler} className='flex items-center bg-green-500 cursor-pointer gap-x-2 rounded-md py-2 px-2 md:px-5 font-semibold text-richblack-900 undefined'>
                                    <p>Register Turf</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-richblack-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </button>
                            </div>
                            <div>
                                {courses && <TurfTable courses={courses} setCourses={setCourses} />}
                            </div>
                        </div>
                    </div>
                </>)
            }

        </>

    )
}

export default MyTurfs;