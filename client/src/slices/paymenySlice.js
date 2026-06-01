import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    time:null
}

const paymentSlice =createSlice({
    name:"profile",
    initialState: initialState,
    reducers:{
        setTime(state,value){
            state.time=value.payload
        },
    }
});

export const {setTime}=paymentSlice.actions;
export default paymentSlice.reducer;