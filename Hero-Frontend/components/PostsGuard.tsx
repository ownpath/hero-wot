import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import authenticatedRequest from "../config/authenticatedRequest";
import { Spinner } from "@nextui-org/react";

interface ProfileGuardProps {
  children: React.ReactNode;
}

const PostsGuard: React.FC<ProfileGuardProps> = ({ children }) => {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          console.log("No token found");
          router.push("/login?error=Please login to post");
          return;
        }

        // Check profile completion status
        const response = await authenticatedRequest({
          method: "GET",
          url: "/auth/check-profile-completion",
        });

        console.log("Profile verification response:", response.data);

        if (response.status === 200) {
          console.log("Profile complete, proceeding...");
          setIsVerified(true);
        }
      } catch (error: any) {
        console.error("Profile verification failed:", error);

        if (error.response) {
          const { status, data } = error.response;
          console.error("Error response:", { status, data });

          if (status === 401) {
            router.push("/login?error=Please login to post");
          } else if (status === 403 && data.requiresProfileCompletion) {
            const queryParams: Record<string, string> = {
              isRedirected: "true",
              message: `Please complete your profile to continue. Missing information: ${Object.entries(
                data.missingFields
              )
                .filter(([_, isMissing]) => isMissing)
                .map(([field]) =>
                  field.replace(/([A-Z])/g, " $1").toLowerCase()
                )
                .join(", ")}`,
            };

            // Add firstName and lastName to query params if they exist in userData
            if (data.userData?.firstName) {
              queryParams.firstName = data.userData.firstName;
            }
            if (data.userData?.lastName) {
              queryParams.lastName = data.userData.lastName;
            }

            router.push({
              pathname: "/completeprofile",
              query: queryParams,
            });
          } else {
            router.push("/login?error=Please login to continue");
          }
        } else {
          router.push("/login?error=An error occurred. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyProfile();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner color="default" size="lg" />
      </div>
    );
  }

  return isVerified ? <>{children}</> : null;
};

export default PostsGuard;
