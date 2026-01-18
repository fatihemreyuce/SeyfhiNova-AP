import { useAuthQuery } from "@/hooks/use-auth-query";
import { getNotifications, createNotification, updateNotification, deleteNotification, getNotificationById, sendNotification } from "@/services/notifications-service";
import type { NotificationRequest } from "@/types/notifications.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useNotification = (page: number, size: number, sort: string) => {
    return useAuthQuery({
        queryKey: ["notification", page, size, sort],
        queryFn: () => getNotifications(page, size, sort),
    });
};

export const useCreateNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: NotificationRequest) => createNotification(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notification"] });
            toast.success("Bildirim başarıyla oluşturuldu");
        },
        onError: () => {
            toast.error("Bildirim oluşturulurken hata oluştu");
        },
    });
};

export const useUpdateNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: NotificationRequest }) => updateNotification(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notification"] });
            toast.success("Bildirim başarıyla güncellendi");
        },
        onError: () => {
            toast.error("Bildirim güncellenirken hata oluştu");
        },
    });
};

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notification"] });
            toast.success("Bildirim başarıyla silindi");
        },
        onError: () => {
            toast.error("Bildirim silinirken hata oluştu");
        },
    });
};

export const useGetNotificationById = (id: number) => {
    return useAuthQuery({
        queryKey: ["notification", id],
        queryFn: () => getNotificationById(id),
    });
};

export const useSendNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => sendNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notification"] });
            toast.success("Bildirim başarıyla gönderildi");
        },
        onError: () => {
            toast.error("Bildirim gönderilirken hata oluştu");
        },
    });
};