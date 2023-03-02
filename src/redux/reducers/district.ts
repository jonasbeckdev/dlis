import { createReducer } from "@reduxjs/toolkit";
import { activeDistrict, successDistricts } from "reduxsaga/actions";
import { IDistrict } from "models";

const initialDistrict: {
    districts: {[id: string]: IDistrict}//IDistrict[]
    selectedId: number|null
} = {
    districts: {},
    selectedId: null}

export default createReducer(initialDistrict, builder=>{
    builder.addCase(successDistricts, (state, action)=>{
        state.districts = {}
        for (const disctict of action.payload) {
            state.districts[disctict.id] = disctict
        }
    }).addCase(activeDistrict, (state, action)=>{
        state.selectedId = action.payload
    })
})