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

const isValidUnicode = (str: string): boolean => {
  try {
    return (
      str === decodeURIComponent(encodeURIComponent(str))
    );
  } catch {
    return false;
  }
};

interface AddOrEditInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry?: InquiryCreate & { id?: string };
}

const AddOrEditInquiryModal = ({
  isOpen,
  onClose,
  inquiry,
}: AddOrEditInquiryModalProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const isEditing = !!inquiry;
  const modalTitle = isEditing
    ? "Edit Inquiry"
    : "Add Inquiry";
  const submitButtonText = isEditing
    ? "Save Changes"
    : "Add Inquiry";
  const modalTestIdPrefix = isEditing
    ? "edit-inquiry"
    : "add-inquiry";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      text: inquiry?.text ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InquiryCreate | InquiryUpdate) => {
      if (isEditing && inquiry?.id) {
        return InquiriesService.updateInquiry({
          ...data,
          id: inquiry.id,
        } as InquiryUpdate);
      }
      return InquiriesService.createInquiry({
        requestBody: data as InquiryCreate,
      });
    },
    onSuccess: () => {
      showToast(
        "Success!",
        `${modalTitle} successful.`,
        "success"
      );
      reset();
      onClose();
      queryClient.invalidateQueries({
        queryKey: ["inquiries"],
      });
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
  });

  const onSubmit: SubmitHandler<InquiryCreate> = (data) => {
    if (isEditing && inquiry?.id) {
      mutation.mutate({
        ...data,
        id: inquiry.id,
      } as InquiryUpdate);
    } else {
      mutation.mutate(data);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ModalHeader id={`${modalTestIdPrefix}-show-modal`}>
          {modalTitle}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isInvalid={!!errors.text}>
            <FormLabel htmlFor="text">
              Inquiry Text
            </FormLabel>
            <Textarea
              id="text"
              data-testid={`${modalTestIdPrefix}-text`}
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
            isLoading={mutation.isPending}
            variant="primary"
            type="submit"
            data-testid={`submit-${modalTestIdPrefix}`}
          >
            {submitButtonText}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddOrEditInquiryModal;
