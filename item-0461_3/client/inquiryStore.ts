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