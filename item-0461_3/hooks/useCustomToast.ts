import { useToast } from "@chakra-ui/react";

const useCustomToast = () => {
    const toast = useToast();

    const showToast = (
        title: string,
        description: string,
        status: "success" | "error" | "info" | "warning"
    ) => {
        toast({
            title,
            description,
            status,
            duration: 5000,
            isClosable: true,
            position: "top-right",
        });
    };

    return showToast;
};

export default useCustomToast;
