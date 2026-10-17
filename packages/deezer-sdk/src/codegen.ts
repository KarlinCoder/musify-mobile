import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/schema.graphql",
  documents: ["./src/queries/*.graphql"],
  generates: {
    "./src/definitions.ts": {
      plugins: ["typescript-operations", "typed-document-node"],
    },
  },
};

export default config;
