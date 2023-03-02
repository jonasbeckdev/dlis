export interface IKeyword {
    id: number
    name: string
}
export interface IHotel {
    id: number
    name: string
    pics?: string[]
    rating?: string
    rooms?: string[]
    keywords: string[]
    amenities?: string
    policies?: string
    nearby?: string
    around?: string
    restaurants?: string
    property1?: string
    property2?: string
}