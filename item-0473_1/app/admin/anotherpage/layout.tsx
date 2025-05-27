type Props = {
  children: React.ReactNode;
};

export const metadata = {
  title: "Another Page",
  description: "Admin Panel Layout",
};

export default function AdminLayout({ children }: Props) {
  return (
    <div className="admin-layout">
      {children} {/* No Navbar or Footer here */}
    </div>
  );
}
