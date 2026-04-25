import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { RequireAdmin } from "@/components/auth/require-admin";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <RequireAdmin>
        <AdminDashboard />
      </RequireAdmin>
      <Footer />
    </>
  );
}
