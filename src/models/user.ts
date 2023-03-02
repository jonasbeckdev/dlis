export interface IUser {
    id: number
    pic?: string
    phone: string
    name: string
    family_phone: string
    district_id: number
    verified?: number
}

export interface IUserStore {
    user?: IUser
}
