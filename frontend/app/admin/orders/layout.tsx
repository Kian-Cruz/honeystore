import type { ReactNode } from "react";

import AdminShell from "@/components/admin/AdminShell";

type AdminOrdersLayoutProps = {
  children: ReactNode;
};

export default function AdminOrdersLayout({
  children,
}: AdminOrdersLayoutProps) {
  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}