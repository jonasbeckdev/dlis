import { createReducer } from "@reduxjs/toolkit"
import {IAdvertise} from 'models'
import {successLoadAdvertise} from '../actions'

const initialAdvertise: IAdvertise[] = []
export default createReducer(initialAdvertise, builder=>{
    builder.addCase(successLoadAdvertise, (state, action)=>{
        return action.payload
    })
})