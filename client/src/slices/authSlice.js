import { createSlice } from "@reduxjs/toolkit";

let initialToken = localStorage.getItem("token");
if (initialToken && initialToken !== "null" && initialToken !== "undefined") {
    try {
        initialToken = JSON.parse(initialToken);
    } catch (e) {
        // Fallback for unstringified legacy tokens
    }
} else {
    initialToken = null;
}

const initialState ={
    token: initialToken,
    isOwner:false
}

const authSlice =createSlice({
    name:"auth",
    initialState: initialState,
    reducers:{
        setSignupData(state, value) {
            state.signupData = value.payload;
          },
          setLoading(state, value) {
            state.loading = value.payload;
          },
        setToken(state,value){
            state.token=value.payload
        },
        setIsOwner(state,value){
            state.isOwner=value.payload
        }
    }
});

export const {setToken,setLoading,setSignupData,setIsOwner}=authSlice.actions;
export default authSlice.reducer;