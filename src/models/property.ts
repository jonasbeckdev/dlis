export interface IPropRate {
    id: number
    name: string
    amount: number
}

export interface IProperty {
    id: number
    property_code: string
    username: string
    location: string
    contact_address: string
    property_rate_name: string
    amount_paid: number
    outstanding: number
    evaluation: number
    property_rate_amount: null
}