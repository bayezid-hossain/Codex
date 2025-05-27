import { useInquiryStore } from "@/client/inquiryStore";
import type { InquiryCreate, InquiryPublic, InquiryUpdate } from "@/client/model";

export const createInquiry = async ({
    requestBody,
}: {
    requestBody: InquiryCreate;
}) => {
    console.log("creating");

    const newInquiry: InquiryPublic = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        ...requestBody,
    };

    useInquiryStore.getState().addInquiry(newInquiry);
    return newInquiry;
};

export const updateInquiry = async (data: InquiryUpdate) => {
    console.log("updating");

    const updated: InquiryPublic = {
        ...data,
        created_at: data.created_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };


    useInquiryStore.getState().updateInquiry(updated);
    return updated;
};

export const readInquiries = async (): Promise<InquiryPublic[]> => {
    console.log("reading");

    const initialData: InquiryPublic[] = [
        {
            id: "1",
            text: "Hello there",
            created_at: "2024-09-17T14:13:00Z",
        },
        {
            id: "2",
            text: "Another query",
            created_at: "2024-09-17T14:13:00Z",
        },
        {
            id: "3",
            text: "Another one",
            created_at: "2024-09-17T14:13:00Z",
        },
        {
            id: "4",
            text: "Last one",
            created_at: "2024-09-17T14:13:00Z",
        },
    ];

    const store = useInquiryStore.getState();
    // console.log(store)
    // If store is empty, initialize it
    if (store.inquiries.length === 0) {
        store.setInquiries(initialData);
    }

    return store.inquiries;
}