import Toast from 'react-native-toast-message'
import { IApiException, IResponse } from 'models'

export const handleException = (exception: any, cleanUp?: ()=>void) => {
    console.log('exception:', exception)
    if (exception instanceof Error) {
        Toast.show({type: 'error', text1: exception.message, onHide: cleanUp, onPress: cleanUp})
        return
    }
    const apiException = exception as IApiException
    Toast.show({type: 'error', text1: apiException.message, text2: apiException.code, onHide: cleanUp, onPress: cleanUp})
}

export const handleSuccess = (response: IResponse)=>{
    Toast.show({type: 'success', text1: response.msg})
}

export const checkEmailValidation = (email: string)=>{
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
    return reg.test(email)
}

export const checkDomainValidation = (domain: string)=>{
    let reg = /([a-z0-9-]+\.(?:com|net|org|co\.il))(?:\/|$)/
    return reg.test(domain)
}

export function getRandomTo900() {
    const n = Math.floor(Math.random()*900)+1
    return n
}