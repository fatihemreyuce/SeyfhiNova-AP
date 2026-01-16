import type { ServiceCategoryRequest, ServiceCategoryResponse } from "@/types/service.category.types";
import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";

export const getServiceCategory = (search:string, page:number, size:number, sort:string): Promise<Page<ServiceCategoryResponse>> => {
    return fetchClient<void, Page<ServiceCategoryResponse>>(`/service-categories?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
}

export const getServiceCategoryById = (id:number): Promise<ServiceCategoryResponse> => {
    return fetchClient<void, ServiceCategoryResponse>(`/service-categories/${id}`, {
        method: "GET",
    });
}

export const createServiceCategory = (request:ServiceCategoryRequest): Promise<ServiceCategoryResponse> => {
    return fetchClient<ServiceCategoryRequest, ServiceCategoryResponse>("/admin/service-categories", {
        method: "POST",
        body: request,
    });
}

export const updateServiceCategory = (id:number, request:ServiceCategoryRequest): Promise<ServiceCategoryResponse> => {
    return fetchClient<ServiceCategoryRequest, ServiceCategoryResponse>(`/admin/service-categories/${id}`, {
        method: "PUT",
        body: request,
    });
}

export const deleteServiceCategory = (id:number): Promise<void> => {
    return fetchClient<void, void>(`/admin/service-categories/${id}`, {
        method: "DELETE",
    });
}