// app/admin/layout.tsx
import { LayoutProvider } from "@/app/layout/context/layoutcontext";
import { PrimeReactProvider } from "primereact/api";
import "../styles/layout/layout.scss";
import "../styles/demo/Demos.scss";

type Props = {
  children: React.ReactNode;
};

export const metadata = {
  title: "Admin Panel",
  description: "Admin Panel Layout",
};

export default function AdminLayout({ children }: Props) {
  return (
    <PrimeReactProvider>
      <LayoutProvider>
        <div className="admin-layout">
          {children} {/* No Navbar or Footer here */}
        </div>
      </LayoutProvider>
    </PrimeReactProvider>
  );
}
