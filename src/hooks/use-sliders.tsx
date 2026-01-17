import { useAuthQuery } from "@/hooks/use-auth-query";
import { getSlider, createSlider, updateSlider, deleteSlider, getSliderById } from "@/services/slider-service";
import type { SliderRequest } from "@/types/slider.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSlider = (search: string, page: number, size: number, sort: string) => {
    return useAuthQuery({
        queryKey: ["sliders", search, page, size, sort],
        queryFn: () => getSlider(search, page, size, sort),
    });
};

export const useCreateSlider = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: SliderRequest) => createSlider(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sliders"] });
            toast.success("Slider başarıyla oluşturuldu");
        },
        onError: () => {
            toast.error("Slider oluşturulurken hata oluştu");
        },
    });
};

export const useUpdateSlider = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: SliderRequest }) => updateSlider(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sliders"] });
            toast.success("Slider başarıyla güncellendi");
        },
        onError: () => {
            toast.error("Slider güncellenirken hata oluştu");
        },
    });
};

export const useDeleteSlider = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteSlider(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sliders"] });
            toast.success("Slider başarıyla silindi");
        },
        onError: () => {
            toast.error("Slider silinirken hata oluştu");
        },
    });
};

export const useGetSliderById = (id: number) => {
    return useAuthQuery({
        queryKey: ["sliders", id],
        queryFn: () => getSliderById(id),
    });
};
