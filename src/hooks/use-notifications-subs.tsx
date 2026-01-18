import { useAuthQuery } from "@/hooks/use-auth-query";
import { getNotificationSubs, createNotificationSub, deleteNotificationSub } from "@/services/notifications-subs-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { NotificationSubRequest } from "@/types/notification.subs.types";

export const useNotificationSubs = (page: number, size: number, sort: string) => {
    return useAuthQuery({
        queryKey: ["notification-subs", page, size, sort],
        queryFn: () => getNotificationSubs(page, size, sort),
    });
};

export const useCreateNotificationSub = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: NotificationSubRequest) => createNotificationSub(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notification-subs"] });
            toast.success("Bildirim aboneliği başarıyla oluşturuldu");
        },
        onError: () => {
            toast.error("Bildirim aboneliği oluşturulurken hata oluştu");
        },
    });
};

export const useDeleteNotificationSub = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteNotificationSub(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notification-subs"] });
            toast.success("Bildirim aboneliği başarıyla silindi");
        },
        onError: () => {
            toast.error("Bildirim aboneliği silinirken hata oluştu");
        },
    });
};