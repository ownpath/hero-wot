import React from "react";
import BirthdayGreetingsForm from "@/components/GreetingsForm";
import DefaultLayout from "@/layouts/default";
import PostsGuard from "@/components/PostsGuard";

export default function LoginPage() {
  return (
    <DefaultLayout>
      <PostsGuard>
        <div className="flex justify-center items-center h-full">
          <BirthdayGreetingsForm />
        </div>
      </PostsGuard>
    </DefaultLayout>
  );
}
