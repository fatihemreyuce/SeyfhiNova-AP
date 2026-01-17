import type { FaqRequest, FaqResponse } from "@/types/faqs.types";
import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";

export const getFaq = (search: string, page: number, size: number, sort: string): Promise<Page<FaqResponse>> => {
    return fetchClient<void, Page<FaqResponse>>(`/faqs?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
};

export const createFaq = (request: FaqRequest): Promise<FaqResponse> => {
    return fetchClient<FaqRequest, FaqResponse>("/admin/faqs", {
        method: "POST",
        body: request,
    });
};

export const updateFaq = (id: number, request: FaqRequest): Promise<FaqResponse> => {
    return fetchClient<FaqRequest, FaqResponse>(`/admin/faqs/${id}`, {
        method: "PUT",
        body: request,
    });
};

export const deleteFaq = (id: number): Promise<void> => {
    return fetchClient<void, void>(`/admin/faqs/${id}`, {
        method: "DELETE",
    });
};

export const getFaqById = (id: number): Promise<FaqResponse> => {
    return fetchClient<void, FaqResponse>(`/faqs/${id}`, {
        method: "GET",
    });
};
