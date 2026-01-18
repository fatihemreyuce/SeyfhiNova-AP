import { useAuthQuery } from "./use-auth-query";
import { getActiveVisitors, getTopPages, getDailyStats, getConversionStats, getDashboard, getActive, track } from "@/services/analytics-service";
import type { trackRequest } from "@/types/analytics.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useActiveVisitors = () => {
    return useAuthQuery({
        queryKey: ["active-visitors"],
        queryFn: () => getActiveVisitors(),
    });
};

export const useTopPages = () => {
    return useAuthQuery({
        queryKey: ["top-pages"],
        queryFn: () => getTopPages(),
    });
};

export const useDailyStats = () => {
    return useAuthQuery({
        queryKey: ["daily-stats"],
        queryFn: () => getDailyStats(),
    });
};

export const useConversionStats = () => {
    return useAuthQuery({
        queryKey: ["conversion-stats"],
        queryFn: () => getConversionStats(),
    });
};

export const useDashboard = () => {
    return useAuthQuery({
        queryKey: ["dashboard"],
        queryFn: () => getDashboard(),
    });
};

export const useActive = () => {
    return useAuthQuery({
        queryKey: ["active"],
        queryFn: () => getActive(),
    });
};

export const createTrack = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({request, visitor_id, session_id}: {request: trackRequest, visitor_id: string, session_id: string}) => track(request, visitor_id, session_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["active"] });
            toast.success("Takip başarıyla oluşturuldu");
        },
        onError: () => {
            toast.error("Takip oluşturulurken hata oluştu");
        },
    });
};