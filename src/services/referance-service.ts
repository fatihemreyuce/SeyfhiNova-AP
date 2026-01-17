import type { ReferanceRequest, ReferanceResponse } from "@/types/referance.types";
import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";

export const getReferance = (search: string, page: number, size: number, sort: string): Promise<Page<ReferanceResponse>> => {
    return fetchClient<void, Page<ReferanceResponse>>(`/references?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
};

export const getReferanceById = (id: number): Promise<ReferanceResponse> => {
    return fetchClient<void, ReferanceResponse>(`/references/${id}`, {
        method: "GET",
    });
};

export const createReferance = (request: ReferanceRequest): Promise<ReferanceResponse> => {
    return fetchClient<ReferanceRequest, ReferanceResponse>("/admin/references", {
        method: "POST",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const updateReferance = (id: number, request: ReferanceRequest): Promise<ReferanceResponse> => {
    return fetchClient<ReferanceRequest, ReferanceResponse>(`/admin/references/${id}`, {
        method: "PUT",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteReferance = (id: number): Promise<void> => {
    return fetchClient<void, void>(`/admin/references/${id}`, {
        method: "DELETE",
    });
};
