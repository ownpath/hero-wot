import React from "react";
import BirthdayGreetingsForm from "@/components/GreetingsForm";
import DefaultLayout from "@/layouts/default";

export default function LoginPage() {
  return (
    <DefaultLayout>
      <div className="flex justify-center items-center h-full">
        <BirthdayGreetingsForm />
      </div>
    </DefaultLayout>
  );
}
