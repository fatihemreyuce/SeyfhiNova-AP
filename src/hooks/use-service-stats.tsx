import { useAuthQuery } from "@/hooks/use-auth-query";
import { getServiceStats, createServiceStats, updateServiceStats, deleteServiceStats, getServiceStatsById } from "@/services/service-stats-service";
import type { ServiceStatsRequest } from "@/types/service.stats.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

export const useServiceStats = (search:string, page:number, size:number, sort:string) => {
    return useAuthQuery({
        queryKey: ["service-stats", search, page, size, sort],
        queryFn: () => getServiceStats(search, page, size, sort),
    });
}

export const useCreateServiceStats = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: ServiceStatsRequest) => createServiceStats(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["service-stats"] });
            toast.success("Servis istatistikleri başarıyla oluşturuldu");
        },
        onError: () => {
            toast.error("Servis istatistikleri oluşturulurken hata oluştu");
        },
    });
}

export const useUpdateServiceStats = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: ServiceStatsRequest }) => updateServiceStats(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["service-stats"] });
            toast.success("Servis istatistikleri başarıyla güncellendi");
        },
        onError: () => {
            toast.error("Servis istatistikleri güncellenirken hata oluştu");
        },
    });
}

export const useDeleteServiceStats = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id:number) => deleteServiceStats(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["service-stats"] });
            toast.success("Servis istatistikleri başarıyla silindi");
        },
        onError: () => {
            toast.error("Servis istatistikleri silinirken hata oluştu");
        },
    });
}

export const useGetServiceStatsById = (id:number) => {
    return useAuthQuery({
        queryKey: ["service-stats", id],
        queryFn: () => getServiceStatsById(id),
    });
}
