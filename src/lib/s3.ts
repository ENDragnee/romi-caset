import "dotenv/config";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const getEnv = (key: string, fallback = ""): string =>
  process.env[key] ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.[key]) ||
  fallback;

const endpoint = getEnv(
  "SEAWEEDFS_S3_ENDPOINT",
  "https://s3.us-east-005.backblazeb2.com",
);
const bucket = getEnv("SEAWEEDFS_BUCKET", "romiCaset");
const accessKey = getEnv("SEAWEEDFS_ACCESS_KEY");
const secretKey = getEnv("SEAWEEDFS_SECRET_KEY");
const region = getEnv("SEAWEEDFS_REGION", "us-east-005");

/* ---------- Singleton S3 Client ---------- */

const globalForS3 = globalThis as unknown as { s3Client?: S3Client };

export const GetS3Client = (): S3Client => {
  if (globalForS3.s3Client) return globalForS3.s3Client;

  const client = new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId: accessKey.trim(),
      secretAccessKey: secretKey.trim(),
    },
    forcePathStyle: true,
    // CRITICAL for Backblaze B2: Disables auto-appended CRC32 checksums
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });

  if (process.env.NODE_ENV !== "production") {
    globalForS3.s3Client = client;
  }
  return client;
};

export const s3 = GetS3Client();

/* ---------- Helpers ---------- */

/** Generate presigned PUT URL for direct client-to-bucket upload */
export async function GetPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3, command, {
    expiresIn,
    signableHeaders: new Set(["host", "content-type"]),
  });
}

/** Fetch an object from the private bucket */
export async function GetObject(key: string) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return s3.send(command);
}

/** Delete an object from the bucket */
export async function DeleteObject(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return s3.send(command);
}

export { bucket };
