import React, { useEffect, useState } from 'react';
import { MdAddCircleOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { setStep, setEditTurf, setPriceTime, setPriceTimeId, setFinalData } from '../../../../../slices/turfSlice';
import { MdOutlineArrowBack } from "react-icons/md";
import { GrLinkNext } from "react-icons/gr";
import { FaRupeeSign } from "react-icons/fa";
import { addPriceTime, editPriceTime } from '../../../../../services/operation/TurfDetailsAPI';
import toast from 'react-hot-toast';
import Spinner from '../../../../common/spinner/Spinner';

function TurfBuilder() {
  const [time, setTime] = useState('12:00');
  const [price, setPrice] = useState('00');
  const booked = 0;
  const [data, setData] = useState([]);
  const { priceTime, turf, editTurf, priceTimeId, finalData } = useSelector((state) => state.turf);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.auth);



  const addItem = () => {
    if (time && price) {

      const newData = [...data, { time, price,booked }];
      setData(newData);
      if (editTurf) {
        const newpriceTime = [...priceTime, { time, price,booked }];
        dispatch(setPriceTime(newpriceTime));
      }
    }
    setTime('');
    setPrice('');
  };

  const removeItem = (index) => {
    const newData = [...priceTime];
    newData.splice(index, 1);
    setData(newData);
    dispatch(setPriceTime(newData));

  };

  const handleBack = () => {
    dispatch(setStep(1));
    dispatch(setEditTurf(true));
  }



  const handleNext = async () => {
    if (data.length == 0) {
      return toast.error("Please Add At Least One Price And Time");
    }

    setLoading(true);
    dispatch(setStep(3));
    const newData = { data, turfId: turf._id };
    const result = await addPriceTime(newData, token);
    setLoading(false);
    dispatch(setPriceTime(result.data));
    dispatch(setFinalData(result.data));
    dispatch(setPriceTimeId(result._id));
    setLoading(false);

  }

  const isFormUpdated = () => {
    if (finalData.length != priceTime.length) {
      return false
    }
    for (let i = 0; i < finalData.length; i++) {
      if (JSON.stringify(finalData[i]) !== JSON.stringify(priceTime[i])) {
        return false;
      }
    }

    return true;

  }

  const handleEdit = async () => {

    if (!isFormUpdated()) {
      if (priceTime.length == 0) {
        return toast.error("Please Add At Least One Price And Time");
      }
      setLoading(true);

      const newData = { priceTime, priceTimeId: priceTimeId };
      const result = await editPriceTime(newData, token);
      dispatch(setPriceTime(result.data));
      dispatch(setFinalData(result.data));
      dispatch(setStep(3));
      dispatch(setEditTurf(false));
      setLoading(false);
    }
    else {
      toast.error("No change made so far");
      dispatch(setStep(3));
    }



  }

  return (
    <>
      {
        loading ? (<><Spinner></Spinner></>) : (<>
          <div className='bg-white w-full px-3 py-3 relative md:right-5'>
            <div className='mb-5 md:text-2xl underline'>
              <p>Price Time Section</p>
            </div>
            <div className='flex gap-4'>
              <div className='w-1/4 '>
                <label htmlFor="timeInput">Time<sup className='text-red-700'>*</sup></label><br></br>
                <input
                  type="time"
                  id="timeInput"
                  step="3600"
                  className='p-1 form-style w-full'
                  value={time}
                  defaultValue={"00"}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div className='w-1/2 relative'>
                <label htmlFor="priceInput">Price<sup className='text-red-700'>*</sup></label><br></br>
                <input
                  type="number"
                  className='py-1 form-style w-full items-center pl-2 relative'
                  id="priceInput"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <FaRupeeSign className='absolute right-1 top-8 bg-white' />
              </div>
            </div>


            <br></br>
            <button className='p-1 text-lg md:text-base md:w-1/6 flex justify-center items-center gap-2 bg-green-500 rounded-md font-bold' onClick={addItem} type='button'>
              <p>Add</p>
              <span><MdAddCircleOutline></MdAddCircleOutline></span>
            </button>

            <div className='mt-5'>
              {
                editTurf ? (priceTime.length > 0 && (
                  priceTime.map((item, index) => (
                    <div key={index} className='flex gap-2'>
                      <div className='flex gap-2 bg-green-200 md:text-2xl text-xl mb-3 p-1 w-9/12 sm:w-8/12 md:w-5/12'>
                        <strong>Time:</strong> <p className='mr-2'> {item.time} </p>
                        <strong>Price:</strong> <p className='flex items-center'><FaRupeeSign className='text-sm'></FaRupeeSign>{item.price}</p>
                      </div>
                      <button className='ml-8 mb-3 rounded-md text-3xl md:text-4xl' onClick={() => removeItem(index)}><MdDelete className='text-red-800'></MdDelete></button>
                    </div>
                  ))
                )) : (data.length > 0 && (
                  data.map((item, index) => (
                    <div key={index} className='flex gap-2'>
                      <div className='flex gap-2 bg-green-200 mb-3 p-1 w-5/12'>
                        <strong>Time:</strong> <p className='mr-2'> {item.time} </p>
                        <strong>Price:</strong> <p className='flex items-center'><FaRupeeSign className='text-sm'></FaRupeeSign>{item.price}</p>
                      </div>
                      <button className='ml-8 mb-3 rounded-md text-xl' onClick={() => removeItem(index)}><MdDelete className='text-red-800'></MdDelete></button>
                    </div>
                  ))
                ))

              }
            </div>

            <div className=' w-full flex justify-end gap-4 mt-5 p-2'>
              <button className='flex gap-2 bg-green-500 justify-center items-center p-2 px-3 rounded-md' onClick={handleBack}>
                <span><MdOutlineArrowBack></MdOutlineArrowBack></span>
                <p>Back</p>
              </button>


              {
                editTurf ? (<button className='flex p-2 rounded-md bg-green-500 px-3 gap-2 justify-center items-center' onClick={handleEdit}>
                  <p>
                    Edit
                  </p>
                  <span><GrLinkNext></GrLinkNext></span>
                </button>) : (<button className='flex p-2 rounded-md bg-green-500 px-3 gap-2 justify-center items-center' onClick={handleNext}>
                  <p>
                    Next
                  </p>
                  <span><GrLinkNext></GrLinkNext></span>
                </button>)
              }
            </div>
          </div>
        </>)
      }

    </>

  );
}

export default TurfBuilder;
