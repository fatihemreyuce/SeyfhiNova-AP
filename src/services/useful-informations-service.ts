import type { UsefulInformationRequest, UsefulInformationResponse } from "@/types/useful.information.types";
import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";

export const getUsefulInformations = (search: string, page: number, size: number, sort: string): Promise<Page<UsefulInformationResponse>> => {
    return fetchClient<void, Page<UsefulInformationResponse>>(`/useful-information?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
};

export const createUsefulInformation = (request: UsefulInformationRequest): Promise<UsefulInformationResponse> => {
    return fetchClient<UsefulInformationRequest, UsefulInformationResponse>("/admin/useful-information", {
        method: "POST",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const updateUsefulInformation = (id: number, request: UsefulInformationRequest): Promise<UsefulInformationResponse> => {
    return fetchClient<UsefulInformationRequest, UsefulInformationResponse>(`/admin/useful-information/${id}`, {
        method: "PUT",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteUsefulInformation = (id: number): Promise<void> => {
    return fetchClient<void, void>(`/admin/useful-information/${id}`, {
        method: "DELETE",
    });
};

export const getUsefulInformationById = (id: number): Promise<UsefulInformationResponse> => {
    return fetchClient<void, UsefulInformationResponse>(`/useful-information/${id}`, {
        method: "GET",
    });
};
