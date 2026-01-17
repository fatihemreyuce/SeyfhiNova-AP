import type { CircularRequest, CircularResponse } from "@/types/circulars.types";
import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";

export const getCircular = (search: string, page: number, size: number, sort: string): Promise<Page<CircularResponse>> => {
    return fetchClient<void, Page<CircularResponse>>(`/circulars?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
};

export const getCircularById = (id: number): Promise<CircularResponse> => {
    return fetchClient<void, CircularResponse>(`/circulars/${id}`, {
        method: "GET",
    });
};

export const createCircular = (request: CircularRequest): Promise<CircularResponse> => {
    return fetchClient<CircularRequest, CircularResponse>("/admin/circulars", {
        method: "POST",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const updateCircular = (id: number, request: CircularRequest): Promise<CircularResponse> => {
    return fetchClient<CircularRequest, CircularResponse>(`/admin/circulars/${id}`, {
        method: "PUT",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteCircular = (id: number): Promise<void> => {
    return fetchClient<void, void>(`/admin/circulars/${id}`, {
        method: "DELETE",
    });
};
