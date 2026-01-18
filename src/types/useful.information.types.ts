export interface UsefulInformationRequest {
    file:string|File;
    title:string;
    description:string;
    excerpt:string;
}

export interface UsefulInformationResponse {
    id:number;
    fileUrl:string;
    title:string;
    description:string;
    excerpt:string;
}