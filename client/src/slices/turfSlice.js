import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  step: 1,
  turf: null,
  editTurf: false,
  paymentLoading: false,
  priceTime:null,
  priceTimeId:null,
  finalData:null,
}

const turfSlice = createSlice({
  name: "turf",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload
    },
    setTurf: (state, action) => {
      state.turf = action.payload
    },
    setEditTurf: (state, action) => {
      state.editTurf = action.payload
    },
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload
    },
    setPriceTime:(state,action)=>{
      state.priceTime = action.payload
    },
    resetTurfState: (state) => {
      state.step = 1
      state.turf = null
      state.editTurf = false
    },
    setPriceTimeId:(state,action)=>{
      state.priceTimeId=action.payload
    },
    setFinalData:(state,action)=>{
      state.finalData=action.payload
    }
  },
})

export const {
  setStep,
  setTurf,
  setEditTurf,
  setPaymentLoading,
  resetTurfState,
  setPriceTime,
  setPriceTimeId,
  setFinalData
} = turfSlice.actions

export default turfSlice.reducer