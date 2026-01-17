import { useAuthQuery } from "@/hooks/use-auth-query";
import { getCircular, createCircular, updateCircular, deleteCircular, getCircularById } from "@/services/circulars-service";
import type { CircularRequest } from "@/types/circulars.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCircular = (search: string, page: number, size: number, sort: string) => {
    return useAuthQuery({
        queryKey: ["circular", search, page, size, sort],
        queryFn: () => getCircular(search, page, size, sort),
    });
};

export const useCreateCircular = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: CircularRequest) => createCircular(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["circular"] });
            toast.success("Genelge başarıyla oluşturuldu");
        },
        onError: () => {
            toast.error("Genelge oluşturulurken hata oluştu");
        },
    });
};

export const useUpdateCircular = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: CircularRequest }) => updateCircular(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["circular"] });
            toast.success("Genelge başarıyla güncellendi");
        },
        onError: () => {
            toast.error("Genelge güncellenirken hata oluştu");
        },
    });
};

export const useDeleteCircular = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteCircular(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["circular"] });
            toast.success("Genelge başarıyla silindi");
        },
        onError: () => {
            toast.error("Genelge silinirken hata oluştu");
        },
    });
};

export const useGetCircularById = (id: number) => {
    return useAuthQuery({
        queryKey: ["circular", id],
        queryFn: () => getCircularById(id),
    });
};
