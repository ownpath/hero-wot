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
import axios from "axios";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:8080";

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

interface ApiResponse {
  posts: Post[];
  totalCount: number;
  nextOffset: number | null;
}

const fetchPosts = async ({
  pageParam = 0,
  status,
}: {
  pageParam?: number;
  status: Post["status"];
}): Promise<ApiResponse> => {
  const response = await axios.get<ApiResponse>(`${API_BASE_URL}/posts`, {
    params: {
      status,
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
    await axios.put(`${API_BASE_URL}/posts/approve/${postId}`);
  } else {
    await axios.put(`${API_BASE_URL}/posts/${postId}`, { status: newStatus });
  }
};

const PostManagementTabs: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  const createPostQuery = (status: Post["status"]) =>
    useInfiniteQuery({
      queryKey: ["posts", status],
      queryFn: ({ pageParam = 0 }) => fetchPosts({ pageParam, status }),
      getNextPageParam: (lastPage) => lastPage.nextOffset,
      initialPageParam: 0,
    });

  const processingQuery = createPostQuery("processing");
  const acceptedQuery = createPostQuery("accepted");
  const rejectedQuery = createPostQuery("rejected");

  const updateStatusMutation = useMutation({
    mutationFn: updatePostStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

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

  const intObserver = useRef<IntersectionObserver | null>(null);
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
    [
      processingQuery.isFetchingNextPage,
      acceptedQuery.isFetchingNextPage,
      rejectedQuery.isFetchingNextPage,
    ]
  );

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
            className="w-full cursor-pointer hover:bg-gray-800"
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
              <div
                className="flex space-x-2"
                onClick={(e) => e.preventDefault()}
              >
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

  if (
    processingQuery.isLoading ||
    acceptedQuery.isLoading ||
    rejectedQuery.isLoading
  )
    return <div>Loading...</div>;
  if (processingQuery.isError || acceptedQuery.isError || rejectedQuery.isError)
    return <div>Error fetching posts</div>;

  return (
    <>
      <Card className="w-full bg-black">
        <CardBody>
          <Tabs
            aria-label="Post management tabs"
            color="primary"
            variant="solid"
            className="mb-4"
          >
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

export default PostManagementTabs;
