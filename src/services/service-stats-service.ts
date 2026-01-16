import type { ServiceStatsRequest, ServiceStatsResponse } from "@/types/service.stats.types";
import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";

export const getServiceStats = (search:string, page:number, size:number, sort:string): Promise<Page<ServiceStatsResponse>> => {
    return fetchClient<void, Page<ServiceStatsResponse>>(`/service-stats?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
}

export const getServiceStatsById = (id:number): Promise<ServiceStatsResponse> => {
    return fetchClient<void, ServiceStatsResponse>(`/service-stats/${id}`, {
        method: "GET",
    });
}

export const createServiceStats = (request:ServiceStatsRequest): Promise<ServiceStatsResponse> => {
    return fetchClient<ServiceStatsRequest, ServiceStatsResponse>("/admin/service-stats", {
        method: "POST",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const updateServiceStats = (id:number, request:ServiceStatsRequest): Promise<ServiceStatsResponse> => {
    return fetchClient<ServiceStatsRequest, ServiceStatsResponse>(`/admin/service-stats/${id}`, {
        method: "PUT",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const deleteServiceStats = (id:number): Promise<void> => {
    return fetchClient<void, void>(`/admin/service-stats/${id}`, {
        method: "DELETE",
    });
}
