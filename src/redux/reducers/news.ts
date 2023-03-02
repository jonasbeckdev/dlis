import { createReducer } from "@reduxjs/toolkit"
import { IAdvertise, INews } from "models"
import { resetHome, successNews } from "reduxsaga/actions"

const initialNews: {
    news: (INews|IAdvertise)[]
} = {news: []}

export default createReducer(initialNews, builder=>{
    builder.addCase(successNews, (state, action)=>{
        state.news = action.payload
    }).addCase(resetHome, (state, action)=>{
        state.news = []
    })    
})