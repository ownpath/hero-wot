import { useEffect } from "react";
import { useRouter } from "next/router";
import CompleteProfileForm from "@/components/CompleteProfileForm";
import DefaultLayout from "@/layouts/default";

export default function CompleteProfilePage() {
  const router = useRouter();

  useEffect(() => {
    const { id, first_name, last_name, role, email, accessToken, isNewUser } =
      router.query;

    if (id && first_name && last_name && role && email && accessToken) {
      localStorage.setItem("userId", id as string);
      localStorage.setItem("firstName", first_name as string);
      localStorage.setItem("lastName", last_name as string);
      localStorage.setItem("userRole", role as string);
      localStorage.setItem("userEmail", email as string);
      localStorage.setItem("accessToken", accessToken as string);

      // Clear the URL parameters
      router
        .replace("/completeprofile", undefined, { shallow: true })
        .then(() => {
          if (isNewUser === "true") {
            console.log("New user, staying on CompleteProfileForm");
          } else {
            console.log("Existing user, redirecting to home page");
            router.push("/");
          }
        });
    }
  }, [router]);

  return (
    <DefaultLayout>
      <div className="flex justify-center items-center h-full">
        <CompleteProfileForm />
      </div>
    </DefaultLayout>
  );
}
