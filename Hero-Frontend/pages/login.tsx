import LoginForm from "@/components/LoginForm";
import DefaultLayout from "@/layouts/default";
import React from "react";

export default function LoginPage() {
  return (
    <DefaultLayout>
      <div className="flex justify-center items-center h-full">
        <LoginForm />
      </div>
    </DefaultLayout>
  );
}
