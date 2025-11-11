import { createHash } from "node:crypto";

import { env, hasCloudinaryConfig } from "@/lib/env";

export type UploadSignatureOptions = {
  folder?: string;
  eager?: string;
  publicId?: string;
};

export type UploadSignature = {
  uploadUrl: string;
  apiKey: string;
  cloudName: string;
  signature: string;
  timestamp: number;
  folder?: string;
  eager?: string;
  publicId?: string;
};

const createStringToSign = (params: Record<string, string>): string => {
  const entries = Object.entries(params)
    .filter(([, value]) => value.length > 0)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

  return entries.map(([key, value]) => `${key}=${value}`).join("&");
};

export const createUploadSignature = (
  options: UploadSignatureOptions = {},
): UploadSignature | null => {
  if (!hasCloudinaryConfig()) {
    return null;
  }

  const timestamp = Math.floor(Date.now() / 1000);

  const params: Record<string, string> = {
    timestamp: String(timestamp),
  };

  if (options.folder) {
    params.folder = options.folder;
  }

  if (options.eager) {
    params.eager = options.eager;
  }

  if (options.publicId) {
    params.public_id = options.publicId;
  }

  const stringToSign = createStringToSign(params);
  const signature = createHash("sha1")
    .update(`${stringToSign}${env.cloudinaryApiSecret}`)
    .digest("hex");

  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/auto/upload`,
    apiKey: env.cloudinaryApiKey,
    cloudName: env.cloudinaryCloudName,
    signature,
    timestamp,
    folder: options.folder,
    eager: options.eager,
    publicId: options.publicId,
  };
};

export const buildCloudinaryImageUrl = (publicId: string): string | null => {
  if (!env.cloudinaryCloudName) {
    return null;
  }

  return `https://res.cloudinary.com/${env.cloudinaryCloudName}/image/upload/${publicId}`;
};
