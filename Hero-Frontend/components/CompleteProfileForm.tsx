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

interface CompleteProfileFormProps {
  onComplete: (success: boolean) => void;
}

const recognitionOptions = [
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
  { value: "work colleagues", label: "Work colleagues" },
];

export default function CompleteProfileForm({
  onComplete,
}: CompleteProfileFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [recognition, setRecognition] = useState("");
  const [designation, setDesignation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load stored names from localStorage
    const storedFirstName = localStorage.getItem("firstName");
    const storedLastName = localStorage.getItem("lastName");
    if (storedFirstName) setFirstName(storedFirstName);
    if (storedLastName) setLastName(storedLastName);
  }, []);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRecognition(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
        {
          first_name: firstName,
          last_name: lastName,
          user_type: recognition,
          designation: designation,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update localStorage with new names
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      localStorage.setItem("userName", `${firstName} ${lastName}`);

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
      <Card className="w-[573px] min-h-[740px] p-11 bg-[#000000] rounded-[4px] border border-[#FFFFFF33] mx-auto">
        <CardHeader className="flex flex-col items-center justify-center h-auto sm:h-[90px] pt-4 sm:pt-[44px] pb-3 px-0">
          <h1 className="font-ztNeueRalewe italic text-2xl sm:text-3xl md:text-[32px] font-bold leading-tight sm:leading-[38px] text-center mb-2 sm:mb-3">
            Tell Us More About Yourself
          </h1>
          <p className="w-full sm:max-w-[453px] text-sm md:text-[14px] leading-normal sm:leading-[21px] text-[#FFFFFFB2] text-center">
            Share your thoughts, wishes, or stories. You can write a message,
            upload a photo, or even add a video to make it more personal.
          </p>
        </CardHeader>

        <CardBody className=" items-center justify-center">
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
                onValueChange={setFirstName}
                classNames={{
                  base: "max-w-full",
                  label:
                    "text-sm md:text-[14px] font-medium mb-1 sm:mb-1.5 text-white",
                  input: "h-10 sm:h-[46px] bg-[#1C1C1C] text-white",
                  inputWrapper:
                    "h-10 sm:h-[46px] bg-[#1C1C1C] hover:!bg-[#1C1C1C] focus-within:!bg-[#1C1C1C] rounded-[4px]",
                }}
                isRequired
              />
              <Input
                label="Last Name"
                labelPlacement="outside"
                placeholder="Enter here"
                value={lastName}
                onValueChange={setLastName}
                classNames={{
                  base: "max-w-full",
                  label:
                    "text-sm md:text-[14px] font-medium mb-1 sm:mb-1.5 text-white",
                  input: "h-10 sm:h-[46px] bg-[#1C1C1C] text-white",
                  inputWrapper:
                    "h-10 sm:h-[46px] bg-[#1C1C1C] hover:!bg-[#1C1C1C] focus-within:!bg-[#1C1C1C] rounded-[4px]",
                }}
                isRequired
              />
              <Select
                label="How will the chairman recognize you?"
                labelPlacement="outside"
                placeholder="Select"
                selectedKeys={[recognition]}
                onChange={handleSelectionChange}
                classNames={{
                  base: "max-w-full",
                  label: "text-[14px] font-medium mb-1.5 text-white",
                  trigger: "h-[46px] bg-[#1C1C1C] text-white rounded-[4px]",
                  value: "text-white",
                }}
                isRequired
              >
                {recognitionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label="Designation"
                labelPlacement="outside"
                placeholder="Enter here"
                value={designation}
                onValueChange={setDesignation}
                classNames={{
                  base: "max-w-full",
                  label:
                    "text-sm md:text-[14px] font-medium mb-1 sm:mb-1.5 text-white",
                  input: "h-10 sm:h-[46px] bg-[#1C1C1C] text-white",
                  inputWrapper:
                    "h-10 sm:h-[46px] bg-[#1C1C1C] hover:!bg-[#1C1C1C] focus-within:!bg-[#1C1C1C] rounded-[4px]",
                }}
                isRequired
              />
              <Button
                type="submit"
                className="mt-2 bg-[#EE2326] h-10 sm:h-[46px] rounded-[4px] text-sm md:text-[14px] font-semibold"
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
