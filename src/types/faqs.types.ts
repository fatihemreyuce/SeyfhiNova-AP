export interface FaqRequest{
    question:string;
    answer:string;
    orderIndex:number;
}

export interface FaqResponse{
    id:number;
    question:string;
    answer:string;
    orderIndex:number;
}