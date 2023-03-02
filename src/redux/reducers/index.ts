import { combineReducers } from '@reduxjs/toolkit'

import userReducer from './user'
import districtReducer from './district'
import hotelReducer from './hotel'
import notificationReducer from './notifications'
import advertiseReducer from './advertise'
import newsReducer from './news'
import tourReducer from './tourism'

const rootReducer = combineReducers({
    userReducer,
    districtReducer,
    hotelReducer,
    notificationReducer,
    advertiseReducer,
    newsReducer,
    tourReducer
})
export default rootReducer
export type IRootState = ReturnType<typeof rootReducer>