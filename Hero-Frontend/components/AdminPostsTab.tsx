import React, { useState, useCallback, useRef } from "react";
import {
  Tabs,
  Tab,
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import authenticatedRequest from "@/config/authenticatedRequest";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Post {
  id: number;
  title: string;
  body: string;
  status: "processing" | "accepted" | "rejected";
  author?: {
    first_name: string;
    last_name: string;
  };
  approver?: {
    first_name: string;
    last_name: string;
  };
  updated_at: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface PostsApiResponse {
  posts: Post[];
  totalCount: number;
  nextOffset: number | null;
}

interface UsersApiResponse {
  users: User[];
  totalCount: number;
  nextOffset: number | null;
}

const fetchPosts = async ({
  pageParam = 0,
  status,
}: {
  pageParam?: number;
  status: Post["status"];
}): Promise<PostsApiResponse> => {
  const response = await authenticatedRequest({
    method: "GET",
    url: "/posts",
    params: {
      status,
      limit: 10,
      offset: pageParam,
    },
  });
  return response.data;
};

const fetchUsers = async ({ pageParam = 0 }): Promise<UsersApiResponse> => {
  const response = await authenticatedRequest({
    method: "GET",
    url: "/users",
    params: {
      limit: 10,
      offset: pageParam,
    },
  });
  return response.data;
};

const updatePostStatus = async ({
  postId,
  newStatus,
}: {
  postId: number;
  newStatus: Post["status"];
}) => {
  if (newStatus === "accepted") {
    await authenticatedRequest({
      method: "PUT",
      url: `/posts/approve/${postId}`,
    });
  } else {
    await authenticatedRequest({
      method: "PUT",
      url: `/posts/${postId}`,
      data: { status: newStatus },
    });
  }
};

const usePostQuery = (status: Post["status"]) => {
  return useInfiniteQuery({
    queryKey: ["posts", status],
    queryFn: ({ pageParam = 0 }) => fetchPosts({ pageParam, status }),
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
  });
};

const AdminManagementTabs: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const intObserver = useRef<IntersectionObserver | null>(null);

  // Post queries
  const processingQuery = usePostQuery("processing");
  const acceptedQuery = usePostQuery("accepted");
  const rejectedQuery = usePostQuery("rejected");

  // Users query
  const usersQuery = useInfiniteQuery({
    queryKey: ["users"],
    queryFn: ({ pageParam = 0 }) => fetchUsers({ pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
  });

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: updatePostStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const promoteToAdminMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await authenticatedRequest({
        method: "PUT",
        url: "/admin/promote-to-admin",
        data: { id },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to promote user to admin");
    },
  });

  // Handlers
  const handleStatusChange = (postId: number, newStatus: Post["status"]) => {
    updateStatusMutation.mutate({ postId, newStatus });
    setSelectedPost((prev) =>
      prev && prev.id === postId ? { ...prev, status: newStatus } : prev
    );
  };

  const handleCardClick = (post: Post) => {
    setSelectedPost(post);
    onOpen();
  };

  const lastPostRef = useCallback(
    (post: HTMLDivElement | null, status: Post["status"]) => {
      const query =
        status === "processing"
          ? processingQuery
          : status === "accepted"
            ? acceptedQuery
            : rejectedQuery;

      if (query.isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && query.hasNextPage) {
          query.fetchNextPage();
        }
      });

      if (post) intObserver.current.observe(post);
    },
    [processingQuery, acceptedQuery, rejectedQuery]
  );

  const lastUserRef = useCallback(
    (user: HTMLDivElement | null) => {
      if (usersQuery.isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((users) => {
        if (users[0].isIntersecting && usersQuery.hasNextPage) {
          usersQuery.fetchNextPage();
        }
      });

      if (user) intObserver.current.observe(user);
    },
    [usersQuery]
  );

  // Render functions
  const renderPostCards = (status: Post["status"]) => {
    const query =
      status === "processing"
        ? processingQuery
        : status === "accepted"
          ? acceptedQuery
          : rejectedQuery;

    const posts = query.data?.pages.flatMap((page) => page.posts) || [];

    return (
      <div className="grid grid-cols-1 gap-4 mt-4">
        {posts.map((post, index) => (
          <Card
            key={post.id}
            className="w-full cursor-pointer bg-hourglass"
            isPressable
            onPress={() => handleCardClick(post)}
            ref={
              index === posts.length - 1
                ? (node) => lastPostRef(node, status)
                : undefined
            }
          >
            <CardHeader className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-small text-default-500">
                  {post.author?.first_name} {post.author?.last_name}
                </p>
                <p className="text-tiny text-default-400">
                  Updated: {new Date(post.updated_at).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                {status === "processing" && (
                  <>
                    <Button
                      size="sm"
                      color="success"
                      onPress={() => handleStatusChange(post.id, "accepted")}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      onPress={() => handleStatusChange(post.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {(status === "accepted" || status === "rejected") && (
                  <Button
                    size="sm"
                    color="primary"
                    onPress={() => handleStatusChange(post.id, "processing")}
                  >
                    Reprocess
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody>
              <p>{post.body}</p>
            </CardBody>
          </Card>
        ))}
        {query.isFetchingNextPage && <div>Loading more...</div>}
      </div>
    );
  };

  const renderUserCards = () => {
    const users = usersQuery.data?.pages.flatMap((page) => page.users) || [];

    return (
      <div className="grid grid-cols-1 gap-4 mt-4">
        {users.map((user, index) => (
          <Card
            key={user.id}
            className="w-full bg-hourglass"
            ref={index === users.length - 1 ? lastUserRef : undefined}
          >
            <CardHeader className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-small text-default-500">{user.email}</p>
                <p className="text-tiny text-default-400">Role: {user.role}</p>
              </div>
              <div>
                {user.role !== "admin" && (
                  <Button
                    size="sm"
                    color="primary"
                    isLoading={promoteToAdminMutation.isPending}
                    onPress={() => promoteToAdminMutation.mutate(user.id)}
                  >
                    Make Admin
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
        {usersQuery.isFetchingNextPage && <div>Loading more...</div>}
      </div>
    );
  };

  // Loading and error states
  if (
    processingQuery.isLoading ||
    acceptedQuery.isLoading ||
    rejectedQuery.isLoading ||
    usersQuery.isLoading
  )
    return <div>Loading...</div>;

  if (
    processingQuery.isError ||
    acceptedQuery.isError ||
    rejectedQuery.isError ||
    usersQuery.isError
  )
    return <div>Error fetching data</div>;

  return (
    <>
      <Card className="w-full bg-black">
        <CardBody>
          <Tabs
            aria-label="Admin management tabs"
            color="primary"
            variant="solid"
            className="mb-4"
          >
            <Tab key="posts" title="Posts">
              <Tabs>
                <Tab key="processing" title="Processing">
                  {renderPostCards("processing")}
                </Tab>
                <Tab key="accepted" title="Accepted">
                  {renderPostCards("accepted")}
                </Tab>
                <Tab key="rejected" title="Rejected">
                  {renderPostCards("rejected")}
                </Tab>
              </Tabs>
            </Tab>
            <Tab key="users" title="Users">
              <div className="mt-4">{renderUserCards()}</div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedPost?.title}
              </ModalHeader>
              <ModalBody>
                <p>
                  <strong>Author:</strong> {selectedPost?.author?.first_name}{" "}
                  {selectedPost?.author?.last_name}
                </p>
                <p>
                  <strong>Status:</strong> {selectedPost?.status}
                </p>
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(selectedPost?.updated_at ?? "").toLocaleString()}
                </p>
                {selectedPost?.approver && (
                  <p>
                    <strong>Approved by:</strong>{" "}
                    {selectedPost.approver.first_name}{" "}
                    {selectedPost.approver.last_name}
                  </p>
                )}
                <p className="mt-4">{selectedPost?.body}</p>
              </ModalBody>
              <ModalFooter>
                {selectedPost?.status === "processing" && (
                  <>
                    <Button
                      color="success"
                      onPress={() =>
                        handleStatusChange(selectedPost.id, "accepted")
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      color="danger"
                      onPress={() =>
                        handleStatusChange(selectedPost.id, "rejected")
                      }
                    >
                      Reject
                    </Button>
                  </>
                )}
                {(selectedPost?.status === "accepted" ||
                  selectedPost?.status === "rejected") && (
                  <Button
                    color="primary"
                    onPress={() =>
                      handleStatusChange(selectedPost.id, "processing")
                    }
                  >
                    Reprocess
                  </Button>
                )}
                <Button color="default" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AdminManagementTabs;
