export interface INotification {
    notificationId: string
    news_id: string
    title?: string
    body: string
    bigPicture?: string
    external_link?: string
    read: boolean
    date: string
}