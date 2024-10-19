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
} from "lucide-react";

type FileType = "image" | "video" | "audio";

interface FileInfo {
  file: File;
  name: string;
  path: string;
  fileType: FileType;
  uploadProgress: number;
  uploadStatus: "pending" | "uploading" | "completed" | "error";
  uploadedUrl?: string;
}

export default function BirthdayGreetingsForm() {
  const [title, setTitle] = useState("");
  const [greetings, setGreetings] = useState("");
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [fileError, setFileError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    files.forEach((file) => {
      console.log(
        `File ${file.name} progress: ${file.uploadProgress.toFixed(2)}%`
      );
    });
  }, [files]);

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

  const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
    console.log("Files dropped:", acceptedFiles);
    const newFiles = acceptedFiles
      .map((file) => {
        const detectedType = detectFileType(file);
        if (detectedType) {
          return {
            file,
            name: file.name,
            path: file.path || file.name,
            fileType: detectedType,
            uploadProgress: 0,
            uploadStatus: "pending",
          } as FileInfo;
        }
        return null;
      })
      .filter((file): file is FileInfo => file !== null);

    if (newFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setFileError("");
    } else {
      setFileError("Please upload valid image, video, or audio files.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".tiff", ".bmp"],
      "video/*": [".mp4", ".mov", ".avi", ".wmv", ".webm", ".3gp"],
      "audio/*": [".mp3", ".wav", ".aac", ".ogg", ".flac"],
    },
    multiple: true,
  });

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
        title,
        body: greetings,
        userId: 10,
        status: "processing",
        score: null,
        media: media,
      };

      console.log("Sending post data:", postData);

      const response = await fetch("http://localhost:8080/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.error}`
        );
      }

      const result = await response.json();
      console.log("Server response:", result);

      setTitle("");
      setGreetings("");
      setFiles([]);
      console.log("Form reset");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setFileError(`Failed to submit the form. ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
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

  const isFormValid = title.trim() !== "" && greetings.trim() !== "";

  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex flex-col items-start px-6 pt-6 pb-0">
        <h4 className="text-xl font-bold">Post Birthday Greetings</h4>
        <p className="text-small text-default-500">
          Create a special birthday message with media
        </p>
      </CardHeader>
      <CardBody className="px-6 py-4 overflow-visible">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title"
            value={title}
            onValueChange={setTitle}
            placeholder="Enter a title for your greeting"
            variant="bordered"
            isRequired
            labelPlacement="outside"
          />

          <Textarea
            label="Greetings"
            value={greetings}
            onValueChange={setGreetings}
            placeholder="Write your birthday message here"
            variant="bordered"
            minRows={3}
            isRequired
            labelPlacement="outside"
          />

          <div className="space-y-2">
            <p className="text-small font-medium">
              Upload Media (Images, Videos, or Audio)
            </p>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                isDragActive
                  ? "border-primary bg-primary-50"
                  : "border-default-300"
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-10 h-10 mb-2 text-default-400" />
                  <p>
                    Drag &apos;n&apos; drop files here, or click to select files
                  </p>
                </div>
              )}
            </div>
            {fileError && (
              <div className="text-danger flex items-center text-sm mt-2">
                <AlertCircle className="w-4 h-4 mr-1" />
                {fileError}
              </div>
            )}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((fileInfo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-content2 p-2 rounded"
                  >
                    <div className="flex items-center overflow-hidden flex-grow mr-2">
                      <FileTypeIcon fileType={fileInfo.fileType} />
                      <p className="text-sm ml-2 truncate">{fileInfo.name}</p>
                    </div>
                    <div className="flex items-center">
                      <Progress
                        size="md"
                        value={fileInfo.uploadProgress}
                        color="primary"
                        className="max-w-md w-20 mr-2"
                        aria-label={`Upload progress for ${fileInfo.name}`}
                      />
                      <Button
                        isIconOnly
                        size="sm"
                        onPress={() => removeFile(index)}
                        color="danger"
                        variant="light"
                        isDisabled={fileInfo.uploadStatus === "uploading"}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            color="primary"
            isLoading={isUploading}
            className="w-full"
            isDisabled={!isFormValid || isUploading}
          >
            {isUploading ? "Uploading..." : "Post Greeting"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
