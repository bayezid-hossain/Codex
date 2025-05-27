// app/page.tsx
"use client";

import { Card } from "primereact/card";

export default function HomePage() {
  return (
    <Card title="Welcome to the Homepage" className="mb-4">
      <p className="m-0">
        This page is wrapped in a global layout.
      </p>
    </Card>
  );
}
