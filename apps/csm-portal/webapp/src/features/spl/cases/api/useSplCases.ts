// Copyright (c) 2026 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

// React Query hooks for the /spl/cases* endpoints (Go backend,
// cs-tools/apps/csm-portal/backend). Replaces the source app's own
// useSplApi.ts (useGetApi/usePostApi) — this app's CLAUDE.md mandates React
// Query as the only data-fetching layer.
//
// Query keys are plain string literals ("spl-cases", not an
// ApiQueryKeys.SPL_CASES enum member) — deliberately not extending the
// shared @constants/apiConstants enum here, since several other SPL-domain
// ports are landing concurrently and each touching that same shared file
// would collide. Consolidate into the enum in a follow-up if desired.
import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import { useBackendApi, BackendApiError } from "@api/backend/client";
import type { CaseCommentDetails, CaseDetails, CaseDetailsWithCount } from "./splCaseTypes";

export function useGetSplCases(
  stateFilter: string,
  offset: number,
  limit: number,
): UseQueryResult<CaseDetailsWithCount, Error> {
  const api = useBackendApi();
  return useQuery<CaseDetailsWithCount, Error>({
    queryKey: ["spl-cases", stateFilter, offset, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        stateFilter,
        offset: String(offset),
        limit: String(limit),
      });
      const data = await api.get<CaseDetailsWithCount>(`/spl/cases?${params.toString()}`);
      if (!data) throw new BackendApiError(404, "Not found");
      return data;
    },
  });
}

export function useGetSplCase(caseId: string): UseQueryResult<CaseDetails, Error> {
  const api = useBackendApi();
  return useQuery<CaseDetails, Error>({
    queryKey: ["spl-case", caseId],
    enabled: Boolean(caseId),
    queryFn: async () => {
      const data = await api.get<CaseDetails>(`/spl/cases/${encodeURIComponent(caseId)}`);
      if (!data) throw new BackendApiError(404, "Case not found");
      return data;
    },
  });
}

interface CaseCommentsResponse {
  total: number;
  comments: CaseCommentDetails[];
}

export function useGetSplCaseComments(
  caseId: string,
  offset: number,
  limit: number,
): UseQueryResult<CaseCommentsResponse, Error> {
  const api = useBackendApi();
  return useQuery<CaseCommentsResponse, Error>({
    queryKey: ["spl-case-comments", caseId, offset, limit],
    enabled: Boolean(caseId),
    queryFn: async () => {
      const params = new URLSearchParams({ offset: String(offset), limit: String(limit) });
      const data = await api.get<CaseCommentsResponse>(
        `/spl/cases/${encodeURIComponent(caseId)}/comments-and-worknotes?${params.toString()}`,
      );
      return data ?? { total: 0, comments: [] };
    },
  });
}

export function useGetSplCaseAttachments(caseId: string) {
  const api = useBackendApi();
  return useQuery({
    queryKey: ["spl-case-attachments", caseId],
    enabled: Boolean(caseId),
    queryFn: async () => {
      const data = await api.get(`/spl/cases/${encodeURIComponent(caseId)}/attachments-info?offset=0&limit=10`);
      return data ?? [];
    },
  });
}

/** Go backend's WorkNoteResponse — {number, updatedOn}, never read by callers here (only success/failure matters). */
interface WorkNoteResponse {
  number: string;
  updatedOn: string;
}

export function usePostSplWorkNote(caseId: string) {
  const api = useBackendApi();
  const queryClient = useQueryClient();
  return useMutation<WorkNoteResponse, Error, string>({
    mutationFn: (worknote: string) =>
      api.post<{ worknote: string }, WorkNoteResponse>(`/spl/cases/${encodeURIComponent(caseId)}/worknote`, {
        worknote,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["spl-case-comments", caseId] });
    },
  });
}
