import { useAuthQuery } from "./use-auth-query";
import { getUsers, createUser, updateUser, deleteUser, getUserById, changePassword, getUserMe } from "@/services/user-service";
import type { UserRequest } from "@/types/user.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUsers = (search:string, page:number, size:number, sort:string) => {
    return useAuthQuery({
        queryKey: ["users", search, page, size, sort],
        queryFn: () => getUsers(search, page, size, sort),
    });
}

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user:UserRequest) => createUser(user),
        onSuccess: () => {
            toast.success("Kullanıcı başarıyla oluşturuldu");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            toast.error("Kullanıcı oluşturulurken hata oluştu");
        },
    });
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, user }: { id: number; user: UserRequest }) => updateUser(id, user),
        onSuccess: () => {
            toast.success("Kullanıcı başarıyla güncellendi");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            toast.error("Kullanıcı güncellenirken hata oluştu");
        },
    });
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id:number) => deleteUser(id),
        onSuccess: () => {
            toast.success("Kullanıcı başarıyla silindi");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            toast.error("Kullanıcı silinirken hata oluştu");
        },
    });
}

export const useGetUserById = (id:number) => {
    return useAuthQuery({
        queryKey: ["user", id],
        queryFn: () => getUserById(id),
    });
}

export const useChangePassword = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, password }: { id: number; password: string }) => changePassword(id, password),
        onSuccess: () => {
            toast.success("Şifre başarıyla değiştirildi");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            toast.error("Şifre değiştirilirken hata oluştu");
        },
    });
}

export const useGetUserMe = () => {
    return useAuthQuery({
        queryKey: ["user-me"],
        queryFn: () => getUserMe(),
    });
}
