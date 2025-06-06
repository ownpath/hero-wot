import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { Mail, Eye, EyeOff } from "lucide-react";
import { GoogleIcon } from "./icons";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isEmailInvalid = useMemo(() => {
    if (email === "") return false;
    return validateEmail(email) ? false : true;
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/email-auth", { email });

      // Redirect to your existing email verification page
      router.push(response.data.redirectTo);
    } catch (err: any) {
      console.error("Authentication error:", err);
      setError(err.response?.data?.error || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth route
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card
        className="w-full max-w-[573px] min-h-[456px] p-4 sm:p-8 md:p-11 bg-hourglass rounded-[4px] mx-auto items-center justify-center"
        radius="none"
      >
        <CardHeader className="flex flex-col items-center justify-center h-auto sm:h-[90px] pt-4 sm:pt-[44px] pb-3 px-0">
          <h1 className="font-ztNeueRalewe italic text-2xl text-headingText sm:text-[32px] md:text-[32px] font-bold leading-tight sm:leading-[38px] text-center mb-2 sm:mb-3">
            Welcome
          </h1>
          <p className="w-full text-headingText sm:max-w-[453px] text-sm md:text-[14px] leading-normal sm:leading-[21px] text-[#FFFFFFB2] text-center">
            Log in to share your personal message, photo, or video <br /> and
            help us create a wall of memories!
          </p>
        </CardHeader>

        <CardBody className=" items-center justify-center">
          <div className="w-full sm:w-[364px] flex flex-col justify-center sm:mt-[46px]">
            <form
              className="flex flex-col gap-5 sm:gap-6"
              onSubmit={handleSubmit}
            >
              <Input
                label="Email"
                radius="sm"
                labelPlacement="outside"
                placeholder="Enter here"
                type="email"
                value={email}
                onValueChange={setEmail}
                isInvalid={isEmailInvalid}
                errorMessage="Please enter a valid email"
                classNames={{
                  base: "max-w-full",
                  label:
                    "text-sm md:text-[14px] font-medium mb-0.5 sm:mb-1 text-white",

                  inputWrapper: "h-10 sm:h-[48px] bg-input rounded-[4px]",
                }}
                isRequired
              />

              {error && <p className="text-danger text-sm">{error}</p>}
              <Button
                type="submit"
                className="mt-[4px] bg-buttonBackground text-buttonText h-10 sm:h-[48px] rounded-[4px] text-base md:text-[14px] font-medium"
                radius="none"
                isLoading={isLoading}
              >
                Log In
              </Button>
            </form>
            <div className="my-4 sm:my-[18px]">
              <div className="flex items-center">
                <div className="flex-grow h-[0.5px] bg-headingText"></div>
                <span className="px-4 text-sm sm:text-[18px] text-headingText">
                  or
                </span>
                <div className="flex-grow h-[0.5px] bg-headingText"></div>
              </div>
            </div>
            <Button
              radius="none"
              className="w-full bg-white text-black border border-black h-10 sm:h-[48px] rounded-[4px] text-base md:text-[14px] font-medium"
              startContent={<GoogleIcon />}
              onPress={handleGoogleLogin}
            >
              Login with Google
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
