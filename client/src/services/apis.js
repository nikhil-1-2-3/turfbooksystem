const BASE_URL = import.meta.env.VITE_BASE_URL;

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
};


// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/contact/contactUs",
};

// setting page API
export const settingsEndpoints = {
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
  UPDATE_DISPLAY_PICTURE_API:BASE_URL + "/profile/updateDisplayPicture"
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_BUY_TURFS_API: BASE_URL + "/profile/getBuyTurf",
  GET_OWNER_TOTAL_EARNING:BASE_URL + "/profile/getTotalEarning"
};

// ADMIN ENDPOINTS
export const adminEndpoints = {
  GET_ALL_USERS_API: BASE_URL + "/admin/getAllUsers",
  GET_ALL_BOOKINGS_API: BASE_URL + "/admin/getAllBookings",
  DELETE_USER_API: BASE_URL + "/admin/deleteUser",
  ALLOT_BOOKING_API: BASE_URL + "/admin/allotBooking",
  APPROVE_CANCELLATION_API: BASE_URL + "/admin/approveCancellation",
}

//turf
export const turfEndpoints = {
  CREATE_TURF_API:BASE_URL + "/turf/createTurf",
  EDIT_TURF_API:BASE_URL+"/turf/editTurf",
  ADD_PRICE_TIME_API:BASE_URL + "/turf/addpricetime",
  EDIT_PRICE_TIME_API:BASE_URL + "/turf/editpricetime",
  DELETE_TURF_API:BASE_URL + "/turf/deleteTurf",
  GET_ALL_OWNER_TURFS_API:BASE_URL+"/turf/getownerturfdetails",
  GET_FULL_TURF_DETAILS_AUTHENTICATED:BASE_URL+"/turf/fullturfdetails",
  GET_ALL_CITIES_API:BASE_URL+ "/turf/fetchcities",
  GET_SPECIFIC_CITY_TURFS_API:BASE_URL+"/turf/specificCityTurfs",
  CREATE_RATING_API: BASE_URL + "/turf/createRating",
  SEARCH_TURF_API: BASE_URL + "/turf/searchTurf",
}

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  TURF_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  TURF_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
  BOOK_OFFLINE_API: BASE_URL + "/payment/bookOffline",
  REQUEST_CANCELLATION_API: BASE_URL + "/payment/requestCancellation",
  VERIFY_BOOKING_API: BASE_URL + "/payment/verifyBooking",
};

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/turf/getReviews",
}

// POST ENDPOINTS
export const postEndpoints = {
  CREATE_POST_API: BASE_URL + "/post/createPost",
  GET_ALL_POSTS_API: BASE_URL + "/post/getAllPosts",
  DELETE_POST_API: BASE_URL + "/post/deletePost"
}