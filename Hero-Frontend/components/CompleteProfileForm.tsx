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
import { useRouter } from "next/router";

const recognitionOptions = [
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
  { value: "work colleagues", label: "Work colleagues" },
];

export default function CompleteProfileForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [recognition, setRecognition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
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
    setError("");

    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    if (!userId || !accessToken) {
      setError("User ID or access token not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/users/${userId}`,
        {
          first_name: firstName,
          last_name: lastName,
          user_type: recognition,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Profile updated successfully:", response.data);
      router.push("/");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[400px] max-w-full">
      <CardHeader className="flex flex-col items-start px-6 pt-6 pb-0">
        <h2 className="text-2xl font-bold">Complete Your Profile</h2>
        <p className="text-small text-default-500">
          Tell us a little more about yourself
        </p>
      </CardHeader>
      <CardBody className="px-6 py-4">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            label="First Name"
            labelPlacement="outside"
            placeholder="Enter your first name"
            variant="bordered"
            value={firstName}
            onValueChange={setFirstName}
          />
          <Input
            label="Last Name"
            labelPlacement="outside"
            placeholder="Enter your last name"
            variant="bordered"
            value={lastName}
            onValueChange={setLastName}
          />
          <Select
            label="How will the chairman recognise you?"
            labelPlacement="outside"
            placeholder="Select"
            variant="bordered"
            selectedKeys={[recognition]}
            onChange={handleSelectionChange}
          >
            {recognitionOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            color="primary"
            className="mt-4"
            type="submit"
            isLoading={isLoading}
          >
            {isLoading ? "Updating..." : "Continue"}
          </Button>
        </form>
        <p className="text-tiny text-default-400 mt-4 text-center">
          *We collect your name, association, and email to personalize your
          message, group it meaningfully, and ensure authenticity. Your data
          will remain private and won't be shared externally.
        </p>
      </CardBody>
    </Card>
  );
}
