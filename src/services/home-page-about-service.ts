import type { HomePageRequest, HomePageResponse } from "@/types/home.page.about.types";
import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";

export const getHomePageAbout =  (search:string, page:number, size:number, sort:string): Promise<Page<HomePageResponse>> => {
    return  fetchClient<void, Page<HomePageResponse>>(`/homepage-about?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
}

export const getHomePageAboutById = async (id: number) => {
    return await fetchClient<void, HomePageResponse>(`/homepage-about/${id}`, {
        method: "GET",
    });
}

export const createHomePageAbout = async (request: HomePageRequest) => {
    return await fetchClient<HomePageRequest, HomePageResponse>("/admin/homepage-about", {
        method: "POST",
        body: request,
    });
}

export const updateHomePageAbout = async (id: number, request: HomePageRequest) => {
    return await fetchClient<HomePageRequest, HomePageResponse>(`/admin/homepage-about/${id}`, {
        method: "PUT",
        body: request,
    });
}

export const deleteHomePageAbout =  (id: number): Promise<void> => {
    return  fetchClient(`/admin/homepage-about/${id}`, {
        method: "DELETE",
    });
}