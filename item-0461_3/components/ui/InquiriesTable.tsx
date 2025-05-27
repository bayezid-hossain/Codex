"use client";
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
import type { InquiryPublic } from "@/client/model";
import * as InquiriesService from "@/client/services";

// Dayjs Configurations
dayjs.extend(utc);
dayjs.extend(timezone);

const InquiriesTable = () => {
  // Format ISO date to the user's timezone.
  // ex. Sep 17, 2024 14:13 PM

  function formatDate(date?: string): string {
    const userTimezone = dayjs.tz.guess();

    const parsedDate = date ? dayjs.utc(date) : dayjs.utc(); // Use current time if no date provided

    return parsedDate.isValid()
      ? parsedDate
          .tz(userTimezone)
          .format("MMM DD, YYYY hh:mm A")
      : dayjs()
          .tz(userTimezone)
          .format("MMM DD, YYYY hh:mm A"); // fallback to now
  }

  function getInquiriesQueryOptions() {
    return {
      queryKey: ["inquiries"],
      queryFn: () => InquiriesService.readInquiries(),
    };
  }

  const { data: inquiries, isPending } = useQuery({
    ...getInquiriesQueryOptions(),
  });

  // Sort inquiries from Newest to oldest
  const sortedInquiries = useMemo(() => {
    if (!inquiries) return [];
    return inquiries.sort((a, b) => {
      return (
        new Date(
          b.inquiryUpdate?.updated_at ?? ""
        ).getTime() -
        new Date(
          a.inquiryUpdate?.updated_at ?? ""
        ).getTime()
      );
    });
  }, [inquiries]);

  const queryClient = useQueryClient();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedInquiry, setSelectedInquiry] =
    useState<InquiryPublic | null>(null);
  const [editText, setEditText] = useState("");

  const updateInquiryMutation = useMutation({
    mutationFn: async (updatedInquiry: InquiryPublic) => {
      return await InquiriesService.updateInquiry({
        id: updatedInquiry.id,
        inquiryData: updatedInquiry.inquiryUpdate,
      });
    },
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
      onClose();
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

  const handleEditClick = (inquiry: InquiryPublic) => {
    setSelectedInquiry(inquiry);
    setEditText(inquiry.text ?? "");
    onOpen();
  };

  const handleSave = () => {
    if (selectedInquiry) {
      updateInquiryMutation.mutate({
        ...selectedInquiry,
        inquiryUpdate: { text: editText },
      });
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
          {isPending ? (
            <Tbody>
              <Tr>
                {new Array(3).fill(null).map((_, index) => (
                  <Td key={index}>
                    <SkeletonText noOfLines={1} />
                  </Td>
                ))}
              </Tr>
            </Tbody>
          ) : (
            <Tbody>
              {sortedInquiries.length > 0 ? (
                sortedInquiries.map((inquiry) => (
                  <Tr
                    key={inquiry.id}
                    data-testid="inquiry-row"
                  >
                    <Td data-testid="inquiry-text">
                      {inquiry?.text}
                    </Td>
                    <Td data-testid="inquiry-datetime">
                      {formatDate(
                        inquiry.inquiryUpdate?.updated_at ??
                          ""
                      )}
                    </Td>
                    <Td>
                      <IconButton
                        aria-label="Edit Inquiry"
                        icon={<EditIcon />}
                        onClick={() =>
                          handleEditClick(inquiry)
                        }
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
          )}
        </Table>
      </TableContainer>

      <Modal isOpen={isOpen} onClose={onClose}>
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
