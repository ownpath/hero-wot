// pages/api/get-upload-url.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET || "");

console.log("google creds", bucket);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res
        .status(400)
        .json({ error: "fileName and fileType are required" });
    }

    const file = bucket.file(fileName);

    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
      contentType: fileType,
    });

    res.status(200).json({ url });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
}
