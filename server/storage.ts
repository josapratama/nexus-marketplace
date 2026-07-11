// Storage helpers — uploads via presigned URL to S3-compatible backend (PUT direct).
// Downloads return /app-storage/{key} paths served via 307 redirect.
// Configure with STORAGE_API_URL and STORAGE_API_KEY environment variables.

import { ENV } from "./_core/env";

function getStorageConfig() {
  const url = ENV.storageApiUrl;
  const key = ENV.storageApiKey;

  if (!url || !key) {
    throw new Error(
      "Storage config missing: set STORAGE_API_URL and STORAGE_API_KEY"
    );
  }

  return { apiUrl: url.replace(/\/+$/, ""), apiKey: key };
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const { apiUrl, apiKey } = getStorageConfig();
  const key = appendHashSuffix(normalizeKey(relKey));

  // 1. Get presigned PUT URL from storage backend
  const presignUrl = new URL("v1/storage/presign/put", apiUrl + "/");
  presignUrl.searchParams.set("path", key);

  const presignResp = await fetch(presignUrl, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!presignResp.ok) {
    const msg = await presignResp.text().catch(() => presignResp.statusText);
    throw new Error(`Storage presign failed (${presignResp.status}): ${msg}`);
  }

  const { url: s3Url } = (await presignResp.json()) as { url: string };
  if (!s3Url) throw new Error("Storage backend returned empty presign URL");

  // 2. PUT file directly to S3-compatible storage
  const blob =
    typeof data === "string"
      ? new Blob([data], { type: contentType })
      : new Blob([data as any], { type: contentType });

  const uploadResp = await fetch(s3Url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob,
  });

  if (!uploadResp.ok) {
    throw new Error(`Storage upload failed (${uploadResp.status})`);
  }

  return { key, url: `/app-storage/${key}` };
}

export async function storageGet(
  relKey: string
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  return { key, url: `/app-storage/${key}` };
}

export async function storageGetSignedUrl(relKey: string): Promise<string> {
  const { apiUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);

  const getUrl = new URL("v1/storage/presign/get", apiUrl + "/");
  getUrl.searchParams.set("path", key);

  const resp = await fetch(getUrl, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!resp.ok) {
    const msg = await resp.text().catch(() => resp.statusText);
    throw new Error(`Storage signed URL failed (${resp.status}): ${msg}`);
  }

  const { url } = (await resp.json()) as { url: string };
  return url;
}
