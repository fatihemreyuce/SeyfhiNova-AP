export interface ContactRequest {
    name:string;
    surname:string;
    subject:string;
    description:string;
    phone:string;
}

export interface ContactResponse {
    id:number;
    name:string;
    surname:string;
    subject:string;
    description:string;
    phone:string;
}