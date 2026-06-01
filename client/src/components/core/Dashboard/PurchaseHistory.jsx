import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { getUserTurfs as getUserBuyTurfs } from '../../../services/operation/profileAPI';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import ReviewModal from '../ViewTurf/ReviewModal';
import Spinner from '../../common/spinner/Spinner';
import { apiConnector } from '../../../services/apiConnector';
import { studentEndpoints } from '../../../services/apis';

const { REQUEST_CANCELLATION_API } = studentEndpoints;

export default function PurchaseHistory() {

  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const [buyTurfs, setBuyTurfs] = useState([]);

  const [turfId,setTurfId]=useState("");

  const [reviewModel , setReviewModal]=useState(false);

  const getBuyTurfs = async () => {
    setLoading(true);
    console.log("token: ",token);
    if(!token){
      return toast.error("Session Expire, Please Login First");
    }
    const response = await getUserBuyTurfs(token);

    if(response.length==0){
      return toast.error("Session Expire, Please Login First");
    }
    console.log("purschase history: ", response);
    setLoading(false);
    setBuyTurfs(response?.history);

  }

  const reviewHandler = (id)=>{
    setReviewModal(true);
    setTurfId(id);

  }

  const formatTime12Hour = (timeStr) => {
    if (!timeStr) return '';
    const hour = parseInt(timeStr.split(':')[0], 10);
    const ampm = hour >= 12 && hour < 24 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
  };

  const handleRequestCancellation = async (bookingId) => {
      if (!window.confirm("Are you sure you want to request a cancellation for this booking?")) return;
      
      try {
          const res = await apiConnector("POST", REQUEST_CANCELLATION_API, { bookingId }, {
              Authorisation: `Bearer ${token}`
          });
          
          if (res.data.success) {
              toast.success("Cancellation requested successfully.");
              getBuyTurfs(); // Refresh the list to get updated status
          }
      } catch (error) {
          toast.error("Failed to request cancellation.");
      }
  };

  useEffect(() => {
    getBuyTurfs();
  }, []);

  return (
    <div>
      {
        loading ? (<>
        <Spinner></Spinner></>):(<>
          <div><p className='md:text-3xl font-bold p-2 ml-5 text-2xl md:ml-4 md:p-4'>PurchaseHistory</p></div>

<div>
  {
    !buyTurfs.length ? (<div className='p-3 text-3xl mt-5 text-center'>Empty</div>) : (buyTurfs.map((turf, index) => (
      <div key={index} className='flex p-4 md:mt-4 mt-2 gap-4 flex-wrap border-b-2 border-gray-200'>

        <div className='w-full md:w-[240px]'>
          <img className="md:h-[188px] w-full md:w-[240px] aspect-video rounded-lg object-cover" src={turf.turfId.image}></img>
        </div>

        <div className='gap-y-5 pl-1 w-full md:w-auto flex-1 relative'>
          <div className='absolute top-0 right-0'>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  turf.status === 'Pending' ? 'bg-amber-500/20 text-amber-500' :
                  turf.status === 'Cancellation_Requested' ? 'bg-blue-500/20 text-blue-400' :
                  turf.status === 'Cancelled' ? 'bg-red-500/20 text-red-500' :
                  'bg-emerald-500/20 text-emerald-500'
              }`}>
                  {turf.status === 'Cancellation_Requested' ? 'Cancellation Pending' : turf.status}
              </span>
          </div>
          <p className='font-bold md:pb-2 md:text-2xl pr-24'>{turf.turfId?.turfName || "Deleted Turf"}</p>
          <div className='flex flex-col md:text-md space-y-1 mb-2'>
            <p><span className='font-medium text-slate-400'>Transaction Date:</span> 
              &nbsp;{new Date(turf.createdAt || turf.updatedAt).toLocaleDateString()}
            </p>
            <p><span className='font-medium text-slate-400'>Play Date:</span> 
              &nbsp;<strong className="text-white">{turf.bookingDate ? new Date(turf.bookingDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : "N/A"}</strong>
            </p>
            <div>
              <span className='font-medium text-slate-400'>Time: </span>
              <strong className="text-white">
                {turf.time ? formatTime12Hour(turf.time.split(',')[0]) : "N/A"}
              </strong>
            </div>
            <div>
              <span className='font-medium text-slate-400'>Amount Paid: </span> <strong className="text-white">₹{turf.price}</strong>
            </div>
            {turf.bookingToken && (
              <div className="mt-1">
                <span className='font-medium text-slate-400 uppercase text-xs tracking-widest'>Token: </span>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded border border-emerald-800">{turf.bookingToken}</span>
              </div>
            )}
          </div>

          <div className='md:mt-4 mt-3 flex gap-3 flex-wrap'>
            {turf.status === "Pending" && (
                <button 
                    onClick={() => handleRequestCancellation(turf._id)}
                    className='rounded px-4 py-2 text-white bg-red-600 hover:bg-red-500 font-semibold text-sm transition-colors shadow-lg'
                >
                    Request Cancellation
                </button>
            )}
            {turf.status === "Allotted" && (
                <button 
                    onClick={() => reviewHandler(turf.turfId._id)}
                    className='rounded px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-500 font-semibold text-sm transition-colors shadow-lg'
                >
                    Rate & Review
                </button>
            )}
          </div>

        </div>

      </div>
    )))

  }
</div>
{reviewModel && <ReviewModal setReviewModal={setReviewModal} turfId={turfId}></ReviewModal>}
        </>)
      }

      
    </div>
  )
}
