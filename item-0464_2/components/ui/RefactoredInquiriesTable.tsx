import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SkeletonText,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useMemo, useState } from "react";
import type { InquiryPublic } from "@/client/model.js";
import * as InquiriesService from "@/client/services";

// Dayjs Configurations (Keep these at the top)
dayjs.extend(utc);
dayjs.extend(timezone);

const formatDate = (date: string): string => {
  if (typeof date !== "string") return "Invalid Date";
  const parsedDate = dayjs.utc(date);
  return parsedDate.isValid()
    ? parsedDate
        .tz(dayjs.tz.guess())
        .format("MMM DD, YYYY hh:mm A")
    : "Invalid Date";
};

const useInquiriesData = () => {
  return useQuery({
    queryKey: ["inquiries"],
    queryFn: InquiriesService.readInquiries,
  });
};

const useUpdateInquiryMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: InquiriesService.updateInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inquiries"],
      });
      toast({
        title: "Inquiry updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error: any) => {
      console.error("Error updating inquiry:", error);
      toast({
        title: "Error updating inquiry",
        description:
          error.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

const InquiriesTable = () => {
  const { data: inquiriesData, isPending } =
    useInquiriesData();
  const updateInquiryMutation = useUpdateInquiryMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedInquiry, setSelectedInquiry] =
    useState<InquiryPublic | null>(null);
  const [editText, setEditText] = useState("");

  const sortedInquiries = useMemo(() => {
    if (!inquiriesData) return [];
    return inquiriesData.sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );
  }, [inquiriesData]);

  const handleEditClick = (inquiry: InquiryPublic) => {
    setSelectedInquiry(inquiry);
    setEditText(inquiry.text);
    onOpen();
  };

  const handleSave = () => {
    if (selectedInquiry) {
      updateInquiryMutation.mutate({
        ...selectedInquiry,
        text: editText,
      });
      onClose(); // Close modal on save
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Text</Th>
              <Th>Created At</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isPending ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Tr key={index}>
                  <Td colSpan={3}>
                    <SkeletonText noOfLines={1} />
                  </Td>
                </Tr>
              ))
            ) : sortedInquiries.length > 0 ? (
              sortedInquiries.map((inquiry) => (
                <Tr
                  key={inquiry.id}
                  data-testid="inquiry-row"
                >
                  <Td data-testid="inquiry-text">
                    {inquiry.text}
                  </Td>
                  <Td data-testid="inquiry-datetime">
                    {formatDate(inquiry.created_at)}
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="Edit Inquiry"
                      icon={<EditIcon />}
                      onClick={() =>
                        handleEditClick(inquiry)
                      }
                      size="sm"
                    />
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={3}>No inquiries found</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Table Edit Inquiry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Text</FormLabel>
              <Input
                value={editText}
                onChange={(e) =>
                  setEditText(e.target.value)
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSave}
              isLoading={updateInquiryMutation.isPending}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InquiriesTable;
