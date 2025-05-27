import type { ApiError } from "@/client/client"


export const handleError = (error: unknown, showToast: (title: string, description: string, status: "success" | "error" | "info" | "warning") => void): string => {
    if ((error as ApiError)?.message) {
        return (error as ApiError).message;
    }
    return "An unknown error occurred.";
};