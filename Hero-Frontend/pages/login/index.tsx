import LoginForm from "@/components/LoginForm";
import DefaultLayout from "@/layouts/default";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Show error toast if error query parameter exists
    if (router.query.error) {
      toast.error(decodeURIComponent(router.query.error as string));
      // Remove the error query parameter
      router.replace("/login", undefined, { shallow: true });
    }
  }, [router.query.error]);
  return (
    <DefaultLayout>
      <div className="flex justify-center items-center h-full">
        <LoginForm />
      </div>
    </DefaultLayout>
  );
}
