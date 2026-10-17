declare module "*.graphql" {
  import { DocumentNode } from "graphql";
  const value: DocumentNode;
  export default value;
}

declare module "*.webp" {
  const value: number;
  export = value;
}
