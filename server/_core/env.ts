export const ENV = {
  appId: process.env.APP_ID ?? "app",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  ownerEmail: process.env.OWNER_EMAIL ?? "",
  isProduction: process.env.NODE_ENV === "production",
  // Optional: OpenAI-compatible LLM endpoint
  llmApiUrl: process.env.LLM_API_URL ?? "",
  llmApiKey: process.env.LLM_API_KEY ?? "",
  // Optional: S3-compatible storage endpoint
  storageApiUrl: process.env.STORAGE_API_URL ?? "",
  storageApiKey: process.env.STORAGE_API_KEY ?? "",
};
