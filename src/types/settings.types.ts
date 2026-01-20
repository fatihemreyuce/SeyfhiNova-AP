export interface SettingsRequest{
    phoneNumber:string;
    email:string;
    instagramUrl:string;
    linkedinUrl:string;
    address:string;
    privacyText:string;
    privacyPolicy:string;
    contactFormText:string;
    cookiePolicy:string;
    siteLogo:string|File;
}

export interface SettingsResponse{
    id:number;
    phoneNumber:string;
    email:string;
    instagramUrl:string;
    linkedinUrl:string;
    address:string;
    privacyText:string;
    privacyPolicy:string;
    contactFormText:string;
    cookiePolicy:string;
    siteLogo:string;
    siteLogoUrl?:string; // Backend'den gelen field adı
    createdAt:string;
    updatedAt:string;
}