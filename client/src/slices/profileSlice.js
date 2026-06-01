import { createSlice } from "@reduxjs/toolkit";

const safeParse = (key) => {
    let item = localStorage.getItem(key);
    if (item && item !== "null" && item !== "undefined") {
        try { return JSON.parse(item); } catch (e) { return item; }
    }
    return null;
};

const initialState ={
    user: safeParse("user"),
    profileImage: safeParse("userImage"),
    loading:false,
}

const profileSlice =createSlice({
    name:"profile",
    initialState: initialState,
    reducers:{
        setUser(state,value){
            state.user=value.payload
            localStorage.setItem("user",JSON.stringify(value.payload));
        },
        setLoading(state,value){
            state.loading=value.payload
        },
    }
});

export const {setUser,setLoading}=profileSlice.actions;
export default profileSlice.reducer;