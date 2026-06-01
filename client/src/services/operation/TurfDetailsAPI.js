import { toast } from "react-hot-toast";
// import { setProgress } from "../../slices/loadingBarSlice";

// import { setLoading } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { turfEndpoints } from "../apis";

const {
  CREATE_TURF_API,
  EDIT_TURF_API,
  EDIT_PRICE_TIME_API,
  ADD_PRICE_TIME_API,
  DELETE_TURF_API,
  GET_ALL_OWNER_TURFS_API,
  GET_FULL_TURF_DETAILS_AUTHENTICATED,
  GET_ALL_CITIES_API,
  GET_SPECIFIC_CITY_TURFS_API,
  CREATE_RATING_API,
  SEARCH_TURF_API
} = turfEndpoints;




// add the course details
export const addCourseDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CREATE_TURF_API, data, {
      "Content-Type": "multipart/form-data",
      Authorisation: `Bearer ${token}`,
    });
    console.log("CREATE TURF API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Add Turf Details");
    }
    toast.success("Turf Details Added Successfully");
    console.log("response: ",response);
    result = response?.data?.data;
  } catch (error) {
    console.log("CREATE TURF API ERROR............", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const addPriceTime = async(data,token)=>{
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", ADD_PRICE_TIME_API, data, {
      Authorisation: `Bearer ${token}`,
    });
    console.log("CREATE TURF API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Add Turf Details");
    }
    toast.success("PriceTime Details Added Successfully");
    console.log("response: ",response);
    result = response?.data?.data;
  } catch (error) {
    console.log("CREATE TURF API ERROR............", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
  return result;
}

// edit price time
export const editPriceTime = async(data,token)=>{
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", EDIT_PRICE_TIME_API, data, {
      Authorisation: `Bearer ${token}`,
    });
    console.log("CREATE TURF API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Add Turf Details");
    }
    toast.success("Turf Details Edited Successfully");
    console.log("response in editpricetime API: ",response);
    result = response?.data?.data;
    
  } catch (error) {
    console.log("CREATE TURF API ERROR............", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
  return result;
}

// edit the course details
export const editCourseDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", EDIT_TURF_API,data, {
      "Content-Type": "multipart/form-data",
      Authorisation: `Bearer ${token}`,
    });
    console.log("EDIT COURSE API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details");
    }
    toast.success("Turf Details Updated Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("EDIT TURF API ERROR............", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
  return result;
};


// fetching all courses under a specific instructor
export const fetchOwnerTurfs = async (token) => {
  let result = [];
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_OWNER_TURFS_API,
      null,
      {
        Authorisation: `Bearer ${token}`,
      }
    );
    console.log("INSTRUCTOR COURSES API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("INSTRUCTOR COURSES API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// delete a course
export const RemovedTurf = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("DELETE", DELETE_TURF_API, data, {
      Authorisation: `Bearer ${token}`,
    });
    console.log("Removed TURF API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Removed Turf");
    }
    toast.success("Turf Removed");
  } catch (error) {
    console.log("DELETE TURF API ERROR............", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
};


// get full details of a turf

export const getFullDetailsOfTurf = async (turfId, date) => {
  const toastId = toast.loading("Loading...")
  let result = null;
  try {
    const response = await apiConnector("POST", GET_FULL_TURF_DETAILS_AUTHENTICATED, {
      turfId,
      date
    });
    console.log("COURSE_DETAILS_API API RESPONSE............", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data;
    console.log("result: ",result);
  } catch (error) {
    console.log("COURSE_DETAILS_API API ERROR............", error);
    result = error.response.data;
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId)
  return result;
};


export const fetchAllCities = async () => {
  let result = [];
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_CITIES_API,
      null,
    );
    console.log("ALL CITIES API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("INSTRUCTOR COURSES API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// edit the course details
export const fetchSpecificCityTurfs = async (data) => {
  console.log("data: ",data);
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", GET_SPECIFIC_CITY_TURFS_API,data);
    console.log("Specific City Turfs API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details");
    }
    // toast.success("Turfs Fetch Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("EDIT TURF API ERROR............", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
  return result;
};


export const createRating = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let success = false;
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorisation: `Bearer ${token}`,
    });
    console.log("CREATE RATING API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Create Rating");
    }
    toast.success("Rating Posted");
    success = true;
  } catch (error) {
    success = false;
    console.log("CREATE RATING API ERROR............", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
  return success;
};




// //search turfs
export const searchTurf = async (searchQuery) => {
  const toastId = toast.loading("Loading...")
  let result = null;
  try {
    const response = await apiConnector("POST", SEARCH_TURF_API, {
      searchQuery: searchQuery,
    });
    console.log("SEARCH COURSES API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Search Courses");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("SEARCH COURSES API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId)
  return result;
};