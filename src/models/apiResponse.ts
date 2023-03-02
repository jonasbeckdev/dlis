export interface IApiException {
    url: string
    code: string | undefined
    message: string
}

export interface IResponse {
    msg: string
    success: string
}

export interface IPage {
    page: number
    size: number
}