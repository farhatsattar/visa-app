import { UserDashboardView } from "@/components/dashboard/user-dashboard-view";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <UserDashboardView />
      <Footer />
    </>
  );
}
