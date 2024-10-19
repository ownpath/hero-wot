import React, { useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import BirthdayGreetingsForm from "@/components/GreetingsForm";
import GreetingsList from "@/components/MasonryGrid";
import DefaultLayout from "@/layouts/default";

const API_BASE_URL = "http://localhost:8080"; // Replace with your actual API base URL

interface Post {
  id: number;
  title: string;
  body: string;
  status: "processing" | "accepted" | "rejected";
  created_at: string;
  author: {
    id: number;
    first_name: string;
    last_name: string;
  };
  approver?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  media: Array<{ url: string; type: string }>;
  author_full_name: string;
  approver_full_name?: string;
}

interface ApiResponse {
  posts: Post[];
  totalCount: number;
  nextOffset: number | null;
}

const fetchPosts = async ({ pageParam = 0 }): Promise<ApiResponse> => {
  const response = await axios.get(`${API_BASE_URL}/posts`, {
    params: {
      status: "accepted",
      limit: 10,
      offset: pageParam,
    },
  });
  return response.data;
};

export default function GreetingsFormPage() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", "accepted"],
    queryFn: fetchPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  });

  const intObserver = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (post: HTMLDivElement) => {
      if (isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (post) intObserver.current.observe(post);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  const formattedPosts = posts.map((post) => ({
    ...post,
    author: { name: post.author_full_name },
  }));

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-8 p-4">
        <div className="flex items-center justify-center w-full max-w-2xl mx-auto">
          <BirthdayGreetingsForm />
        </div>
        <div className="w-full">
          {status === "pending" ? (
            <p>Loading...</p>
          ) : status === "error" ? (
            <p>Error: {error.message}</p>
          ) : (
            <>
              <GreetingsList greetings={formattedPosts} />
              <div ref={lastPostRef} className="h-1" />{" "}
              {/* Intersection observer target */}
              {isFetchingNextPage && (
                <p className="text-center mt-4">Loading more...</p>
              )}
              {!hasNextPage && (
                <p className="text-center mt-4">No more posts to load</p>
              )}
            </>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
