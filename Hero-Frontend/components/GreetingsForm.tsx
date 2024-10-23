import React, { useState, useCallback, useEffect } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Progress,
  Textarea,
} from "@nextui-org/react";
import {
  AlertCircle,
  Upload,
  FileImage,
  FileAudio,
  FileVideo,
  X,
  Send,
  User,
} from "lucide-react";
import authenticatedRequest from "../config/authenticatedRequest";

type FileType = "image" | "video" | "audio";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

interface FileInfo {
  file: File;
  name: string;
  path: string;
  fileType: FileType;
  uploadProgress: number;
  uploadStatus: "pending" | "uploading" | "completed" | "error";
  uploadedUrl?: string;
  previewUrl: string;
}

export default function BirthdayGreetingsForm() {
  const [greetings, setGreetings] = useState("");
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [fileError, setFileError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [userEmail, setUserEmail] = useState<string>("");
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  useEffect(() => {
    // Get email from localStorage
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }

    // Cleanup function to revoke object URLs
    return () => {
      Object.values(previewUrls).forEach(URL.revokeObjectURL);
    };
  }, [previewUrls]);

  const allowedTypes: Record<FileType, string[]> = {
    image: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/tiff",
      "image/bmp",
    ],
    video: [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-ms-wmv",
      "video/webm",
      "video/3gpp",
    ],
    audio: [
      "audio/mpeg",
      "audio/wav",
      "audio/aac",
      "audio/ogg",
      "audio/webm",
      "audio/flac",
    ],
  };

  const detectFileType = (file: File): FileType | undefined => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    for (const [type, mimeTypes] of Object.entries(allowedTypes)) {
      if (
        mimeTypes.some(
          (mime) =>
            file.type.startsWith(mime) ||
            (fileExtension && mime.endsWith(fileExtension))
        )
      ) {
        return type as FileType;
      }
    }
    return undefined;
  };

  const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
    console.log("Files dropped:", acceptedFiles);

    // Filter files by size and type
    const validFiles = acceptedFiles.filter((file) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`File ${file.name} is too large. Maximum size is 100MB.`);
        return false;
      }

      // Check file type
      const detectedType = detectFileType(file);
      if (!detectedType) {
        setFileError(`File ${file.name} is not a supported format.`);
        return false;
      }

      return true;
    });

    const newFiles = validFiles.map((file) => {
      const detectedType = detectFileType(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrls((prev) => ({ ...prev, [file.name]: previewUrl }));
      return {
        file,
        name: file.name,
        path: file.path || file.name,
        fileType: detectedType!,
        uploadProgress: 0,
        uploadStatus: "pending",
        previewUrl,
      } as FileInfo;
    });

    if (newFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setFileError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".tiff", ".bmp"],
      "video/*": [".mp4", ".mov", ".avi", ".wmv", ".webm", ".3gp", ".mkv"],
      "audio/*": [".mp3", ".wav", ".aac", ".ogg", ".flac"],
    },
    multiple: true,
  });

  const uploadFile = async (fileInfo: FileInfo) => {
    try {
      const response = await fetch("/api/get-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: fileInfo.name,
          fileType: fileInfo.file.type,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }
      const { url } = await response.json();
      const uploadResponse = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url);
        xhr.setRequestHeader("Content-Type", fileInfo.file.type);
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            console.log(
              `Upload progress for ${fileInfo.name}: ${percentComplete.toFixed(2)}%`
            );
            setFiles((prevFiles) =>
              prevFiles.map((f) =>
                f.name === fileInfo.name
                  ? { ...f, uploadProgress: percentComplete }
                  : f
              )
            );
          }
        };
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error("XHR error"));
        xhr.send(fileInfo.file);
      });
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.name === fileInfo.name
            ? {
                ...f,
                uploadStatus: "completed",
                uploadProgress: 100,
                uploadedUrl: url.split("?")[0],
              }
            : f
        )
      );
      console.log("File uploaded successfully:", fileInfo.name);
      return url.split("?")[0];
    } catch (error) {
      console.error(`Error uploading file ${fileInfo.name}:`, error);
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.name === fileInfo.name
            ? { ...f, uploadStatus: "error", uploadProgress: 0 }
            : f
        )
      );
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    setIsUploading(true);

    try {
      const uploadPromises = files.map(uploadFile);
      const uploadedUrls = await Promise.all(uploadPromises);

      const media = uploadedUrls.map((url, index) => ({
        type: files[index].fileType,
        url: url,
      }));

      const postData = {
        body: greetings,
        status: "processing",
        score: null,
        media: media,
      };

      console.log("Sending post data:", postData);

      const response = await authenticatedRequest({
        method: "POST",
        url: "/posts",
        data: postData,
      });

      console.log("Server response:", response.data);

      setGreetings("");
      setFiles([]);
      setIsSubmitSuccess(true);
      console.log("Form reset");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setFileError(`Failed to submit the form. ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles[index];
      URL.revokeObjectURL(fileToRemove.previewUrl);
      setPreviewUrls((prev) => {
        const { [fileToRemove.name]: _, ...rest } = prev;
        return rest;
      });
      return prevFiles.filter((_, i) => i !== index);
    });
  };

  const renderPreview = (fileInfo: FileInfo) => {
    switch (fileInfo.fileType) {
      case "image":
        return (
          <img
            src={fileInfo.previewUrl}
            alt={fileInfo.name}
            className="max-w-full h-auto max-h-40 object-contain"
          />
        );
      case "video":
        return (
          <video
            src={fileInfo.previewUrl}
            controls
            className="max-w-full h-auto max-h-40"
          >
            <track kind="captions" />
            Your browser does not support the video tag.
          </video>
        );
      case "audio":
        return (
          <audio src={fileInfo.previewUrl} controls className="w-full">
            <track kind="captions" />
            Your browser does not support the audio element.
          </audio>
        );
      default:
        return null;
    }
  };

  const FileTypeIcon = ({ fileType }: { fileType: FileType }) => {
    switch (fileType) {
      case "image":
        return <FileImage className="w-6 h-6 text-success" />;
      case "video":
        return <FileVideo className="w-6 h-6 text-primary" />;
      case "audio":
        return <FileAudio className="w-6 h-6 text-secondary" />;
    }
  };

  if (isSubmitSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <Card
          className="w-full max-w-[842px] min-h-[604px] bg-hourglass rounded-[4px] mx-auto"
          radius="none"
        >
          <div className="p-4 sm:p-6 md:p-[32px] h-full flex items-center justify-center">
            <div className="text-center max-w-[700px]">
              <h1 className="font-ztNeueRalewe italic text-2xl text-headingText sm:text-3xl md:text-[32px] font-bold leading-tight sm:leading-[38px] mb-6">
                Thank You For Your Message!
              </h1>
              <p className="text-headingText text-base sm:text-lg md:text-xl leading-relaxed">
                Your message has been added to the Wall of Wishes,
                <br />
                and will be unveiled on 29th October 2024. You've made
                <br />
                this celebration even more special!
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const isFormValid = greetings.trim() !== "";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card
        className="w-full max-w-[842px] min-h-[604px] bg-hourglass rounded-[4px] mx-auto"
        radius="none"
      >
        <div className="p-4 sm:p-6 md:p-[32px]">
          <CardHeader className="flex flex-col items-start justify-center h-auto sm:h-[90px] pt-4 sm:pt-[44px] pb-3 px-0">
            <h1 className="font-ztNeueRalewe italic text-2xl text-headingText sm:text-3xl md:text-[32px] font-bold leading-tight sm:leading-[38px] text-center mb-2 sm:mb-3">
              Create your wishes for the Chairman
            </h1>
            <p className="w-full text-headingText sm:max-w-[571px] text-sm md:text-[14px] leading-normal sm:leading-[21px] text-start">
              Share your thoughts, wishes, or stories. You can write a message,{" "}
              <br className="hidden sm:block" />
              upload a photo, or even add a video to make it more personal.
            </p>
          </CardHeader>

          <CardBody className="p-0 mt-4 sm:mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="w-full h-[372px] bg-[#323337] rounded-[4px] p-3 sm:p-4 md:p-6">
                <div className="h-full flex flex-col justify-between">
                  <Textarea
                    placeholder="Write your message here.."
                    value={greetings}
                    onValueChange={setGreetings}
                    variant="bordered"
                    minRows={8}
                    classNames={{
                      base: "max-w-full flex-grow",
                      input: "bg-transparent text-white resize-none h-full",
                      innerWrapper: "bg-transparent h-full",
                      inputWrapper: "border-none h-full",
                    }}
                  />
                  <div className="w-full h-[1px] bg-[#FFFFFF33] my-1" />

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 pt-4">
                    <div className="w-full sm:w-auto">
                      <div
                        {...getRootProps()}
                        className="w-full sm:w-auto flex gap-2 items-center justify-center bg-buttonBackground transition-colors rounded px-4 py-4 cursor-pointer"
                      >
                        <input {...getInputProps()} />
                        <span className="text-sm sm:text-sm text-buttonText">
                          Attach Image or Video
                        </span>
                      </div>
                      {fileError && (
                        <div className="text-danger flex items-center text-sm mt-2">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {fileError}
                        </div>
                      )}
                    </div>
                    <Button
                      type="submit"
                      startContent={<Send />}
                      className="w-full h-[48px] sm:w-auto bg-buttonBackground text-buttonText transition-colors rounded-[4px] px-4 py-4"
                      isDisabled={!isFormValid || isUploading}
                      isLoading={isUploading}
                    >
                      Send Wishes!
                    </Button>
                  </div>
                </div>
              </div>
              {userEmail && (
                <div className="flex items-center justify-start text-sm text-headingText mt-2">
                  <User size={12} className="mr-1" />
                  <div className="flex flex-row gap-x-1.5">
                    <span>Logged in with </span>
                    <span className="font-semibold"> {userEmail}</span>
                  </div>
                </div>
              )}

              {files.length > 0 && (
                <div className="mt-4 space-y-4">
                  {files.map((fileInfo, index) => (
                    <div
                      key={index}
                      className="bg-[#1A1A1A] p-4 rounded border border-[#FFFFFF33]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center overflow-hidden flex-grow mr-2">
                          <FileTypeIcon fileType={fileInfo.fileType} />
                          <p className="text-sm ml-2 truncate text-[#FFFFFFB2]">
                            {fileInfo.name}
                          </p>
                        </div>
                        <Button
                          isIconOnly
                          size="sm"
                          onPress={() => removeFile(index)}
                          className="text-[#FFFFFFB2] hover:text-white bg-transparent"
                          isDisabled={fileInfo.uploadStatus === "uploading"}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                      <div className="mb-2 overflow-hidden">
                        {renderPreview(fileInfo)}
                      </div>
                      <Progress
                        size="sm"
                        value={fileInfo.uploadProgress}
                        className="max-w-md"
                        classNames={{
                          base: "max-w-md",
                          track: "bg-[#333333]",
                          indicator: "bg-[#D92D20]",
                        }}
                        aria-label={`Upload progress for ${fileInfo.name}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </form>
          </CardBody>
        </div>
      </Card>
    </div>
  );
}
