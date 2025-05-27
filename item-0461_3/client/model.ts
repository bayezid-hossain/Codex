export type InquiryCreate = {
    text: string;
    updated_at?: string;
    id?: string;
    // add more fields here if needed
};
export type InquiryUpdate = {
    id: string;
    inquiryUpdate: {
        text: string; // ✅ remove `| undefined`
        message?: string;
        created_at?: string;
        updated_at?: string;
    }
};
export type InquiryPublic = {
    id: string;
    inquiryUpdate: InquiryCreate
    text?: string
};