import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Toaster, toast } from "sonner";

const AuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const processAuthResponse = async () => {
      if (!router.isReady) return;

      const { data } = router.query;

      if (data) {
        try {
          const dataString = Array.isArray(data) ? data[0] : data;
          const decodedData = JSON.parse(decodeURIComponent(dataString));


          if (decodedData.error) {
            console.error("Authentication error:", decodedData.error);
            toast.error(decodedData.error);
            clearAuthData();
            router.push("/login");
          } else if (decodedData.user && decodedData.accessToken) {
            saveAuthData(decodedData);

            if (decodedData.message) {
              toast.success(decodedData.message);
            }

            // Check if the success message contains "Google" to identify Google login
            const isGoogleLogin = decodedData.message
              ?.toLowerCase()
              .includes("google");

            if (decodedData.isNewUser) {
              if (isGoogleLogin) {
                // For new Google users, redirect to complete profile
                router.push("/completeprofile");
              }
            } else {
              // For existing users, redirect to dashboard or home
              router.push("/postgreeting");
            }
          } else {
            throw new Error("Unexpected authentication response");
          }
        } catch (error) {
          console.error("Error processing authentication response:", error);
          toast.error("An error occurred during authentication");
          clearAuthData();
          router.push("/login");
        }
      } else {
        console.error("No authentication data provided");
        toast.error("No authentication data provided");
        clearAuthData();
        router.push("/login");
      }
    };

    processAuthResponse();
  }, [router.isReady, router.query]);

  const saveAuthData = (data: any) => {
    const existingTheme = localStorage.getItem("theme");
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("firstName", data.user.first_name);
    localStorage.setItem("lastName", data.user.last_name);
    localStorage.setItem("isNewUser", data.isNewUser.toString());
    localStorage.setItem("userEmail", data.user.email);
    localStorage.setItem("userId", data.user.id.toString());
    localStorage.setItem(
      "userName",
      `${data.user.first_name} ${data.user.last_name}`
    );
    localStorage.setItem("userRole", data.user.role);

    // Preserve existing theme if it exists
    if (existingTheme) {
      localStorage.setItem("theme", existingTheme);
    }
  };

  const clearAuthData = () => {
    const theme = localStorage.getItem("theme");
    localStorage.clear();
    if (theme) {
      localStorage.setItem("theme", theme);
    }
  };

  return (
    <>
      <Toaster position="top-center" expand={true} richColors />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Processing Authentication
          </h2>
          <p className="text-gray-600">
            Please wait while we complete the authentication process...
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthCallback;
