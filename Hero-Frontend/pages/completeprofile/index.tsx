import { useRouter } from "next/router";
import CompleteProfileForm from "@/components/CompleteProfileForm";
import DefaultLayout from "@/layouts/default";
import { toast } from "sonner";

export default function CompleteProfilePage() {
  const router = useRouter();

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
        <CompleteProfileForm onComplete={handleProfileComplete} />
      </div>
    </DefaultLayout>
  );
}
