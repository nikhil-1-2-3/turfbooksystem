import React from 'react'
import { getFullDetailsOfTurf } from '../../../../services/operation/TurfDetailsAPI';
import { setTurf,setEditTurf,setStep,setPriceTime,setPriceTimeId,setFinalData } from '../../../../slices/turfSlice';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import RenderStep from '../AddTurf/RenderStep';
import Spinner from '../../../common/spinner/Spinner';
const EditTurf = () => {
    const {token} = useSelector((state) => state.auth);
    const {turfId} = useParams();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();


    useEffect(() => {
        const popualteCourse = async () => {
            setLoading(true);
            const result = await getFullDetailsOfTurf(turfId, token);
            if(result?.turfDetails) {
                dispatch(setTurf(result.turfDetails));
                dispatch(setPriceTime(result.turfDetails.priceTime.data));
                dispatch(setFinalData(result.turfDetails.priceTime.data));
                dispatch(setPriceTimeId(result.turfDetails.priceTime._id));
                dispatch(setEditTurf(true));
                dispatch(setStep(1));
                
            }
            setLoading(false);
        }
        popualteCourse();
    },[]);

  return (
    <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
        <h1 className='mb-14 text-3xl font-medium text-richblack-5'>Edit turf</h1>
        {
            loading ? <p><Spinner></Spinner></p> :(
        <RenderStep />
            )
        }
    </div>
  )
}

export default EditTurf