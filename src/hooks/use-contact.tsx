import { useAuthQuery } from "@/hooks/use-auth-query";
import { getContacts, createContact, deleteContact, getContactById } from "@/services/contact-service";
import type { ContactRequest } from "@/types/contact.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useContact = (page: number, size: number, sort: string) => {
    return useAuthQuery({
        queryKey: ["contact", page, size, sort],
        queryFn: () => getContacts(page, size, sort),
    });
};

export const useCreateContact = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: ContactRequest) => createContact(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact"] });
            toast.success("İletişim başarıyla oluşturuldu");
        },
        onError: () => {
            toast.error("İletişim oluşturulurken hata oluştu");
        },
    });
};

export const useDeleteContact = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteContact(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact"] });
            toast.success("İletişim başarıyla silindi");
        },
        onError: () => {
            toast.error("İletişim silinirken hata oluştu");
        },
    });
};

export const useGetContactById = (id: number) => {
    return useAuthQuery({
        queryKey: ["contact", id],
        queryFn: () => getContactById(id),
    });
};