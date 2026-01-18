import type {  Active, TopPage, dailyStats, conversion, dashboard } from "@/types/analytics.types";
import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";

export const getActiveVisitors = (): Promise<Page<Active[]>> => {
    return fetchClient<void, Page<Active[]>>("/admin/analytics/active", {
        method: "GET",
    });
}

export const getTopPages = (): Promise<Page<TopPage[]>> => {
    return fetchClient<void, Page<TopPage[]>>("/admin/analytics/top-pages", {
        method: "GET",
    });
}

export const getDailyStats = (): Promise<Page<dailyStats[]>> => {
    return fetchClient<void, Page<dailyStats[]>>("/admin/analytics/daily-stats", {
        method: "GET",
    });
}

export const getConversionStats = (): Promise<Page<conversion[]>> => {
    return fetchClient<void, Page<conversion[]>>("/admin/analytics/conversion-stats", {
        method: "GET",
    });
}

export const getDashboard = (): Promise<Page<dashboard>> => {
    return fetchClient<void, Page<dashboard>>("/admin/analytics/dashboard", {
        method: "GET",
    });
}