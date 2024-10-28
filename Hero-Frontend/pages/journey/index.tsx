import React from "react";

import LottieScrollAnimation from "@/components/Journey";
import DefaultLayout from "@/layouts/default";
import AdminGuard from "@/components/AdminGuard";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <AdminGuard>
        <LottieScrollAnimation />
      </AdminGuard>
    </div>
  );
}
