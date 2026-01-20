import type { SettingsRequest, SettingsResponse } from "@/types/settings.types";
import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";

export const getSettings = async (): Promise<SettingsResponse> => {
    const pageResponse = await fetchClient<void, Page<SettingsResponse>>(`/settings`, {
        method: "GET",
    });
    
    // Page response'dan ilk elemanı al ve field mapping yap
    if (pageResponse.content && pageResponse.content.length > 0) {
        const firstItem = pageResponse.content[0];
        // siteLogoUrl'yi siteLogo'ya map et
        return {
            ...firstItem,
            siteLogo: firstItem.siteLogoUrl || firstItem.siteLogo || "",
        };
    }
    
    throw new Error("Settings bulunamadı");
}

export const createSettings = (settings:SettingsRequest): Promise<SettingsResponse> => {
    return fetchClient<SettingsRequest, SettingsResponse>("/admin/settings", {
        method: "POST",
        body: settings,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const updateSettings = (id:number, settings:SettingsRequest): Promise<SettingsResponse> => {
    return fetchClient<SettingsRequest, SettingsResponse>(`/admin/settings/${id}`, {
        method: "PUT",
        body: settings,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const deleteSettings = (id:number): Promise<void> => {
    return fetchClient<void, void>(`/admin/settings/${id}`, {
        method: "DELETE",
    });
}

