import type { ServiceRequest, ServiceResponse } from "@/types/services.types";
import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";

export const getService = (search:string, page:number, size:number, sort:string): Promise<Page<ServiceResponse>> => {
    return fetchClient<void, Page<ServiceResponse>>(`/services?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
}

export const getServiceById = (id:number): Promise<ServiceResponse> => {
    return fetchClient<void, ServiceResponse>(`/services/${id}`, {
        method: "GET",
    });
}

export const createService = (request:ServiceRequest): Promise<ServiceResponse> => {
    return fetchClient<ServiceRequest, ServiceResponse>("/admin/services", {
        method: "POST",
        body: request,
    });
}

export const updateService = (id:number, request:ServiceRequest): Promise<ServiceResponse> => {
    return fetchClient<ServiceRequest, ServiceResponse>(`/admin/services/${id}`, {
        method: "PUT",
        body: request,
    });
}

export const deleteService = (id:number): Promise<void> => {
    return fetchClient<void, void>(`/admin/services/${id}`, {
        method: "DELETE",
    });
}

