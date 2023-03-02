import { store } from "reduxsaga/store"
import Geolocation from 'react-native-geolocation-service'
import { apiBase, apiKey } from "./constants"
import { getRandomTo900 } from "./functions"
import md5 from 'md5'
import base64 from 'base-64'
import {
    IPropRate,
    ITour, ICategory, INews, IPage, IResponse, IDistrict, IUser, IHotel, IKeyword, IEservice, IWantedList, IJob, IProject, IProperty, ICompType, IComplaint, IPermit, IAdvertise, IProgram } from "models"
import {Image as CropImage} from 'react-native-image-crop-picker'

interface GetPayload {
    url: string
    headers?: any,
    authorization?: boolean
}

interface PostPayload extends GetPayload {
    body?: any
}

export interface ApiException {
    code: string | undefined
    message: string
}

const setHeaderAuthrization = (headers: any)=>{
    const ret = headers?headers:{}
    const token = store.getState().userReducer.user?.id
    if (token) {
        ret['Authorization'] = `Bearer ${token}`
    }
    return ret
}

const checkStatus = async (response: Response) => {
    if (response.status != 200) {
        throw await response.json() as ApiException
    }
}

const checkError = (json: any) => {
    const res = json.NEWS_APP
    var exception: ApiException
    if (!res) {
        exception = {code: undefined, message: json['Response type error']}
        throw exception
    }
    const status = res['success']
    if (status != 1) {
        switch (status) {
            default:
                exception = {code: undefined, message: res['msg']}
                break
        }
        throw exception
    }
    return res
}

export const getAPI = async ({url, headers, authorization}: GetPayload) => {
    // console.log('url:', url)
    const response = await fetch(url, {
        method: 'GET',
        headers: authorization==false?headers:setHeaderAuthrization(headers),
    })
    await checkStatus(response)
    const json = await response.json()
    return checkError(json)
}

const postAPI = async ({url, body, headers, authorization}: PostPayload) => {
    // console.log('url:', url)
    const response = await fetch(url, {
        method: 'POST',
        headers: authorization==false?headers:setHeaderAuthrization(headers),
        body
    })
    await checkStatus(response)
    const json = await response.json()
    return checkError(json)
}

interface LoginPayload {
    phone: string
    password: string
}

export async function apiLogin(payload: LoginPayload) {
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'users_login',
        'password': payload.password,
        'phone': payload.phone
    }))
    const body = new FormData()
    body.append('data', bodyString)
    return await postAPI({url: apiBase, body}) as {user: IUser}
}

export async function apiGetDistrict() {
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'get_district',
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as {districts: IDistrict[]}
    return result.districts
}

interface SignupPayload {
    phone: string
    name: string
    family_phone: string
    district_id: number
    password: string
}

export async function apiSignup(payload: SignupPayload) {
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'user_register',
        'district_id': payload.district_id,
        'family_phone': payload.family_phone,
        'name': payload.name,
        'password': payload.password,
        'phone': payload.phone
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as {user_id: number}
    return result.user_id
}

interface SendVerificationCodePayload {
    user_id: number
    user_phone: string
}
export async function apiSendVerificationCode(payload: SendVerificationCodePayload) {
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'send_verification_code',
        'user_id': payload.user_id,
        'user_phone': payload.user_phone
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as IResponse
    return result
}

export async function apiCheckVerificationCode(payload: {user_id: number, code: string}) {
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'check_verification_code',
        'user_id': payload.user_id,
        'code': payload.code
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as IResponse
    return result
}

export async function apiUserProfile(id: number) {
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'user_profile',
        'id': id,
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as {user: IUser}
    return result.user
}

interface IHomeNews {
    category_list: ICategory[]
    featured_news: INews[]
    latest_news: INews[]
}
export async function apiHomeNews() {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'get_home_news',
        'user_id': user_id,
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as IHomeNews
    return result
}

export async function apiHotels(payload?: IPage) {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'get_hotels',
        'user_id': user_id,
        'page': payload?.page,
        'size': payload?.size
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as {hotels: IHotel[]}
    return result.hotels
}

export async function apiHotelKeywords() {
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'get_keywords',
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as {keywords: IKeyword[]}
    return result.keywords
}

export async function apiTours(payload?: IPage) {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'get_tours',
        'user_id': user_id,
        'page': payload?.page,
        'size': payload?.size
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as {tours: ITour[]}
    return result.tours
}

export async function apiEservices(payload?: IPage) {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'get_eservices',
        'user_id': user_id,
        'page': payload?.page,
        'size': payload?.size
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as {eservices: IEservice[]}
    return result.eservices
}

export async function apiWantedLists(payload?: IPage) {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'get_wlists',
        'user_id': user_id,
        'page': payload?.page,
        'size': payload?.size
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as {wlists: IWantedList[]}
    return result.wlists
}

export async function apiJobs(payload?: IPage) {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'get_jobs',
        'user_id': user_id,
        'page': payload?.page,
        'size': payload?.size
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as {jobs: IJob[]}
    return result.jobs
}

export async function apiProjects(payload?: IPage) {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'get_projects',
        'user_id': user_id,
        'page': payload?.page,
        'size': payload?.size
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as {projects: IProject[]}
    return result.projects
}

export async function apiSearchHotels(name: string) {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'get_search_hotels',
        'user_id': user_id,
        'name': name,
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as {hotels: IHotel[]}
    return result.hotels
    
}

export async function apiPropRates() {
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'get_prop_rate',
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as {propRates: IPropRate[]}
    return result.propRates
}

export async function apiPropertics() {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'get_properties',
        'user_id': user_id,
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as {properties: IProperty[]}
    return result.properties
}

interface ISendPropertyPayload {
    username: string
    location: string
    contact_address: string
    property_rate: number
    amount_paid: string
    property_code: number
}

export async function apiSendProperty(payload: ISendPropertyPayload) {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'send_property',
        'user_id': user_id,
        'username': payload.username,
        'location': payload.location,
        'contact_address': payload.contact_address,
        'property_rate': payload.property_rate,
        'amount_paid': payload.amount_paid,
        'property_code': payload.property_code,
    }))
    const body = new FormData()
    body.append('data', bodyString)
    return postAPI({url: apiBase, body})
}

export async function apiCompTypes() {
    const district_id = store.getState().userReducer.user?.district_id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'get_comp_type',
        'district_id': district_id
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as {types: ICompType[]}
    return result.types
}

export async function apiComplains() {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'get_complaint',
        'user_id': user_id,
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as {complains: IComplaint[]}
    return result.complains
}

interface INewComplainPayload {
    name: string
    phone: string
    comp_type_id: number
    complain: string
    latitude?: number
    longitude?: number
    complaintImage?: CropImage
}

export async function apiNewComplain(payload: INewComplainPayload) {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'send_complain',
        'user_id': user_id,
        'name': payload.name,
        'phone': payload.phone,
        'comp_type_id': payload.comp_type_id,
        'complain': payload.complain,
        'latitude': payload.latitude,
        'longitude': payload.longitude,
    }))
    const body = new FormData()
    body.append('data', bodyString)
    if (payload.complaintImage) {
        const image = {
            uri: payload.complaintImage.path,
            type: payload.complaintImage.mime,
            name: payload.complaintImage.path.substring(payload.complaintImage.path.lastIndexOf('/')+1)
        }
        body.append('image', image)
    }
    return postAPI({url: apiBase, headers: {"Content-Type": "multipart/form-data"}, body})
}

export async function apiPermits() {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'get_permit',
        'user_id': user_id,
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as {permits: IPermit[]}
    return result.permits
}

export async function apiNewPermit(code: string) {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'send_permit',
        'user_id': user_id,
        'code': code,
    }))
    const body = new FormData()
    body.append('data', bodyString)
    return postAPI({url: apiBase, body})
}

interface IUpdatePasswordPayload {
    old_password: string
    new_password: string
}
export async function apiUpdatePassword(payload: IUpdatePasswordPayload) {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'update_password',
        'user_id': user_id,
        'old_password': payload.old_password,
        'new_password': payload.new_password,
    }))
    const body = new FormData()
    body.append('data', bodyString)
    return postAPI({url: apiBase, body})
}

interface IUpdateProfilePayload {
    name: string
    phone: string
    family_phone: string
    district_id: number
}
export async function apiUpdateProfile(payload: IUpdateProfilePayload) {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'user_profile_update',
        'user_id': user_id,
        'name': payload.name,
        'phone': payload.phone,
        'family_phone': payload.family_phone,
        'district_id': payload.district_id,
    }))
    const body = new FormData()
    body.append('data', bodyString)
    return postAPI({url: apiBase, body})
}

export async function apiUploadUserPic(pic: CropImage) {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
        const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'upload_user_pic',
        'user_id': user_id
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const image = {
        uri: pic.path,
        type: pic.mime,
        name: pic.path.substring(pic.path.lastIndexOf('/')+1)
    }
    body.append('image', image)
    return await postAPI({url: apiBase, body, headers: {"Content-Type": "multipart/form-data"}}) as {pic: string}
}

export async function apiSendLocation(location: Geolocation.GeoCoordinates, eservice_id: number) {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'send_eservice_location',
        'user_id': user_id,
        'eservice_id': eservice_id,
		'latitude': location.latitude,
		'longitude': location.longitude,
    }))
    const body = new FormData()
    body.append('data', bodyString)
    return postAPI({url: apiBase, body})
}

export async function apiAddUserLocation(eservice_id: number) {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'add_eservice_location',
        'user_id': user_id,
        'eservice_id': eservice_id,
    }))
    const body = new FormData()
    body.append('data', bodyString)
    return postAPI({url: apiBase, body})
}

export async function apiAdvertises() {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'get_advertises',
        'user_id': user_id,
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const result = await postAPI({url: apiBase, body}) as {advertises: IAdvertise[]}
    return result.advertises
}

export async function apiPrograms() {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'get_programs',
        'user_id': user_id,
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const res = await postAPI({url: apiBase, body}) as {programs: IProgram[]}
    return res.programs
}

export async function apiUpdateOnesignalId(onesignal_id: string) {
    const user_id = store.getState().userReducer.user?.id
    const salt = getRandomTo900()
    const sign =  md5(apiKey+salt)
    const bodyString = base64.encode(JSON.stringify({
        'sign': sign,
        'salt': salt,
        'method_name': 'update_onsignal_id',
        'user_id': user_id,
        'onesignal_id': onesignal_id,
    }))
    const body = new FormData()
    body.append('data', bodyString)
    const res = await postAPI({url: apiBase, body})
}