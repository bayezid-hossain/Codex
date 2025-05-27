export type InquiryCreate = {
    text: string;
    updated_at?: string;
};
export type InquiryUpdate = {
    id: string;
    text: string;
    message?: string;
    created_at?: string;
    updated_at?: string;
};
export type InquiryPublic = {
    id: string;
    text: string;
    created_at: string;
    updated_at?: string;
    message?: string;
};