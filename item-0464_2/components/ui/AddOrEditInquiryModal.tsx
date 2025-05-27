"use client";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  type SubmitHandler,
  useForm,
} from "react-hook-form";

import type { ApiError } from "@/client/client";
import type {
  InquiryCreate,
  InquiryUpdate,
} from "@/client/model";
import * as InquiriesService from "../../client/services";
import useCustomToast from "../../hooks/useCustomToast";
import { handleError } from "../../utils";

export const MIN_INQUIRY_LENGTH = 10;
export const MAX_INQUIRY_LENGTH = 256;

function isValidUnicode(str: string): boolean {
  let retval: boolean;
  try {
    retval =
      str === decodeURIComponent(encodeURIComponent(str));
  } catch {
    retval = false;
  }
  return retval;
}

interface AddOrEditInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry?: InquiryCreate & { id?: string }; // Make 'inquiry' optional to handle both add and edit, and include 'id' property
}

const AddOrEditInquiryModal = ({
  isOpen,
  onClose,
  inquiry,
}: AddOrEditInquiryModalProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      text: inquiry?.text ?? "", // Use existing inquiry text if available
    },
  });

  const isEditing = !!inquiry; // Check if we're editing an existing inquiry

  const mutation = useMutation({
    mutationFn: isEditing
      ? (data: InquiryUpdate) =>
          InquiriesService.updateInquiry({
            ...data,
            id: inquiry?.id!, // 'inquiry' is guaranteed to exist here
            created_at: "", // You might need to handle this differently
          })
      : (data: InquiryCreate) =>
          InquiriesService.createInquiry({
            requestBody: data,
          }),
    onSuccess: () => {
      showToast(
        "Success!",
        isEditing
          ? "Inquiry updated successfully."
          : "Inquiry created successfully.",
        "success"
      );
      reset();
      onClose();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["inquiries"],
      });
    },
  });

  const onSubmit: SubmitHandler<InquiryCreate> = (data) => {
    if (isEditing) {
      mutation.mutate({
        ...data,
        id: inquiry?.id!,
      } as InquiryUpdate);
    } else {
      mutation.mutate({ ...data, id: "" } as InquiryUpdate); // Provide a default id for InquiryUpdate
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "sm", md: "md" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <ModalHeader
            id={
              isEditing
                ? "edit-inquiry-show-modal"
                : "add-inquiry-show-modal"
            }
          >
            {isEditing
              ? "Form Edit Inquiry"
              : "Add Inquiry"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={!!errors.text}>
              <FormLabel htmlFor="text">
                Inquiry Text
              </FormLabel>
              <Textarea
                id="text"
                data-testid={
                  isEditing
                    ? "edit-inquiry-text"
                    : "add-inquiry-text"
                }
                {...register("text", {
                  required: "Inquiry text is required.",
                  minLength: {
                    value: MIN_INQUIRY_LENGTH,
                    message: `Inquiry must be at least ${MIN_INQUIRY_LENGTH} characters.`,
                  },
                  maxLength: {
                    value: MAX_INQUIRY_LENGTH,
                    message: `Inquiry can not be greater than ${MAX_INQUIRY_LENGTH} characters.`,
                  },
                  validate: (value: string) =>
                    isValidUnicode(value) ||
                    "Inquiry must be a valid unicode string.",
                })}
                placeholder={
                  isEditing
                    ? "Edit the text of your inquiry."
                    : "Enter the text of your inquiry."
                }
              />
              {errors.text && (
                <FormErrorMessage>
                  {errors.text.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button
              isLoading={isSubmitting}
              variant="primary"
              type="submit"
              data-testid={
                isEditing
                  ? "submit-edit-inquiry"
                  : "submit-add-inquiry"
              }
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddOrEditInquiryModal;
