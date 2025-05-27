"use client";
import AddOrEditInquiryModal from "@/components/ui/RefactoredAddOrEdit";
import InquiriesTable from "@/components/ui/RefactoredInquiriesTable";
import { Button } from "@chakra-ui/react";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div>
      <InquiriesTable />
      <Button onClick={handleOpen} colorScheme="blue">
        Add Inquiry
      </Button>

      <AddOrEditInquiryModal
        isOpen={isOpen}
        onClose={handleClose}
      />
    </div>
  );
}
