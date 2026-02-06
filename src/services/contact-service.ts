import type { ContactResponse } from "@/types/contact.types";
import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";

export const getContacts = (page: number, size: number, sort: string): Promise<Page<ContactResponse>> => {
    return fetchClient<void, Page<ContactResponse>>(`/admin/contact?page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
};

export const deleteContact = (id: number): Promise<void> => {
    return fetchClient<void, void>(`/admin/contact/${id}`, {
        method: "DELETE",
    });
};

export const getContactById = (id: number): Promise<ContactResponse> => {
    return fetchClient<void, ContactResponse>(`/admin/contact/${id}`, {
        method: "GET",
    });
};