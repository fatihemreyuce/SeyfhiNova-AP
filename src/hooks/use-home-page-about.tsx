import { useAuthQuery } from "@/hooks/use-auth-query";
import { getHomePageAbout, createHomePageAbout, updateHomePageAbout, deleteHomePageAbout, getHomePageAboutById} from "@/services/home-page-about-service";
import type {  HomePageRequest } from "@/types/home.page.about.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

export const useHomePageAbout = (
    search:string,
    page:number,
    size:number,
    sort:string
) => {
    return useAuthQuery({
        queryKey: ["homepage-about", search, page, size, sort],
        queryFn: () => getHomePageAbout(search, page, size, sort),
    });
}

export const useCreateHomePageAbout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: HomePageRequest) => createHomePageAbout(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["homepage-about"] });
            toast.success("Ana sayfa hakkında başarıyla oluşturuldu");
        },
        onError: (error: any) => {
            const errorMessage = error?.message || "Ana sayfa hakkında oluşturulurken hata oluştu";
            toast.error(errorMessage);
        },
    });
}

export const useUpdateHomePageAbout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: HomePageRequest }) => 
            updateHomePageAbout(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["homepage-about"] });
            toast.success("Ana sayfa hakkında başarıyla güncellendi");
        },
        onError: (error: any) => {
            const errorMessage = error?.message || "Ana sayfa hakkında güncellenirken hata oluştu";
            toast.error(errorMessage);
        },
    });
}

export const useDeleteHomePageAbout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteHomePageAbout(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["homepage-about"] });
            toast.success("Ana sayfa hakkında başarıyla silindi");
        },
        onError: () => {
            toast.error("Ana sayfa hakkında silinirken hata oluştu");
        },
    });
}

export const useGetHomePageAboutById = (id: number) => {
    return useAuthQuery({
        queryKey: ["homepage-about", id],
        queryFn: () => getHomePageAboutById(id),
    });
}