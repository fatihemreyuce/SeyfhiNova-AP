import { useAuthQuery } from "@/hooks/use-auth-query";
import { getPartner, createPartner, updatePartner, deletePartner, getPartnerById } from "@/services/partners-service";
import type { PartnerRequest } from "@/types/partners.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePartner = (search: string, page: number, size: number, sort: string) => {
    return useAuthQuery({
        queryKey: ["partners", search, page, size, sort],
        queryFn: () => getPartner(search, page, size, sort),
    });
};

export const useCreatePartner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: PartnerRequest) => createPartner(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["partners"] });
            toast.success("Partner başarıyla oluşturuldu");
        },
        onError: () => {
            toast.error("Partner oluşturulurken hata oluştu");
        },
    });
};

export const useUpdatePartner = (options?: { suppressToast?: boolean }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: PartnerRequest }) => updatePartner(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["partners"] });
            if (!options?.suppressToast) {
                toast.success("Partner başarıyla güncellendi");
            }
        },
        onError: () => {
            if (!options?.suppressToast) {
                toast.error("Partner güncellenirken hata oluştu");
            }
        },
    });
};

export const useDeletePartner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deletePartner(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["partners"] });
            toast.success("Partner başarıyla silindi");
        },
        onError: () => {
            toast.error("Partner silinirken hata oluştu");
        },
    });
};

export const useGetPartnerById = (id: number) => {
    return useAuthQuery({
        queryKey: ["partners", id],
        queryFn: () => getPartnerById(id),
    });
};
