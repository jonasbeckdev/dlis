export interface ICompType {
    id: number
    name: string
    district_id: number
}

export interface IComplaint {
    id: number
    name: string
    time: string
    comp_type: string
    complain: string
    resolved: number
    news_image?: string
}