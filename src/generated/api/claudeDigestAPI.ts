/**
 * Claude Digest API クライアント
 * openapi.yaml から手動マッピング（orval 生成の代替）
 * ⚠️ openapi.yaml を変更した場合はこのファイルも更新すること
 */

import axios, { type AxiosRequestConfig } from "axios";
import {
  useQuery,
  type UseQueryOptions,
  type QueryKey,
} from "@tanstack/react-query";
import type {
  ListDigestsResponse,
  ListDigestsParams,
  DigestArticleDetail,
  HealthResponse,
  ScrapeStatusResponse,
} from "./model";

export type { DigestCategory, DigestArticleSummary, DigestArticleDetail, ListDigestsResponse, ListDigestsParams, HealthResponse, ScrapeStatusResponse, ErrorResponse } from "./model";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001/claude-digest/asia-northeast1/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// --- API 関数（Server Component から直接呼び出し可能） ---

export const getHealth = async (
  config?: AxiosRequestConfig
): Promise<HealthResponse> => {
  const { data } = await apiClient.get<HealthResponse>("/health", config);
  return data;
};

export const listDigests = async (
  params?: ListDigestsParams,
  config?: AxiosRequestConfig
): Promise<ListDigestsResponse> => {
  const { data } = await apiClient.get<ListDigestsResponse>("/digests", {
    ...config,
    params,
  });
  return data;
};

export const getDigestById = async (
  id: string,
  config?: AxiosRequestConfig
): Promise<DigestArticleDetail> => {
  const { data } = await apiClient.get<DigestArticleDetail>(
    `/digests/${id}`,
    config
  );
  return data;
};

export const getScrapeStatus = async (
  config?: AxiosRequestConfig
): Promise<ScrapeStatusResponse> => {
  const { data } = await apiClient.get<ScrapeStatusResponse>(
    "/status",
    config
  );
  return data;
};

// --- TanStack Query Hooks（Client Component から使用） ---

export const getListDigestsQueryKey = (params?: ListDigestsParams): QueryKey => [
  "digests",
  "list",
  ...(params ? [params] : []),
];

export const useListDigests = (
  params?: ListDigestsParams,
  options?: Partial<UseQueryOptions<ListDigestsResponse>>
) => {
  return useQuery<ListDigestsResponse>({
    queryKey: getListDigestsQueryKey(params),
    queryFn: () => listDigests(params),
    ...options,
  });
};

export const getGetDigestByIdQueryKey = (id: string): QueryKey => [
  "digests",
  "detail",
  id,
];

export const useGetDigestById = (
  id: string,
  options?: Partial<UseQueryOptions<DigestArticleDetail>>
) => {
  return useQuery<DigestArticleDetail>({
    queryKey: getGetDigestByIdQueryKey(id),
    queryFn: () => getDigestById(id),
    enabled: !!id,
    ...options,
  });
};

export const getGetScrapeStatusQueryKey = (): QueryKey => ["status"];

export const useGetScrapeStatus = (
  options?: Partial<UseQueryOptions<ScrapeStatusResponse>>
) => {
  return useQuery<ScrapeStatusResponse>({
    queryKey: getGetScrapeStatusQueryKey(),
    queryFn: () => getScrapeStatus(),
    ...options,
  });
};

export const getGetHealthQueryKey = (): QueryKey => ["health"];

export const useGetHealth = (
  options?: Partial<UseQueryOptions<HealthResponse>>
) => {
  return useQuery<HealthResponse>({
    queryKey: getGetHealthQueryKey(),
    queryFn: () => getHealth(),
    ...options,
  });
};
