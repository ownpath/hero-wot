import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CompleteProfileFormProps {
  onComplete: (success: boolean) => void;
  firstNameProp?: string;
  lastNameProp?: string;
}
const recognitionOptions = [
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
  { value: "team hero", label: "Team Hero" },
  { value: "business partners", label: "Business Partners" },
  { value: "proud hero owner", label: "Proud Hero Owner" },
];

export default function CompleteProfileForm({
  onComplete,
  firstNameProp = "",
  lastNameProp = "",
}: CompleteProfileFormProps) {
  const [firstName, setFirstName] = useState(firstNameProp);
  const [lastName, setLastName] = useState(lastNameProp);
  const [recognition, setRecognition] = useState("");
  const [designation, setDesignation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    recognition: false,
  });

  const validateForm = () => {
    const newErrors = {
      firstName: !firstName || firstName.trim().length === 0,
      lastName: !lastName || lastName.trim().length === 0,
      recognition: !recognition || recognition.trim().length === 0,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRecognition = e.target.value;
    setRecognition(newRecognition);
    // Clear designation if switching away from team hero
    if (newRecognition !== "team hero") {
      setDesignation("");
    }
    setErrors((prev) => ({ ...prev, recognition: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsLoading(true);

    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    if (!userId || !accessToken) {
      toast.error("User ID or access token not found. Please log in again.");
      setIsLoading(false);
      onComplete(false);
      return;
    }

    try {
      await axios.put(
        `${API_URL}/users/${userId}`,
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          user_type: recognition,
          // Only include designation if recognition is team hero
          ...(recognition === "team hero" && {
            designation: designation.trim(),
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      localStorage.setItem("firstName", firstName.trim());
      localStorage.setItem("lastName", lastName.trim());
      localStorage.setItem(
        "userName",
        `${firstName.trim()} ${lastName.trim()}`
      );

      toast.success("Profile updated successfully!");
      onComplete(true);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.error ||
        "Failed to update profile. Please try again.";
      toast.error(errorMessage);
      onComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-[573px] min-h-[508px] p-11 bg-hourglass rounded-[4px] mx-auto">
        <CardHeader className="flex flex-col items-center justify-center h-auto sm:h-[38px] pt-4 sm:pt-[44px] pb-3 px-0">
          <h1 className="font-ztNeueRalewe italic text-headingText text-2xl sm:text-3xl md:text-[32px] font-bold leading-tight sm:leading-[38px] text-center mb-2 sm:mb-3">
            Tell Us More About Yourself
          </h1>
          <p className="w-full sm:max-w-[453px] text-headingText text-sm md:text-[14px] leading-normal sm:leading-[21px] text-[#FFFFFFB2] text-center">
            We’d love to know a bit more about you! Your details will help us
            personalize the experience.
          </p>
        </CardHeader>

        <CardBody className="items-center justify-center">
          <div className="w-full sm:w-[364px] flex flex-col justify-center mt-6 sm:mt-12">
            <form
              className="flex flex-col gap-4 sm:gap-6"
              onSubmit={handleSubmit}
            >
              <Input
                label="First Name"
                labelPlacement="outside"
                placeholder="Enter here"
                value={firstName}
                onValueChange={(value) => {
                  setFirstName(value);
                  setErrors((prev) => ({ ...prev, firstName: false }));
                }}
                classNames={{
                  base: "max-w-full",
                  label:
                    "text-sm md:text-[14px] font-semibold mb-1 sm:mb-1.5 text-headingText",
                  inputWrapper: `h-10 sm:h-[46px] bg-input rounded-[4px] ${
                    errors.firstName ? "border-2 border-red-500" : ""
                  }`,
                }}
                isRequired
                isInvalid={errors.firstName}
                errorMessage={errors.firstName ? "First name is required" : ""}
              />
              <Input
                label="Last Name"
                labelPlacement="outside"
                placeholder="Enter here"
                value={lastName}
                onValueChange={(value) => {
                  setLastName(value);
                  setErrors((prev) => ({ ...prev, lastName: false }));
                }}
                classNames={{
                  base: "max-w-full",
                  label:
                    "text-sm md:text-[14px] font-semibold mb-1 sm:mb-1.5 text-headingText",
                  inputWrapper: `h-10 sm:h-[46px] bg-input rounded-[4px] ${
                    errors.lastName ? "border-2 border-red-500" : ""
                  }`,
                }}
                isRequired
                isInvalid={errors.lastName}
                errorMessage={errors.lastName ? "Last name is required" : ""}
              />
              <Select
                label="How will the chairman recognize you?"
                labelPlacement="outside"
                placeholder="Select"
                selectedKeys={[recognition]}
                onChange={handleSelectionChange}
                classNames={{
                  base: "max-w-full",
                  label:
                    "text-[14px] font-semibold mb-1 text-headingText whitespace-nowrap",
                  trigger: `h-[46px] bg-input text-placeHolder rounded-[4px] ${
                    errors.recognition ? "border-2 border-red-500" : ""
                  }`,
                  value: "text-headingText",
                }}
                isRequired
                isInvalid={errors.recognition}
                errorMessage={
                  errors.recognition ? "Recognition type is required" : ""
                }
              >
                {recognitionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              {recognition === "team hero" && (
                <Input
                  label="Designation"
                  labelPlacement="outside"
                  placeholder="Enter here"
                  value={designation}
                  onValueChange={setDesignation}
                  classNames={{
                    base: "max-w-full",
                    label:
                      "text-sm md:text-[14px] font-semibold mb-1 sm:mb-1.5 text-headingText",
                    inputWrapper: "h-10 sm:h-[46px] bg-input rounded-[4px]",
                  }}
                  isRequired
                />
              )}
              <Button
                type="submit"
                className="mt-2 bg-buttonBackground h-10 sm:h-[46px] rounded-[4px] text-buttonText text-sm md:text-[14px] font-semibold"
                isLoading={isLoading}
              >
                Continue
              </Button>
            </form>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
