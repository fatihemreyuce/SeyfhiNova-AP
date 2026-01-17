export interface SliderRequest{
    image:string|File;
    title:string;
    description:string;
    orderIndex:number;
}

export interface SliderResponse{
    id:number;
    imageUrl:string;
    title:string;
    description:string;
    orderIndex:number;
}