import type { PartnerRequest, PartnerResponse } from "@/types/partners.types";
import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";

export const getPartner = (search: string, page: number, size: number, sort: string): Promise<Page<PartnerResponse>> => {
    return fetchClient<void, Page<PartnerResponse>>(`/partners?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
};

export const getPartnerById = (id: number): Promise<PartnerResponse> => {
    return fetchClient<void, PartnerResponse>(`/partners/${id}`, {
        method: "GET",
    });
};

export const createPartner = (request: PartnerRequest): Promise<PartnerResponse> => {
    return fetchClient<PartnerRequest, PartnerResponse>("/admin/partners", {
        method: "POST",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const updatePartner = (id: number, request: PartnerRequest): Promise<PartnerResponse> => {
    return fetchClient<PartnerRequest, PartnerResponse>(`/admin/partners/${id}`, {
        method: "PUT",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deletePartner = (id: number): Promise<void> => {
    return fetchClient<void, void>(`/admin/partners/${id}`, {
        method: "DELETE",
    });
};
