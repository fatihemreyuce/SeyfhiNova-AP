export interface Documents {
    id?: number;
    asset: File | string;
    name: string;
}

export interface qualityPolicy {
    text: string;
    orderNumber: string;
}

/** PUT /official-page: sadece description + quality politics (Swagger) */
export interface UpdateOfficialPageRequest {
    description: string;
    qualityPolitics: qualityPolicy[];
}

/** POST /documents: tek belge ekle – asset (binary) + name (Swagger) */
export interface AddDocumentRequest {
    asset: File;
    name: string;
}

/** Form ve diğer yerlerde kullanım için (updateOfficialPage artık documents almıyor) */
export interface OfficialPageRequest extends UpdateOfficialPageRequest {
    documents: Documents[];
}

export interface OfficialPageResponse {
    id: number;
    description: string;
    documents: Documents[];
    qualityPolitics: qualityPolicy[];
}
