import { createReducer } from "@reduxjs/toolkit"
import { INotification } from "models"
import { addNotification, readNotification, removeNotification } from "reduxsaga/actions"

const initial: INotification[] = []

export default createReducer(initial, builder=>{
    builder.addCase(addNotification, (state, action)=>{
        const notification = action.payload
        for (const item of state) {
            if (item.notificationId == notification.notificationId) {
                item.read = true
                return
            }
        }
        state.splice(0, 0, notification)
    }).addCase(readNotification, (state, action)=>{
        const notificationId = action.payload
        for (const n of state) {
            if (n.notificationId == notificationId) {
                n.read = true
                break
            }
        }
    }).addCase(removeNotification, (state, action)=>{
        const index = action.payload
        state.splice(index, 1)
    })
})