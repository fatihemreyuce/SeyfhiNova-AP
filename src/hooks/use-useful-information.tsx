import { useAuthQuery } from "@/hooks/use-auth-query";
import { getUsefulInformations, createUsefulInformation, updateUsefulInformation, deleteUsefulInformation, getUsefulInformationById } from "@/services/useful-informations-service";
import type { UsefulInformationRequest } from "@/types/useful.information.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUsefulInformation = (search: string, page: number, size: number, sort: string) => {
    return useAuthQuery({
        queryKey: ["useful-information", search, page, size, sort],
        queryFn: () => getUsefulInformations(search, page, size, sort),
    });
};

export const useCreateUsefulInformation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: UsefulInformationRequest) => createUsefulInformation(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["useful-information"] });
            toast.success("Kullanışlı bilgi başarıyla oluşturuldu");
        },
        onError: () => {
            toast.error("Kullanışlı bilgi oluşturulurken hata oluştu");
        },
    });
};

export const useUpdateUsefulInformation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: UsefulInformationRequest }) => updateUsefulInformation(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["useful-information"] });
            toast.success("Kullanışlı bilgi başarıyla güncellendi");
        },
        onError: () => {
            toast.error("Kullanışlı bilgi güncellenirken hata oluştu");
        },
    });
};

export const useDeleteUsefulInformation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteUsefulInformation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["useful-information"] });
            toast.success("Kullanışlı bilgi başarıyla silindi");
        },
        onError: () => {
            toast.error("Kullanışlı bilgi silinirken hata oluştu");
        },
    });
};

export const useGetUsefulInformationById = (id: number) => {
    return useAuthQuery({
        queryKey: ["useful-information", id],
        queryFn: () => getUsefulInformationById(id),
    });
};
