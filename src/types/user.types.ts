export interface UserRequest{
    username:string;
    email:string;
    password:string;
    firstName:string;
    lastName:string;
    role:"ROLE_ADMIN" | "ROLE_EDITOR";
}

export interface UserResponse{
    id:number;
    username:string;
    email:string;
    firstName:string;
    lastName:string;
    role:"ROLE_ADMIN" | "ROLE_EDITOR";
}