export interface Active{
    count:number;
    timestamp:string;
}

export interface trackRequest{
    pagePath:string;
    pageTitle:string;
    referrer:string;
}

export interface trackResponse{
    visitId:string;
    sessionId:string;
    tracked:boolean;
}

export interface TopPage{
    pagePath:string;
    viewCount:number;
    uniqueVisitors:number;
}

export interface dailyStats{
    date:string;
    uniqueVisitors:number;
    totalPageViews:number;
    avgPagesPerVisitor:number;
}

export interface conversion{
    totalVisitors:number;
    totalContactForms:number;
    conversionRate:number;
    todayContactForms:number;
    yesterdayContactForms:number;
}

export interface dashboard{
    activeVisitors:number;
    todayUniqueVisitors:number;
    todayPageViews:number;
    yesterdayUniqueVisitors:number;
    yesterdayPageViews:number;
    percentageChange:number;
    dailyStats:dailyStats[];
    topPages:TopPage[];
    conversionStats:conversion;
}