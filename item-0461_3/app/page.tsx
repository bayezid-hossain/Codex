"use client";
import InquiryModal from "@/components/ui/EditInquiry";
import InquiriesTable from "@/components/ui/InquiriesTable";
import { Button } from "@chakra-ui/react";
import Image from "next/image";
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

      <InquiryModal isOpen={isOpen} onClose={handleClose} />
    </div>
  );
}
