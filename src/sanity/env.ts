export const apiVersion =
  process.env.SANITY_API_VERSION || '2023-01-01'; // Default to a valid API version

export const dataset = assertValue(
  process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: SANITY_DATASET'
);

export const projectId = assertValue(
  process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: SANITY_PROJECT_ID'
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}