export interface PartnerRequest{
    logo:string|File;
    name:string;
    orderIndex:number;
}

export interface PartnerResponse{
    id:number;
    logoUrl:string;
    name:string;
    orderIndex:number;
}