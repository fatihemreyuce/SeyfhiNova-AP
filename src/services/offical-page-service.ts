import type {
    AddDocumentRequest,
    Documents,
    OfficialPageResponse,
    UpdateOfficialPageRequest,
} from "@/types/offical.page.types";
import { fetchClient } from "@/utils/fetch-client";

export const getOfficialPages = (): Promise<OfficialPageResponse> => {
    return fetchClient<void, OfficialPageResponse>(`/official-page`, {
        method: "GET",
    });
};

export const updateOfficialPage = (
    request: UpdateOfficialPageRequest
): Promise<OfficialPageResponse> => {
    return fetchClient<UpdateOfficialPageRequest, OfficialPageResponse>("/admin/official-page", {
        method: "PUT",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteOfficialPageDocument = (id: number): Promise<void> => {
    return fetchClient<void, void>(`/admin/official-page/documents/${id}`, {
        method: "DELETE",
    });
};

export const addOfficialPageDocument = (
    request: AddDocumentRequest
): Promise<OfficialPageResponse> => {
    return fetchClient<AddDocumentRequest, OfficialPageResponse>(
        "/admin/official-page/documents",
        {
            method: "POST",
            body: request,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

export const updateOfficialPageDocument = (id: number, request: Documents): Promise<Documents> => {
    return fetchClient<Documents, Documents>(`/admin/official-page/documents/${id}`, {
        method: "PUT",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
