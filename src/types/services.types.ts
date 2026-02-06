export interface ServiceRequest{
    categoryId:number;
    title:string;
    description:string;
    orderIndex:number;
}

export interface ServiceResponse{
    id:number;
    categoryId:number;
    /** API bazen category nesnesi döndürebilir */
    category?: { id: number; name?: string };
    title:string;
    description:string;
    orderIndex:number;
}