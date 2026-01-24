import { useAuthQuery } from "@/hooks/use-auth-query";
import {
    getOfficialPages,
    updateOfficialPage,
    deleteOfficialPageDocument,
    addOfficialPageDocument,
    updateOfficialPageDocument,
} from "@/services/offical-page-service";
import type {
    AddDocumentRequest,
    Documents,
    UpdateOfficialPageRequest,
} from "@/types/offical.page.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useOfficialPages = () => {
    return useAuthQuery({
        queryKey: ["official-pages"],
        queryFn: () => getOfficialPages(),
    });
};

export const useUpdateOfficialPage = (options?: { suppressToast?: boolean }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: UpdateOfficialPageRequest) => updateOfficialPage(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["official-pages"] });
            if (!options?.suppressToast) {
                toast.success("Resmi sayfa başarıyla güncellendi");
            }
        },
        onError: () => {
            if (!options?.suppressToast) {
                toast.error("Resmi sayfa güncellenirken hata oluştu");
            }
        },
    });
};

export const useDeleteOfficialPageDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteOfficialPageDocument(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["official-pages"] });
            toast.success("Belge silindi");
        },
        onError: () => {
            toast.error("Belge silinirken hata oluştu");
        },
    });
};

export const useAddOfficialPageDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: AddDocumentRequest) => addOfficialPageDocument(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["official-pages"] });
            toast.success("Belge eklendi");
        },
        onError: () => {
            toast.error("Belge eklenirken hata oluştu");
        },
    });
};

export const useUpdateOfficialPageDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: Documents }) =>
            updateOfficialPageDocument(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["official-pages"] });
            toast.success("Belge güncellendi");
        },
        onError: () => {
            toast.error("Belge güncellenirken hata oluştu");
        },
    });
};

