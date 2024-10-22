import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { Mail, Eye, EyeOff } from "lucide-react";
import { GoogleIcon } from "./icons";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";

export const description =
  "A sign-up form with first name, last name, email, password, and confirm password fields. There's an option to switch to login mode and login with Google.";

// API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API functions
const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

const registerUser = async (userData: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post("/auth/register", userData);
    // The backend will handle the redirect, so we don't need to process the response here
    // We'll return true to indicate that the request was sent successfully
    return true;
  } catch (error: any) {
    // If there's a network error or the server responds with an error status
    console.error("Registration error:", error);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("An error occurred during registration");
    }
  }
};

export default function LoginForm() {
  const [isSignup, setIsSignup] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
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
        className="w-full max-w-[573px] min-h-[740px] p-4 sm:p-8 md:p-11 bg-hourglass rounded-[4px] border border-[#FFFFFF33] mx-auto items-center justify-center"
        radius="none"
      >
        <CardHeader className="flex flex-col items-center justify-center h-auto sm:h-[90px] pt-4 sm:pt-[44px] pb-3 px-0">
          <h1 className="font-ztNeueRalewe italic text-2xl text-headingText sm:text-3xl md:text-[32px] font-bold leading-tight sm:leading-[38px] text-center mb-2 sm:mb-3">
            Welcome
          </h1>
          <p className="w-full text-headingText sm:max-w-[453px] text-sm md:text-[14px] leading-normal sm:leading-[21px] text-[#FFFFFFB2] text-center">
            Share your thoughts, wishes, or stories. You can write a message,
            upload a photo, or even add a video to make it more personal.
          </p>
        </CardHeader>

        <CardBody className=" items-center justify-center">
          <div className="w-full sm:w-[364px] flex flex-col justify-center sm:mt-12">
            <form
              className="flex flex-col gap-4 sm:gap-6"
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
                classNames={{
                  base: "max-w-full",
                  label:
                    "text-sm md:text-[14px] font-medium mb-1 sm:mb-1.5 text-white",
                  input: "h-10 sm:h-[46px] text-headingText text-white",
                  inputWrapper:
                    "h-10 sm:h-[46px] bg-labelField hover:!bg-[#1C1C1C] focus-within:!bg-[#1C1C1C] rounded-[4px]",
                }}
                isRequired
              />

              {error && <p className="text-danger text-sm">{error}</p>}
              <Button
                type="submit"
                className="mt-2 bg-buttonBackground text-buttonText h-10 sm:h-[46px] rounded-[4px] text-sm md:text-[14px] font-semibold"
                radius="none"
                isLoading={isLoading}
              >
                Log In
              </Button>
            </form>
            <div className="my-4 sm:my-6">
              <div className="flex items-center">
                <div className="flex-grow h-[1px] bg-[#FFFFFF33]"></div>
                <span className="px-4 text-sm md:text-[14px] text-[#FFFFFF80]">
                  or
                </span>
                <div className="flex-grow h-[1px] bg-[#FFFFFF33]"></div>
              </div>
            </div>
            <Button
              radius="none"
              className="w-full bg-buttonBackground text-buttonText h-10 sm:h-[46px] rounded-[4px] text-sm md:text-[14px] font-semibold"
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
