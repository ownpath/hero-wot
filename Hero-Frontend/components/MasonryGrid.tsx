import React, { useState, useCallback, useRef, useEffect } from "react";
import Masonry from "react-masonry-css";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
  Slider,
} from "@nextui-org/react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import authenticatedRequest from "@/config/authenticatedRequest";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { Skeleton } from "@nextui-org/skeleton";

interface Post {
  id: number;
  title: string;
  body: string;
  status: "processing" | "accepted" | "rejected";
  score?: number;
  author?: {
    first_name: string;
    last_name: string;
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

interface PostCardProps {
  post: Post;
  handleCardClick: (post: Post) => void;
}

const SUPPORTED_MEDIA_TYPES = {
  image: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".tiff", ".bmp"],
  video: [".mp4", ".mov", ".avi", ".wmv", ".webm", ".3gp", ".mkv"],
} as const;

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
  const hasImages = media?.some((item) =>
    SUPPORTED_MEDIA_TYPES.image.some((ext) =>
      item.url.toLowerCase().endsWith(ext)
    )
  );

  const hasVideos = media?.some((item) =>
    SUPPORTED_MEDIA_TYPES.video.some((ext) =>
      item.url.toLowerCase().endsWith(ext)
    )
  );

  return { hasImages, hasVideos };
};

interface MediaDisplayProps {
  media: Array<{
    url: string;
    type: string;
  }>;
  isModal?: boolean;
  cardView?: boolean;
}

const MediaDisplay = React.memo(
  ({ media, isModal = false }: MediaDisplayProps) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [videoLoading, setVideoLoading] = useState(true);

    if (!media || media.length === 0) return null;

    if (!isModal) {
      // Card View - Single media with 4:3 aspect ratio
      return (
        <div className="w-full relative aspect-[4/3]">
          {media.map((mediaItem, index) => {
            const mediaType = getMediaType(mediaItem);
            if (index === 0) {
              return mediaType === "image" ? (
                <div key={mediaItem.url} className="relative w-full h-full">
                  <Skeleton
                    isLoaded={!imageLoading}
                    className="w-full h-full rounded-none"
                  >
                    <Image
                      src={mediaItem.url}
                      alt="Post content"
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onLoadingComplete={() => setImageLoading(false)}
                    />
                  </Skeleton>
                </div>
              ) : (
                <div key={mediaItem.url} className="relative w-full h-full">
                  <video
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="w-full h-full object-cover"
                    aria-label="Video preview"
                    onLoadedData={() => setVideoLoading(false)}
                  >
                    <source
                      src={mediaItem.url}
                      type={`video/${mediaItem.url.split(".").pop()}`}
                    />
                    <track kind="captions" />
                  </video>

                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"></div>
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }

    // Modal View - Full size media
    return (
      <div className="space-y-4 w-full">
        {media.map((mediaItem) => {
          const mediaType = getMediaType(mediaItem);
          return (
            <div key={mediaItem.url} className="relative w-full">
              {mediaType === "image" ? (
                <div className="relative aspect-[4/3]">
                  <Skeleton
                    isLoaded={!imageLoading}
                    className="w-full h-full rounded-lg"
                  >
                    <Image
                      src={mediaItem.url}
                      alt="Post media content"
                      fill
                      className="object-cover"
                      sizes="100vw"
                      onLoadingComplete={() => setImageLoading(false)}
                    />
                  </Skeleton>
                </div>
              ) : (
                <Skeleton
                  isLoaded={!videoLoading}
                  className="w-full rounded-lg"
                >
                  <video
                    controls
                    autoPlay
                    className="w-full"
                    onLoadedData={() => setVideoLoading(false)}
                    style={{ backgroundColor: "transparent" }}
                  >
                    <source
                      src={mediaItem.url}
                      type={`video/${mediaItem.url.split(".").pop()}`}
                    />
                    <track kind="captions" />
                  </video>
                </Skeleton>
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

MediaDisplay.displayName = "MediaDisplay";

const PostCard: React.FC<PostCardProps> = React.memo(
  ({ post, handleCardClick }) => {
    const { hasImages, hasVideos } = hasMediaTypes(post.media);

    return (
      <Card
        isPressable
        onPress={() => handleCardClick(post)}
        className=" w-[360px] mb-4 bg-white overflow-hidden rounded-[4px]"
      >
        <CardBody className="p-0">
          {post.media && post.media.length > 0 && (
            <MediaDisplay media={post.media} isModal={false} cardView={true} />
          )}

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-ztNeueRalewe italic text-2xl font-bold text-default-700 mb-2">
                  {post.author?.first_name} {post.author?.last_name}
                </h3>
                <p className="text-xs text-default-500 mb-8">
                  {post.author?.designation
                    ? `${post.author.user_type}/${post.author.designation}`
                    : post.author?.user_type}
                </p>
              </div>
            </div>
            <p className="text-sm text-default-600">{post.body}</p>
          </div>
        </CardBody>
      </Card>
    );
  }
);

PostCard.displayName = "PostCard";

const breakpointColumns = {
  default: 4,
  1400: 3,
  1100: 2,
  700: 1,
};

const masonryStyles = `
 .my-masonry-grid {
  display: -webkit-box; /* Not needed if autoprefixing */
  display: -ms-flexbox; /* Not needed if autoprefixing */
  display: flex;
  margin-left: -30px; /* gutter size offset */
  width: auto;
}
.my-masonry-grid_column {
  padding-left: 30px; /* gutter size */
  background-clip: padding-box;
}

/* Style your items */
.my-masonry-grid_column > div { /* change div to reference your elements you put in <Masonry> */
  margin-bottom: 24px;
  margin-left: 24px;
  margin-right: 24px
}
`;

const PostsMasonryLayout: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const loadingTriggerRef = useRef<HTMLDivElement>(null);

  const postsQuery = useInfiniteQuery({
    queryKey: ["accepted-posts"],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await authenticatedRequest({
        method: "GET",
        url: "/posts/accepted",
        params: {
          limit: 100,
          offset: pageParam,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
  });

  const handleCardClick = useCallback(
    (post: Post) => {
      setSelectedPost(post);
      onOpen();
    },
    [onOpen]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          postsQuery.hasNextPage &&
          !postsQuery.isFetchingNextPage
        ) {
          postsQuery.fetchNextPage();
        }
      },
      { rootMargin: "100px" }
    );

    if (loadingTriggerRef.current) {
      observer.observe(loadingTriggerRef.current);
    }

    return () => observer.disconnect();
  }, [
    postsQuery.hasNextPage,
    postsQuery.isFetchingNextPage,
    postsQuery.fetchNextPage,
  ]);

  if (postsQuery.isLoading) return <div>Loading...</div>;
  if (postsQuery.isError) return <div>Error fetching posts</div>;

  const posts = postsQuery.data?.pages.flatMap((page) => page.posts) || [];

  return (
    <>
      <style>{masonryStyles}</style>

      <div className="p-4 relative">
        <Masonry
          breakpointCols={breakpointColumns}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              handleCardClick={handleCardClick}
            />
          ))}
        </Masonry>
      </div>
      <div
        ref={loadingTriggerRef}
        className="absolute left-0 w-full h-1 pointer-events-none"
        style={{ top: "33vh" }}
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="3xl"
        scrollBehavior="inside"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                <p className="font-ztNeueRalewe italic text-2xl font-bold text-default-700 mb-2">
                  {selectedPost?.author?.first_name}{" "}
                  {selectedPost?.author?.last_name}
                </p>
                {selectedPost?.media && selectedPost.media.length > 0 && (
                  <>
                    <Divider className="my-4" />
                    <MediaDisplay
                      media={selectedPost.media}
                      isModal={true}
                      cardView={false}
                    />
                  </>
                )}

                <p className="mt-4">{selectedPost?.body}</p>
              </ModalBody>
              <ModalFooter>
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

PostsMasonryLayout.displayName = "PostsMasonryLayout";

export default PostsMasonryLayout;
