import type { SliderRequest, SliderResponse } from "@/types/slider.types";
import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";

export const getSlider = (search:string, page:number, size:number, sort:string): Promise<Page<SliderResponse>> => {
    return fetchClient<void, Page<SliderResponse>>(`/sliders?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
}

export const getSliderById = (id:number): Promise<SliderResponse> => {
    return fetchClient<void, SliderResponse>(`/sliders/${id}`, {
        method: "GET",
    });
}

export const createSlider = (request:SliderRequest): Promise<SliderResponse> => {
    return fetchClient<SliderRequest, SliderResponse>("/admin/sliders", {
        method: "POST",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const updateSlider = (id:number, request:SliderRequest): Promise<SliderResponse> => {
    return fetchClient<SliderRequest, SliderResponse>(`/admin/sliders/${id}`, {
        method: "PUT",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const deleteSlider = (id:number): Promise<void> => {
    return fetchClient<void, void>(`/admin/sliders/${id}`, {
        method: "DELETE",
    });
}