import { defineConfig } from "orval";

export default defineConfig({
  claudeDigest: {
    input: {
      target: "./openapi.yaml",
    },
    output: {
      mode: "tags-split",
      target: "./src/generated/api/claudeDigestAPI.ts",
      schemas: "./src/generated/api/model",
      client: "react-query",
      httpClient: "axios",
      override: {
        mutator: undefined,
        query: {
          useQuery: true,
          useSuspenseQuery: false,
        },
      },
    },
  },
});
