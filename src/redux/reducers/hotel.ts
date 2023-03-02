import { createReducer } from "@reduxjs/toolkit"
import { resetHome, setHotelKeywords, successHotels } from "reduxsaga/actions"
import { IAdvertise, IHotel, IKeyword } from "models"

const initialHotel: {
    hotels: (IHotel|IAdvertise)[]
    keywords: {
        [id: string]: string    
    }
} = {keywords: {}, hotels: []}

export default createReducer(initialHotel, builder=>{
    builder.addCase(setHotelKeywords, (state, action)=>{
        const keywords = action.payload
        for (const keyword of keywords) {
            state.keywords[keyword.id] = keyword.name
        }
    }).addCase(successHotels, (state, action)=>{
        state.hotels = action.payload
    }).addCase(resetHome, (state, action)=>{
        state.hotels = []
    })
})