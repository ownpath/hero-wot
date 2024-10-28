import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const VerifyEmail = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const { userId } = router.query;
    if (userId && typeof userId === "string") {
      setUserId(userId);
    }
  }, [router.query]);

  const handleChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(0, 1);
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text/plain")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User ID is missing. Please try logging in again.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/verify-email`, {
        userId,
        otp: otp.join(""),
      });
      const data = response.data;

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

      toast.success(data.message);
      if (data.isNewUser === true) {
        router.push("/completeprofile");
      } else {
        router.push("/postgreeting");
      }
    } catch (error: any) {
      console.error("Email verification error:", error);
      toast.error(
        error.response?.data?.error ||
          "Email verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex items-center justify-center min-h-screen">
        <Toaster position="bottom-right" expand={true} richColors />
        <Card className="w-full max-w-[573px] min-h-[280px] p-[44px] items-center justify-center bg-hourglass rounded-[4px] mx-auto ">
          <CardHeader className="flex flex-col items-center justify-center h-auto sm:h-[90px] pt-4 sm:pt-[44px] pb-3 px-0">
            <h1
              className="font-ztNeueRalewe italic text-headingText text-2xl sm:text-3xl md:text-[32px] font-bold leading-tight sm:leading-[38px] text-center mb-2 sm:mb-3"
              style={{ fontFamily: "serif" }}
            >
              We&apos;ve Sent You An Email!
            </h1>
            <p className="w-full sm:max-w-[453px] text-headingText text-sm md:text-[14px] leading-normal sm:leading-[21px] text-center">
              We&apos;ve just sent you a code to your email address.
              <br />
              You can paste the code you&apos;ve received below.
            </p>
          </CardHeader>
          <CardBody className="flex flex-col max-w-full items-center justify-center py-2 sm:py-8 px-8">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center w-full space-y-4 sm:space-y-6"
            >
              <div className="flex justify-center space-x-1 sm:space-x-2 md:space-x-3 w-full">
                {otp.map((digit, index) => (
                  <React.Fragment key={index}>
                    <input
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-[32px] h-10 sm:w-[38px] sm:h-14 text-center text-lg sm:text-2xl bg-input rounded-[4px]"
                    />
                    {index === 2 && (
                      <span className="text-lg sm:text-2xl self-center">-</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <Button
                type="submit"
                className="bg-buttonBackground text-buttonText h-10 sm:h-[46px] rounded-[4px] text-md md:text-[14px] font-semibold"
                radius="none"
                isLoading={isLoading}
              >
                Submit
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default VerifyEmail;
