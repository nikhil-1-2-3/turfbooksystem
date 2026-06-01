import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserTurfs as getUserBuyTurfs } from '../../../services/operation/profileAPI';
import { useNavigate } from 'react-router';
import Spinner from '../../common/spinner/Spinner';

const BuyTurfs = () => {

    const { token } = useSelector((state) => state.auth);

    const [buyTurfs, setBuyTurfs] = useState(undefined);
    const [Loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const getBuyTurfs = async () => {
        setLoading(true);
        const response = await getUserBuyTurfs(token);
        console.log("dusry file madhe: ", response);
        setLoading(false);
        setBuyTurfs(response?.turfs);

    }

    useEffect(() => {
        getBuyTurfs();
    }, []);

    if (Loading) {
        return (
            <div className='flex h-[calc(100vh)] w-full justify-center items-center'>
                <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black'></div>
            </div>
        )
    }


    return (
        <div className='mx-auto w-11/12 max-w-[1000px] py-10'>

            <div className='text-3xl text-richblack-50'>Buy Turfs</div>
            {
                !buyTurfs ? (<div>
                    <Spinner></Spinner>
                </div>)
                    : !buyTurfs.length ? (<p className='grid h-[10vh] w-full place-content-center text-richblack-5'>You have not buy any turf yet</p>)
                        : (
                            <div className='my-8 text-richblack-5'>
                                <div className='flex rounded-t-lg bg-richblack-500 '>
                                    <p className='w-[45%] px-5 py-3'>Turf Name</p>
                                    <p className='w-1/4 px-2 py-3'></p>
                                </div>
                                {/* Cards shure hote h ab */}
                                {
                                    buyTurfs.map((turf, index) => (
                                        <div key={index} onClick={() => {
                                            navigate(`view-course/${turf._id}/section/${turf.courseContent[0]._id}/sub-section/${turf.courseContent[0].subSection[0]}`)
                                        }}
                                            className='flex items-center border border-richblack-700 rounded-none'>
                                            <div className='flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3'>
                                                <img className='h-14 w-14 rounded-lg object-cover' src={turf.image} />
                                                <div className='flex max-w-xs flex-col gap-2'>
                                                    <p className='font-semibold'>{turf.courseName}</p>
                                                    <p className='text-xs text-richblack-300 hidden md:block'>{
                                                        //description with max 50 characters
                                                        turf.description.length > 50 ? turf.description.slice(0, 50) + '....' : turf.description
                                                    }</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )
            }

        </div>
    )
}

export default BuyTurfs;