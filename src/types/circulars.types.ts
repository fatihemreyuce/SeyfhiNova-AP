export interface CircularRequest{
    title:string;
    description:string;
    file:string|File;
}

export interface CircularResponse{
    id:number;
    title:string;
    description:string;
    fileUrl:string;
}   