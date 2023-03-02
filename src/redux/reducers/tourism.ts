import { createReducer } from "@reduxjs/toolkit"
import { IAdvertise, ITour } from "models"
import { resetHome, successTours } from "reduxsaga/actions"

const initialTours: {
    tours: (ITour|IAdvertise)[]
} = {tours: []}

export default createReducer(initialTours, builder=>{
    builder.addCase(successTours, (state, action)=>{
        state.tours = action.payload
    }).addCase(resetHome, (state, action)=>{
        state.tours = []
    })
})