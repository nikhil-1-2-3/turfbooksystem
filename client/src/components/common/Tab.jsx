import { useDispatch } from "react-redux";
import { setIsOwner } from "../../../src/slices/authSlice";

export default function Tab({ tabData, field, setField }) {

  const dispatch = useDispatch();
  const handleChange = (data)=>{
    setField(data);
    console.log("karn pable: ",data);
    if(data==="Owner"){
      dispatch(setIsOwner(true));
    }
    else{
      dispatch(setIsOwner(false));
    }
  }

    return (
      <div
        style={{
          boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
        }}
        className='flex bg-green-200 font-bold p-1 gap-x-1 my-6 rounded-full max-w-max'
      >
        {tabData.map((tab) => (
          <button
            key={tab.id}
            onClick={()=>handleChange(tab.type)}
            className={`${
              field === tab.type
                ? 'bg-green-500 text-white'
                : "bg-transparent text-richblack-200"
            } py-2 px-5 rounded-full transition-all duration-200`}
          >
            {tab?.tabName}
          </button>
        ))}
      </div>
    );
  }