import { useInquiryStore } from "@/client/inquiryStore";
import type { InquiryCreate, InquiryPublic, InquiryUpdate } from "@/client/model";

export const createInquiry = async ({
    requestBody,
}: {
    requestBody: InquiryCreate;
}) => {
    console.log("creating");

    // Generate the ID yourself
    const id = crypto.randomUUID();

    // Add inquiry immediately into your frontend store (optional, optimistic update)
    useInquiryStore.getState().addInquiry({
        id,
        inquiryUpdate: requestBody,
        text: requestBody.text,
    });

    console.log({ id, requestBody });

    // Send only the InquiryUpdate fields (text, description, status)
    const response = await fetch(`http://127.0.0.1:8000/api/create/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create inquiry");
    }

    const createdInquiry = await response.json();
    return createdInquiry; // This is the InquiryPublic returned from FastAPI
};

export const updateInquiry = async ({ id, inquiryData }: {
    id: string, inquiryData: InquiryCreate
}): Promise<InquiryPublic> => {
    console.log("updating via API");
    console.log(inquiryData)
    const response = await fetch(`http://127.0.0.1:8000/api/inquiries/${id}`, {
        method: "PUT", // or PATCH depending on your API
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiryData), // Send the updated inquiry correctly
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update inquiry");
    }

    const updatedInquiry = await response.json();
    return updatedInquiry as InquiryPublic;
};
export const readInquiries = async (): Promise<InquiryPublic[]> => {
    console.log("reading");

    const response = await fetch("http://127.0.0.1:8000/api/get/all", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch inquiries");
    }

    const data = (await response.json()) as InquiryPublic[];

    const store = useInquiryStore.getState();
    store.setInquiries(data);
    console.log(data)
    return store.inquiries;
};
