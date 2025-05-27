import { create } from "zustand";
import type { InquiryCreate, InquiryPublic, InquiryUpdate } from "@/client/model";

interface InquiryStore {
    inquiries: InquiryPublic[];
    setInquiries: (inquiries: InquiryPublic[]) => void;
    addInquiry: (inquiry: InquiryPublic) => void;
    updateInquiry: (inquiry: InquiryPublic) => void;
}

export const useInquiryStore = create<InquiryStore>((set) => ({
    inquiries: [
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
    ],
    setInquiries: (inquiries) => set({ inquiries }),
    addInquiry: (inquiry) =>
        set((state) => ({
            inquiries: [inquiry, ...state.inquiries],
        })),
    updateInquiry: (updated) =>
        set((state) => ({
            inquiries: state.inquiries.map((inq) =>
                inq.id === updated.id ? { ...inq, ...updated } : inq
            ),
        })),
}));