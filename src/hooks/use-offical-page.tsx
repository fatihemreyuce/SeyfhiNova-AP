import { useAuthQuery } from "@/hooks/use-auth-query";
import { getOfficialPages, updateOfficialPage, deleteOfficialPage } from "@/services/offical-page-service";
import type { OfficialPageRequest } from "@/types/offical.page.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useOfficialPages = () => {
    return useAuthQuery({
        queryKey: ["official-pages"],
        queryFn: () => getOfficialPages(),
    });
};

export const useUpdateOfficialPage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: OfficialPageRequest) => updateOfficialPage(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["official-pages"] });
            toast.success("Resmi sayfa başarıyla güncellendi");
        },
        onError: () => {
            toast.error("Resmi sayfa güncellenirken hata oluştu");
        },
    });
};

export const useDeleteOfficialPage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteOfficialPage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["official-pages"] });
            toast.success("Resmi sayfa başarıyla silindi");
        },
        onError: () => {
            toast.error("Resmi sayfa silinirken hata oluştu");
        },
    });
};