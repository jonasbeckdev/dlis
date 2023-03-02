import {createAction} from '@reduxjs/toolkit'
import { IAdvertise, IDistrict, IHotel, IKeyword, INews, INotification, ITour, IUser } from 'models'

export const successDistricts = createAction<IDistrict[]>('successDistricts')
export const activeDistrict = createAction<number>('activeDistrict')
export const setProfile = createAction<IUser>('setProfile')
export const setProfilePhoto = createAction<string>('setProfilePhoto')
export const clearProfile = createAction('clearProfile')
export const setHotelKeywords = createAction<IKeyword[]>('setHotelKeywords')
export const successLoadAdvertise = createAction<IAdvertise[]>('successLoadAdvertise')
export const addNotification = createAction<INotification>('addNotification')
export const readNotification = createAction<string>('readNotification')
export const removeNotification = createAction<number>('removeNotification')
export const successHotels = createAction<(IHotel|IAdvertise)[]>('successHotels')
export const successNews = createAction<(INews|IAdvertise)[]>('successNews')
export const successTours = createAction<(ITour|IAdvertise)[]>('successTours')
export const resetHome = createAction('resetHome')
