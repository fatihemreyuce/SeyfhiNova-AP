export interface ServiceCategoryRequest{
    name:string;
    description:string;
    orderIndex:number;
}

export interface ServiceCategoryResponse{
    id:number;
    name:string;
    description:string;
    orderIndex:number;
}