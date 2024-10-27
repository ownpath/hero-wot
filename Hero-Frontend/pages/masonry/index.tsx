import AdminGuard from "@/components/AdminGuard";
import PostsMasonryLayout from "@/components/MasonryGrid";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Navbar } from "../../components/NavBar";
import { Toaster } from "sonner";

export default function AdminPanelPage() {
  return (
    <AdminGuard>
      <div className="mt-8">
        <div className="mb-8 sticky top-8 z-10">
          <Navbar />
        </div>
        <PostsMasonryLayout />
      </div>
    </AdminGuard>
  );
}
