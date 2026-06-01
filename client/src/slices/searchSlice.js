import { createSlice } from "@reduxjs/toolkit"

const initialState = {
 show:false,
 shownavbar:true,
 name:"Surat",
 showlogo2:false,
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setShow: (state, action) => {
      state.show = action.payload
    },
    setName:(state,action)=>{
      state.name=action.payload
    },
    setShownavbar:(state,action)=>{
      state.shownavbar=action.payload
    },
    setshowlogo:(state,action)=>{
      state.showlogo2=action.payload
    }
    
  },
})

export const {
    setShow,
    setName,
    setShownavbar,
    setshowlogo
} = searchSlice.actions

export default searchSlice.reducer