import { createReducer } from "@reduxjs/toolkit"
import { IUserStore } from "models"
import { clearProfile, setProfile, setProfilePhoto } from "reduxsaga/actions"

const initialUser: IUserStore = {
}
export default createReducer(initialUser, builder=>{
    builder.addCase(setProfile, (state, action)=>{
        state.user = action.payload
    }).addCase(clearProfile, (state, action)=>{
        return initialUser
    }).addCase(setProfilePhoto, (state, action)=>{
        if (state.user) {
            state.user.pic = action.payload
        }
    })
})