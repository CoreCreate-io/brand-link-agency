import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "9emdbysj",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});