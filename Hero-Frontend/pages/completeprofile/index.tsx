import { useRouter } from "next/router";
import CompleteProfileForm from "@/components/CompleteProfileForm";
import DefaultLayout from "@/layouts/default";
import { toast } from "sonner";
import { useEffect } from "react";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { message, firstName, lastName, isRedirected } = router.query;

  useEffect(() => {
    // Only run this effect when router is ready and has query params
    if (!router.isReady) return;

    // Show toast message if user was redirected and message exists
    if (isRedirected === "true" && message && typeof message === "string") {
      toast.info(message);
    }
  }, [router.isReady]);

  // Handler for successful profile completion
  const handleProfileComplete = async (success: boolean) => {
    if (success) {
      router.push("/postgreeting");
    } else {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <DefaultLayout>
      <div className="flex justify-center items-center h-full">
        <CompleteProfileForm
          onComplete={handleProfileComplete}
          firstNameProp={typeof firstName === "string" ? firstName : undefined}
          lastNameProp={typeof lastName === "string" ? lastName : undefined}
        />
      </div>
    </DefaultLayout>
  );
}
