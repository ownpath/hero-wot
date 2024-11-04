import React, { useState, useCallback, useRef, useEffect } from "react";
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
  Divider,
  Slider,
  Input,
} from "@nextui-org/react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import authenticatedRequest from "@/config/authenticatedRequest";

import { Image, Play, Search } from "lucide-react";
import AdminBirthdayGreetingsForm from "./AdminGreetingsForm";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const SUPPORTED_MEDIA_TYPES = {
  image: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".tiff", ".bmp"],
  video: [".mp4", ".mov", ".avi", ".wmv", ".webm", ".3gp", ".mkv"],
} as const;

interface Post {
  id: number;
  title: string;
  body: string;
  status: "processing" | "accepted" | "rejected";
  score?: number;
  author?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
    designation: string;
  };
  approver?: {
    first_name: string;
    last_name: string;
  };
  updated_at: string;
  media: Array<{
    url: string;
    type: string;
  }>;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  designation: string;
  user_type: string;
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

interface UserSearchResponse {
  items: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: any;
  sort: {
    field: string;
    order: string;
  };
}

// Custom debounce function
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const getMediaType = (mediaItem: Post["media"][0]): "image" | "video" => {
  const url = mediaItem.url.toLowerCase();

  if (SUPPORTED_MEDIA_TYPES.video.some((ext) => url.endsWith(ext))) {
    return "video";
  }
  if (SUPPORTED_MEDIA_TYPES.image.some((ext) => url.endsWith(ext))) {
    return "image";
  }

  return "image";
};

const hasMediaTypes = (media: Post["media"]) => {
  const hasImages = media.some((item) =>
    SUPPORTED_MEDIA_TYPES.image.some((ext) =>
      item.url.toLowerCase().endsWith(ext)
    )
  );

  const hasVideos = media.some((item) =>
    SUPPORTED_MEDIA_TYPES.video.some((ext) =>
      item.url.toLowerCase().endsWith(ext)
    )
  );

  return { hasImages, hasVideos };
};

const MediaDisplay: React.FC<{ media: Post["media"] }> = ({ media }) => {
  if (!media || media.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {media.map((mediaItem) => {
        const mediaType = getMediaType(mediaItem);

        return (
          <div key={mediaItem.url} className="relative">
            {mediaType === "image" ? (
              <img
                src={mediaItem.url}
                alt="Post media content"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/placeholder-image.png";
                }}
              />
            ) : (
              <video
                controls
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLVideoElement;
                  target.onerror = null;
                  const container = target.parentElement;
                  if (container) {
                    container.innerHTML =
                      '<div class="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg">Video unavailable</div>';
                  }
                }}
                aria-label="Post attachment video"
              >
                <source
                  src={mediaItem.url}
                  type={`video/${mediaItem.url.split(".").pop()}`}
                />
                <track
                  kind="captions"
                  src=""
                  label="English captions"
                  srcLang="en"
                  default
                />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        );
      })}
    </div>
  );
};

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

const searchUsers = async (query: string): Promise<UserSearchResponse> => {
  const response = await authenticatedRequest({
    method: "GET",
    url: "/users/search",
    params: {
      query,
      limit: 10,
      page: 1,
    },
  });
  return response.data;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const updateScoreMutation = useMutation({
    mutationFn: async ({
      postId,
      score,
    }: {
      postId: number;
      score: number;
    }) => {
      const response = await authenticatedRequest({
        method: "PUT",
        url: `/posts/${postId}`,
        data: { score },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Score updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update score");
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

  // Use debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Add search mutation
  const searchMutation = useMutation({
    mutationFn: searchUsers,
    onSuccess: (data) => {
      setSearchResults(data.items);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to search users");
    },
    onSettled: () => {
      setIsSearching(false);
    },
  });

  // Effect to handle search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      setIsSearching(true);
      searchMutation.mutate(debouncedSearchQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Render functions

  // Add search results renderer
  const renderSearchResults = () => {
    if (isSearching) {
      return <div className="mt-4">Searching...</div>;
    }

    if (searchResults.length === 0 && searchQuery.trim()) {
      return <div className="mt-4">No users found</div>;
    }

    return (
      <div className="grid grid-cols-1 gap-4 mt-4">
        {searchResults.map((user) => (
          <Card key={user.id} className="w-full bg-white">
            <CardBody>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-black">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">ID: {user.id}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                    {user.role}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Role:</span> {user.role}
                  </p>
                  {user.designation && (
                    <p className="text-gray-700">
                      <span className="font-medium">Designation:</span>{" "}
                      {user.designation}
                    </p>
                  )}
                  {user.user_type && (
                    <p className="text-gray-700">
                      <span className="font-medium">User Type:</span>{" "}
                      {user.user_type}
                    </p>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  };

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
            className="w-full cursor-pointer bg-white"
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
                <p className="text-lg text-black font-semibold">
                  {post.author?.first_name} {post.author?.last_name}
                </p>
                <p className="text-lg text-black font-semibold">
                  {post.author?.email}
                </p>
                <p className="text-md text-black font-semibold">
                  Relation : {post.author?.user_type}
                </p>
                {}

                <p className="text-md text-black font-semibold">
                  Designation:{" "}
                  {post.author?.designation === null ||
                  post.author?.designation === undefined ||
                  post.author?.designation === "" ? (
                    <span className="text-black">N/A</span>
                  ) : (
                    <span className="text-black">
                      {post.author?.designation}
                    </span>
                  )}
                </p>

                <p className="text-md text-black font-semibold">
                  Score:{" "}
                  {post.score === null || post.score === undefined ? (
                    <span className="text-black">Not scored</span>
                  ) : (
                    <span className="text-black">{post.score}</span>
                  )}
                </p>
                <p className="text-md text-black">
                  Updated: {new Date(post.updated_at).toLocaleString()}
                </p>
                <p className="text-black text-xs">User id: {post.author?.id}</p>
                <p className="text-black text-xs">Post id: {post.id}</p>
              </div>
              {post.media && post.media.length > 0 && (
                <div className="flex gap-1">
                  {(() => {
                    const { hasImages, hasVideos } = hasMediaTypes(post.media);
                    return (
                      <>
                        {hasImages && (
                          <Image className="w-12 h-12 text-black" />
                        )}
                        {hasVideos && <Play className="w-12 h-12 text-black" />}
                      </>
                    );
                  })()}
                </div>
              )}
              <div className="flex space-x-2">
                {status === "processing" && (
                  <>
                    <Button
                      size="md"
                      color="success"
                      onPress={() => handleStatusChange(post.id, "accepted")}
                    >
                      Accept
                    </Button>
                    <Button
                      size="md"
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
              <p className="text-black">{post.body}</p>
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
                <p className="text-small text-black">USERID:{user.id}</p>

                <p className="text-small text-black">{user.email}</p>
                <p className="text-tiny text-black">Role: {user.role}</p>
              </div>
              <div></div>
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
            color="default"
            variant="solid"
            className="mb-4 bg-black text-headingText"
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
            <Tab key="search" title="Search Users">
              <div className="mt-4">
                <Input
                  value={searchQuery}
                  onValueChange={handleSearchChange}
                  placeholder="Search users by name, email, or role..."
                  startContent={<Search className="text-black" size={20} />}
                  className="max-w-md"
                  size="lg"
                />
                {renderSearchResults()}
              </div>
            </Tab>
            <Tab key="create" title="Create Post">
              <AdminBirthdayGreetingsForm />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
        className="bg-white text-black"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedPost?.title}
              </ModalHeader>
              <ModalBody>
                <p className="text-black text-xs">
                  User id: {selectedPost?.author?.id}
                </p>
                <p className="text-black text-xs">
                  Post id: {selectedPost?.id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedPost?.author?.first_name}{" "}
                  {selectedPost?.author?.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedPost?.author?.email}
                </p>
                <p>
                  <strong>Relation:</strong> {selectedPost?.author?.user_type}
                </p>
                {selectedPost?.author?.designation !== null ||
                  selectedPost?.author?.designation !== undefined ||
                  (selectedPost?.author?.designation !== "" && (
                    <p>
                      <strong>Designation:</strong>{" "}
                      {selectedPost.author.designation}
                    </p>
                  ))}

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

                {selectedPost?.media && selectedPost.media.length > 0 && (
                  <>
                    <Divider className="my-4" />
                    <p className="font-semibold mb-2">Attached Media:</p>
                    <MediaDisplay media={selectedPost.media} />
                  </>
                )}

                <Divider className="my-4" />
                <div className="flex flex-col gap-2">
                  <p className="font-semibold">
                    Current Score:{" "}
                    {selectedPost?.score === null ||
                    selectedPost?.score === undefined ? (
                      <span className="text-black-400">No score set</span>
                    ) : (
                      <span className="text-primary">{selectedPost.score}</span>
                    )}
                  </p>

                  <p className="font-semibold">Update Score</p>
                  <div className="flex items-center gap-4">
                    <Slider
                      label="Score"
                      size="lg"
                      step={1}
                      maxValue={100}
                      minValue={1}
                      defaultValue={selectedPost?.score || 50}
                      className="max-w-md"
                      color="primary"
                      showSteps={true}
                      marks={[
                        {
                          value: 1,
                          label: "1",
                        },
                        {
                          value: 50,
                          label: "50",
                        },
                        {
                          value: 100,
                          label: "100",
                        },
                      ]}
                      onChangeEnd={(value: any) => {
                        if (selectedPost?.id) {
                          updateScoreMutation.mutate({
                            postId: selectedPost.id,
                            score: value,
                          });
                        }
                      }}
                    />
                    <span className="text-small">
                      {selectedPost?.score || 50}
                    </span>
                  </div>
                </div>
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
