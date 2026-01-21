export interface Documents{
    asset:string;
    name:string;
}

export interface qualityPolicy{
   text:string;
   orderNumber:string;
}

export interface OfficialPageRequest{
    description:string;
    documents:Documents[];
    qualityPolitics:qualityPolicy[];
}

export interface OfficialPageResponse{
    id:number;
    description:string;
    documents:Documents[];
    qualityPolitics:qualityPolicy[]; 
}