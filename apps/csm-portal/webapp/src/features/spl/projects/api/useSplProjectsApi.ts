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

// React Query hooks for the /spl/projects* Go backend routes — see
// ../../accounts/api/useSplAccountsApi.ts for the pattern this mirrors.
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useBackendApi } from "@api/backend/client";
import type { ProjectDetails, Contact, CaseDetails } from "../projectTypes";

export function useSearchProjects(params: {
  phrase?: string;
  offset: number;
  limit: number;
  enabled?: boolean;
}): UseQueryResult<ProjectDetails[], Error> {
  const api = useBackendApi();
  const { phrase, offset, limit, enabled = true } = params;

  return useQuery<ProjectDetails[], Error>({
    queryKey: ["spl-projects", phrase ?? "", offset, limit],
    queryFn: () => {
      const qs = new URLSearchParams({ offset: String(offset), limit: String(limit) });
      if (phrase) qs.set("phrase", phrase);
      return api.get<ProjectDetails[]>(`/spl/projects?${qs.toString()}`).then((r) => r ?? []);
    },
    enabled,
  });
}

export function useGetProject(id: string): UseQueryResult<ProjectDetails | null, Error> {
  const api = useBackendApi();
  return useQuery<ProjectDetails | null, Error>({
    queryKey: ["spl-project", id],
    queryFn: () => api.get<ProjectDetails>(`/spl/projects/${encodeURIComponent(id)}`),
    enabled: Boolean(id),
  });
}

export function useGetProjectContacts(
  projectId: string,
  offset: number,
  limit: number,
): UseQueryResult<Contact[], Error> {
  const api = useBackendApi();
  return useQuery<Contact[], Error>({
    queryKey: ["spl-project-contacts", projectId, offset, limit],
    queryFn: () =>
      api
        .get<Contact[]>(`/spl/projects/${encodeURIComponent(projectId)}/contacts?offset=${offset}&limit=${limit}`)
        .then((r) => r ?? []),
    enabled: Boolean(projectId),
  });
}

export function useGetProjectCases(params: {
  projectId: string;
  offset: number;
  limit: number;
  stateFilters: string[];
  caseTypeFilters: string[];
}): UseQueryResult<CaseDetails[], Error> {
  const api = useBackendApi();
  const { projectId, offset, limit, stateFilters, caseTypeFilters } = params;

  return useQuery<CaseDetails[], Error>({
    queryKey: ["spl-project-cases", projectId, offset, limit, stateFilters, caseTypeFilters],
    queryFn: () => {
      // Matches this domain's own established, verified-safe convention
      // (see ProjectCasesTable.tsx's FLAG comment carried over from the
      // frontend-reconciliation pass): comma-joined, not per-value
      // URL-encoded — the Go handler's splitNonEmpty explicitly supports
      // this shape, and none of the hardcoded filter values contain a
      // URL-structural character.
      const qs = `offset=${offset}&limit=${limit}&stateFilters=${stateFilters}&caseTypeFilters=${caseTypeFilters}`;
      return api
        .get<CaseDetails[]>(`/spl/projects/${encodeURIComponent(projectId)}/cases?${qs}`)
        .then((r) => r ?? []);
    },
    enabled: Boolean(projectId),
  });
}
