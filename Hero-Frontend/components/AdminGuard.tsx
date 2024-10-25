import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import authenticatedRequest from "../config/authenticatedRequest";
import { Spinner } from "@nextui-org/react";

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          console.log("No token found");
          router.push("/");
          return;
        }

        // First, check the token contents
        try {
          const debugResponse = await authenticatedRequest({
            method: "GET",
            url: "/admin/debug-token",
          });
          console.log("Current user details:", debugResponse.data);
        } catch (error) {
          console.error("Debug token check failed:", error);
        }

        // Then try to verify admin status
        const response = await authenticatedRequest({
          method: "GET",
          url: "/admin/verify-admin",
        });

        console.log("Admin verification response:", response.data);

        if (response.status === 200) {
          console.log("Admin verified successfully");
          setIsVerified(true);
        } else {
          console.log("Not an admin, response:", response);
          router.push(
            "/login?error=Access Denied, If you are an Admin please login again"
          );
        }
      } catch (error: any) {
        console.error("Admin verification failed:", error);
        if (error.response) {
          console.error("Error response:", {
            status: error.response.status,
            data: error.response.data,
          });
        }
        router.push(
          "/login?error=Access Denied, If you are an Admin please login again"
        );
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner color="default" size="lg" />
      </div>
    );
  }

  return isVerified ? <>{children}</> : null;
};

export default AdminGuard;
