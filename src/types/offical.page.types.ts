export interface Documents{
    id:number;
    asset:string;
    name:string;
}

export interface qualityPolicy{
   text:string;
   orderNumber:number;
}

export interface OfficialPageRequest{
    description:string;
    documents:Documents[];
    qualityPolicy:qualityPolicy[];
}

export interface OfficialPageResponse{
    id:number;
    description:string;
    documents:Documents[];
    qualityPolitics:qualityPolicy[]; 
}