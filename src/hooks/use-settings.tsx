import { getSettings, createSettings, updateSettings, deleteSettings } from "@/services/settings-service";
import type { SettingsRequest } from "@/types/settings.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthQuery } from "./use-auth-query";

export const useSettings = () => {
    return useAuthQuery({
        queryKey: ["settings"],
        queryFn: () => getSettings(),
    });
}

export const useCreateSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (settings:SettingsRequest) => createSettings(settings),
        onSuccess: () => {
            toast.success("Ayarlar başarıyla oluşturuldu");
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: () => {
            toast.error("Ayarlar oluşturulurken hata oluştu");
        },
    });
}

export const useUpdateSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, settings }: { id: number; settings: SettingsRequest }) => updateSettings(id, settings),
        onSuccess: () => {
            toast.success("Ayarlar başarıyla güncellendi");
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: () => {
            toast.error("Ayarlar güncellenirken hata oluştu");
        },
    });
}

export const useDeleteSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id:number) => deleteSettings(id),
        onSuccess: () => {
            toast.success("Ayarlar başarıyla silindi");
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: () => {
            toast.error("Ayarlar silinirken hata oluştu");
        },
    });
}

