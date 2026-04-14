import { Timestamp } from "firebase-admin/firestore";

export type DigestCategory =
  | "new_feature"
  | "improvement"
  | "bug_fix"
  | "deprecation"
  | "breaking_change"
  | "other";

export interface ChangeLog {
  id: string;
  sourceUrl: string;
  rawContent: string;
  tagName: string;
  version: string | null;
  publishedAt: Timestamp;
  fetchedAt: Timestamp;
  contentHash: string;
  status: "pending" | "processing" | "processed" | "error";
  errorMessage: string | null;
}

export interface DigestArticle {
  id: string;
  changeLogId: string;
  title: string;
  summary: string;
  keyPoints: string[];
  categories: DigestCategory[];
  sourceUrl: string;
  originalVersion: string | null;
  publishedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "published" | "draft" | "archived";
}

/** Firestore に保存する際に id を除いた型 */
export type ChangeLogCreate = Omit<ChangeLog, "id">;
export type DigestArticleCreate = Omit<DigestArticle, "id">;
