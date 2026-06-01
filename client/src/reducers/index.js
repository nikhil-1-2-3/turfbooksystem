import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import profieReducer from "../slices/profileSlice";
import turfReducer from "../slices/turfSlice";
import searchReducer from "../slices/searchSlice";
import paymentReducer from "../slices/paymenySlice";

const rootReducer = combineReducers({
    auth:authReducer,
    profile:profieReducer,
    turf:turfReducer,
    search:searchReducer,
    payment:paymentReducer
});

export default rootReducer;