import { useAuthQuery } from "@/hooks/use-auth-query";
import { getServiceCategory, createServiceCategory, updateServiceCategory, deleteServiceCategory, getServiceCategoryById } from "@/services/category-service-service";
import type { ServiceCategoryRequest } from "@/types/service.category.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

export const useServiceCategory = (search:string, page:number, size:number, sort:string) => {
    return useAuthQuery({
        queryKey: ["service-category", search, page, size, sort],
        queryFn: () => getServiceCategory(search, page, size, sort),
    });
}

export const useCreateServiceCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: ServiceCategoryRequest) => createServiceCategory(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["service-category"] });
            toast.success("Servis kategori başarıyla oluşturuldu");
        },
        onError: () => {
            toast.error("Servis kategori oluşturulurken hata oluştu");
        },
    });
}

export const useUpdateServiceCategory = (options?: { suppressToast?: boolean }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: ServiceCategoryRequest }) => updateServiceCategory(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["service-category"] });
            if (!options?.suppressToast) {
                toast.success("Servis kategori başarıyla güncellendi");
            }
        },
        onError: () => {
            if (!options?.suppressToast) {
                toast.error("Servis kategori güncellenirken hata oluştu");
            }
        },
    });
}

export const useDeleteServiceCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id:number) => deleteServiceCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["service-category"] });
            toast.success("Servis kategori başarıyla silindi");
        },
        onError: () => {
            toast.error("Servis kategori silinirken hata oluştu");
        },
    });
}

export const useGetServiceCategoryById = (id:number) => {
    return useAuthQuery({
        queryKey: ["service-category", id],
        queryFn: () => getServiceCategoryById(id),
    });
}