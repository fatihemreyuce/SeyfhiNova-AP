import type {  Active, TopPage, dailyStats, conversion, dashboard, trackRequest, trackResponse } from "@/types/analytics.types";
import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";

export const getActiveVisitors = (): Promise<Page<Active[]>> => {
    return fetchClient<void, Page<Active[]>>("/admin/analytics/active", {
        method: "GET",
    });
};

export const getTopPages = (): Promise<Page<TopPage[]>> => {
    return fetchClient<void, Page<TopPage[]>>("/admin/analytics/top-pages", {
        method: "GET",
    });
};

export const getDailyStats = (): Promise<Page<dailyStats[]>> => {
    return fetchClient<void, Page<dailyStats[]>>("/admin/analytics/daily-stats", {
        method: "GET",
    });
};

export const getConversionStats = (): Promise<Page<conversion[]>> => {
    return fetchClient<void, Page<conversion[]>>("/admin/analytics/conversion-stats", {
        method: "GET",
    });
};

export const getDashboard = (): Promise<dashboard> => {
    return fetchClient<void, dashboard>("/admin/analytics/dashboard", {
        method: "GET",
    });
};

export const track = (request: trackRequest, visitor_id: string, session_id: string): Promise<trackResponse> => {
    return fetchClient<trackRequest, trackResponse>(`/analytics/track?visitor_id=${visitor_id}&session_id=${session_id}`, {
        method: "POST",
        body: request,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const getActive = (): Promise<Page<Active[]>> => {
    return fetchClient<void, Page<Active[]>>("/analytics/active", {
        method: "GET",
    });
};