import { useAuthQuery } from "./use-auth-query";
import { getActiveVisitors, getTopPages, getDailyStats, getConversionStats, getDashboard } from "@/services/analytics-service";

export const useActiveVisitors = () => {
    return useAuthQuery({
        queryKey: ["active-visitors"],
        queryFn: () => getActiveVisitors(),
    });
}

export const useTopPages = () => {
    return useAuthQuery({
        queryKey: ["top-pages"],
        queryFn: () => getTopPages(),
    });
}

export const useDailyStats = () => {
    return useAuthQuery({
        queryKey: ["daily-stats"],
        queryFn: () => getDailyStats(),
    });
}

export const useConversionStats = () => {
    return useAuthQuery({
        queryKey: ["conversion-stats"],
        queryFn: () => getConversionStats(),
    });
}

export const useDashboard = () => {
    return useAuthQuery({
        queryKey: ["dashboard"],
        queryFn: () => getDashboard(),
    });
}