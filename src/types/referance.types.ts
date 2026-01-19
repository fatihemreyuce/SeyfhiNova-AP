export interface ReferanceRequest{
    logo:string|File;
    name:string;
    description:string;
    websiteUrl?:string;
    orderIndex:number;
}

export interface ReferanceResponse{
    id:number;
    logoUrl:string;
    name:string;
    description:string;
    websiteUrl:string;
    orderIndex:number;
}