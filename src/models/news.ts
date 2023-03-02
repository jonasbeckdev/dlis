export interface ICategory {
    id: number
    category_image: string
    image: string
    name: string
}

export interface INews {
    id: number
    news_title: string
    news_views: number
    resend_time: number
    news_image: string
    category_image: string
    news_date: string
    news_description: string
    news_gallery_image: string[]
}