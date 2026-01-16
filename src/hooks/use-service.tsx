import { useAuthQuery } from "@/hooks/use-auth-query";
import { getService, createService, updateService, deleteService, getServiceById } from "@/services/service-service";
import type { ServiceRequest } from "@/types/services.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

export const useService = (search:string, page:number, size:number, sort:string) => {
    return useAuthQuery({
        queryKey: ["service", search, page, size, sort],
        queryFn: () => getService(search, page, size, sort),
    });
}

export const useCreateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: ServiceRequest) => createService(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["service"] });
            toast.success("Servis başarıyla oluşturuldu");
        },
        onError: () => {
            toast.error("Servis oluşturulurken hata oluştu");
        },
    });
}

export const useUpdateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: ServiceRequest }) => updateService(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["service"] });
            toast.success("Servis başarıyla güncellendi");
        },
        onError: () => {
            toast.error("Servis güncellenirken hata oluştu");
        },
    });
}

export const useDeleteService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id:number) => deleteService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["service"] });
            toast.success("Servis başarıyla silindi");
        },
        onError: () => {
            toast.error("Servis silinirken hata oluştu");
        },
    });
}

export const useGetServiceById = (id:number) => {
    return useAuthQuery({
        queryKey: ["service", id],
        queryFn: () => getServiceById(id),
    });
}