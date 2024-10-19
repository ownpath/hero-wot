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
const API_URL = "http://localhost:8080";

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
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
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

  const isPasswordMatch = useMemo(() => {
    if (password === "" || confirmPassword === "") return true;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }
        const userData = await registerUser({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        });
        console.log("Registration successful:", userData);
        // Optionally, log the user in automatically after registration
        // or redirect to a "registration successful" page
        router.push("/completeprofile");
      } else {
        const userData = await loginUser(email, password);
        console.log("Login successful:", userData);
        // Store the token in localStorage or a secure cookie
        localStorage.setItem("token", userData.accessToken);
        // Redirect to dashboard or home page
        router.push("/completeprofile");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth route
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <Card className="w-[350px]">
      <CardHeader className="flex flex-col items-start px-6 pt-6 pb-0">
        <h4 className="text-large font-bold">
          {isSignup ? "Sign Up" : "Login"}
        </h4>
        <p className="text-small text-default-500">
          {isSignup
            ? "Create a new account"
            : "Enter your email to login to your account"}
        </p>
      </CardHeader>
      <CardBody className="px-6 py-4">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="flex gap-2">
              <Input
                label="First Name"
                labelPlacement="outside"
                placeholder="John"
                variant="bordered"
                value={firstName}
                onValueChange={setFirstName}
                isRequired
              />
              <Input
                label="Last Name"
                labelPlacement="outside"
                placeholder="Doe"
                variant="bordered"
                value={lastName}
                onValueChange={setLastName}
                isRequired
              />
            </div>
          )}
          <Input
            label="Email"
            labelPlacement="outside"
            placeholder="you@example.com"
            type="email"
            variant="bordered"
            value={email}
            onValueChange={setEmail}
            isInvalid={isEmailInvalid}
            color={isEmailInvalid ? "danger" : "default"}
            errorMessage={isEmailInvalid && "Please enter a valid email"}
            endContent={
              <Mail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            isRequired
          />
          <Input
            label="Password"
            labelPlacement="outside"
            placeholder="Enter your password"
            variant="bordered"
            value={password}
            onValueChange={setPassword}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={togglePasswordVisibility}
                aria-label="toggle password visibility"
              >
                {isPasswordVisible ? (
                  <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <Eye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isPasswordVisible ? "text" : "password"}
            isRequired
          />
          {isSignup && (
            <Input
              label="Confirm Password"
              labelPlacement="outside"
              placeholder="Confirm your password"
              variant="bordered"
              value={confirmPassword}
              onValueChange={setConfirmPassword}
              isInvalid={!isPasswordMatch}
              color={isPasswordMatch ? "default" : "danger"}
              errorMessage={!isPasswordMatch && "Passwords do not match"}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label="toggle confirm password visibility"
                >
                  {isConfirmPasswordVisible ? (
                    <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <Eye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isConfirmPasswordVisible ? "text" : "password"}
              isRequired
            />
          )}
          {!isSignup && (
            <div className="text-right">
              <Link href="#" className="text-sm text-primary hover:underline">
                Forgot your password?
              </Link>
            </div>
          )}

          {error && <p className="text-danger text-sm">{error}</p>}

          <Button
            type="submit"
            color="primary"
            className="mt-2"
            isLoading={isLoading}
          >
            {isSignup ? "Sign Up" : "Login"}
          </Button>
        </form>
        <Button
          variant="bordered"
          className="w-full mt-4"
          startContent={<GoogleIcon />}
          onPress={handleGoogleLogin}
        >
          Login with Google
        </Button>
        <div className="mt-4 text-center">
          <Button
            variant="light"
            onPress={() => setIsSignup(!isSignup)}
            className="text-sm"
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
