import { useAuthQuery } from "@/hooks/use-auth-query";
import { getFaq, createFaq, updateFaq, deleteFaq, getFaqById } from "@/services/faqs-service";
import type { FaqRequest } from "@/types/faqs.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useFaq = (search: string, page: number, size: number, sort: string) => {
    return useAuthQuery({
        queryKey: ["faqs", search, page, size, sort],
        queryFn: () => getFaq(search, page, size, sort),
    });
};

export const useCreateFaq = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: FaqRequest) => createFaq(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
            toast.success("Sıkça Sorulan Soru başarıyla oluşturuldu");
        },
        onError: () => {
            toast.error("Sıkça Sorulan Soru oluşturulurken hata oluştu");
        },
    });
};

export const useUpdateFaq = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: FaqRequest }) => updateFaq(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
            toast.success("Sıkça Sorulan Soru başarıyla güncellendi");
        },
        onError: () => {
            toast.error("Sıkça Sorulan Soru güncellenirken hata oluştu");
        },
    });
};

export const useDeleteFaq = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteFaq(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
            toast.success("Sıkça Sorulan Soru başarıyla silindi");
        },
        onError: () => {
            toast.error("Sıkça Sorulan Soru silinirken hata oluştu");
        },
    });
};

export const useGetFaqById = (id: number) => {
    return useAuthQuery({
        queryKey: ["faqs", id],
        queryFn: () => getFaqById(id),
    });
};
