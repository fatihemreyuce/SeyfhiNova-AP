import type { NotificationSubResponse } from "@/types/notification.subs.types";
import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";

export const getNotificationSubs = (page: number, size: number, sort: string): Promise<Page<NotificationSubResponse>> => {
    return fetchClient<void, Page<NotificationSubResponse>>(`/admin/notification-subscribers?page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
};

export const deleteNotificationSub = (id: number): Promise<void> => {
    return fetchClient<void, void>(`/admin/notification-subscribers/${id}`, {
        method: "DELETE",
    });
};