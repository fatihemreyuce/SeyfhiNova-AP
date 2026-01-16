export interface ServiceStatsRequest{
    icon:string|File;
    numberValue:number;
    title:string;
}

export interface ServiceStatsResponse{
    id:number;
    iconName:string;
    numberValue:number;
    title:string;
}
