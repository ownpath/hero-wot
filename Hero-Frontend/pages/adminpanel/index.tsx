import AdminManagementTabs from "../../components/AdminPostsTab";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Toaster } from "sonner";

export default function AdminPanelPage() {
  return (
    <DefaultLayout>
      <Toaster richColors />
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block text-center justify-center">
          <h1 className={title()}>Admin Panel</h1>
        </div>
        <div className="w-full max-w-[1200px] px-6">
          <AdminManagementTabs />
        </div>
      </section>
    </DefaultLayout>
  );
}
