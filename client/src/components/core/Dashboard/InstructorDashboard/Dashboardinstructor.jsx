import React from 'react'
import { useEffect } from 'react'
import { getTotalEarning } from '../../../../services/operation/profileAPI'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import DashboardChart from './DashboardChart'
import Spinner from '../../../common/spinner/Spinner'

const Dashboardinstructor = () => {
    const [details, setDetails] = useState([])
    const { token } = useSelector(state => state.auth)
    const [loading, setloading] = useState(false);

    useEffect(() => {
        ; (async () => {
            //get owner details
            setloading(true);
            const ownerDetails = await getTotalEarning(token);
            setDetails(ownerDetails);
            setloading(false);
        })();
    }, [])

    const totalEarnings = details?.reduce((acc, turf) => {
        return acc + turf?.totalRevenue;
    }, 0);
    const totalBooking = details?.reduce((acc, turf) => {
        return acc + turf?.booking;
    }, 0);

    return (
        <div>
            {
                loading ? (<><Spinner></Spinner></>) : (<>
                    {
                        totalEarnings == 0 ? (<div className='p-5'>
                            <p className='font-bold text-2xl'>0 Earning</p>
                            <p className='font-bold text-2xl'>0 Booking</p></div>) : (<div className='mx-auto w-11/12 max-w-[1000px] py-10'>
                                <div>
                                    <div className='my-4 flex flex-col-reverse  gap-3 md:flex-row md:flex md:h-[450px] md:space-x-4'>
                                        <div className='flex flex-col flex-1 rounded-md bg-white p-6'>
                                            <div className='flex items-center justify-between'>
                                                <p className='text-lg font-bold text-richblack-5'>
                                                    Visualize
                                                </p>
                                            </div>
                                            <DashboardChart details={details} />
                                        </div>
                                        <div className='flex min-w-[250px] flex-col rounded-md bg-white p-6'>
                                            <p className='text-lg font-bold text-richblack-5'>Statistics</p>
                                            <div className='mt-4 space-y-4'>
                                                <div>
                                                    <p className='text-lg text-richblack-200'>Total Turfs</p>
                                                    <p className='text-3xl font-semibold text-richblack-50'>{details.length}</p>
                                                </div>
                                                <div>
                                                    <p className='text-lg text-richblack-200'>Total Booking</p>
                                                    <p className='text-3xl font-semibold text-richblack-50'>{totalBooking}</p>
                                                </div>
                                                <div>
                                                    <p className='text-lg text-richblack-200'>Total Earnings</p>
                                                    <p className='text-3xl font-semibold text-richblack-50'>₹ {totalEarnings}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>)
                    }
                </>)
            }


        </div>
    )
}

export default Dashboardinstructor;