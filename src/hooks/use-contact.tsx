import { useAuthQuery } from "@/hooks/use-auth-query";
import { getContacts, deleteContact, getContactById } from "@/services/contact-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useContact = (page: number, size: number, sort: string) => {
    return useAuthQuery({
        queryKey: ["contact", page, size, sort],
        queryFn: () => getContacts(page, size, sort),
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