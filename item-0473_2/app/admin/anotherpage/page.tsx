// app/page.tsx
"use client";

import { Card } from "primereact/card";

export default function HomePage() {
  return (
    <Card
      title="Welcome to the another page under admin layout"
      className="mb-4 w-full"
    >
      <p className="m-0">
        This page is also wrapped in admin layout.
      </p>
    </Card>
  );
}
