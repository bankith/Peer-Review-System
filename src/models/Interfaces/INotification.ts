import { AxiosResponse } from "axios";

export interface INotification {
    GetNotifications(): Promise<AxiosResponse>;
    MarkAllNotificationsAsRead(): Promise<AxiosResponse>;
}