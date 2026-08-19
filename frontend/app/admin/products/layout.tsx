import type { ReactNode } from "react";

import AdminShell from "@/components/admin/AdminShell";

type AdminProductsLayoutProps = {
  children: ReactNode;
};

export default function AdminProductsLayout({
  children,
}: AdminProductsLayoutProps) {
  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}