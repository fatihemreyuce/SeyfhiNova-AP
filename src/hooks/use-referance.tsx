import { useAuthQuery } from "@/hooks/use-auth-query";
import { getReferance, createReferance, updateReferance, deleteReferance, getReferanceById } from "@/services/referance-service";
import type { ReferanceRequest } from "@/types/referance.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useReferance = (search: string, page: number, size: number, sort: string) => {
    return useAuthQuery({
        queryKey: ["referance", search, page, size, sort],
        queryFn: () => getReferance(search, page, size, sort),
    });
};

export const useCreateReferance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: ReferanceRequest) => createReferance(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["referance"] });
            toast.success("Referans başarıyla oluşturuldu");
        },
        onError: () => {
            toast.error("Referans oluşturulurken hata oluştu");
        },
    });
};

export const useUpdateReferance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: ReferanceRequest }) => updateReferance(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["referance"] });
            toast.success("Referans başarıyla güncellendi");
        },
        onError: () => {
            toast.error("Referans güncellenirken hata oluştu");
        },
    });
};

export const useDeleteReferance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteReferance(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["referance"] });
            toast.success("Referans başarıyla silindi");
        },
        onError: () => {
            toast.error("Referans silinirken hata oluştu");
        },
    });
};

export const useGetReferanceById = (id: number) => {
    return useAuthQuery({
        queryKey: ["referance", id],
        queryFn: () => getReferanceById(id),
    });
};
