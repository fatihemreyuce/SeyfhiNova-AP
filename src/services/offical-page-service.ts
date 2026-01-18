import type { OfficialPageRequest, OfficialPageResponse } from "@/types/offical.page.types";
import { fetchClient } from "@/utils/fetch-client";

export const getOfficialPages = (): Promise<OfficialPageResponse> => {
    return fetchClient<void, OfficialPageResponse>(`/official-page`, {
        method: "GET",
    });
};

export const updateOfficialPage = (request: OfficialPageRequest): Promise<OfficialPageResponse> => {
    return fetchClient<OfficialPageRequest, OfficialPageResponse>("/admin/official-page", {
        method: "PUT",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteOfficialPage = (id: number): Promise<void> => {
    return fetchClient<void, void>(`/admin/official-page/documents/${id}`, {
        method: "DELETE",
    });
};