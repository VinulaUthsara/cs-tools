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

// React Query hooks for the /spl/accounts* Go backend routes — replaces
// apps/support-portal-lite/webapp's useGetApi/usePostApi (useSplApi.ts)
// with this app's useBackendApi()/React Query convention (see
// useGetCsmCases.ts for the shape this mirrors). Same backend calls, same
// /spl path prefix, just through this app's own auth-aware client instead
// of a separate one.
import { useQuery, useMutation, type UseQueryResult } from "@tanstack/react-query";
import { useBackendApi } from "@api/backend/client";
import type {
  AccountDetails,
  ABTTeamMembersDetails,
  EscalationDetails,
} from "./splAccountTypes";

export function useSearchAccounts(params: {
  email?: string;
  phrase?: string;
  offset: number;
  limit: number;
  active: boolean;
  enabled?: boolean;
}): UseQueryResult<AccountDetails[], Error> {
  const api = useBackendApi();
  const { email, phrase, offset, limit, active, enabled = true } = params;

  return useQuery<AccountDetails[], Error>({
    queryKey: ["spl-accounts", email ?? "", phrase ?? "", offset, limit, active],
    queryFn: () => {
      const qs = new URLSearchParams({ offset: String(offset), limit: String(limit), active: String(active) });
      if (email) qs.set("email", email);
      if (phrase) qs.set("phrase", phrase);
      return api.get<AccountDetails[]>(`/spl/accounts?${qs.toString()}`).then((r) => r ?? []);
    },
    enabled,
  });
}

export function useGetAccount(id: string): UseQueryResult<AccountDetails | null, Error> {
  const api = useBackendApi();
  return useQuery<AccountDetails | null, Error>({
    queryKey: ["spl-account", id],
    queryFn: () => api.get<AccountDetails>(`/spl/accounts/${encodeURIComponent(id)}`),
    enabled: Boolean(id),
  });
}

export function useGetAccountProjects(
  accountId: string,
  offset: number,
  limit: number,
): UseQueryResult<import("./splAccountTypes").ProjectDetails[], Error> {
  const api = useBackendApi();
  return useQuery({
    queryKey: ["spl-account-projects", accountId, offset, limit],
    queryFn: () =>
      api
        .get<import("./splAccountTypes").ProjectDetails[]>(
          `/spl/accounts/${encodeURIComponent(accountId)}/projects?offset=${offset}&limit=${limit}`,
        )
        .then((r) => r ?? []),
    enabled: Boolean(accountId),
  });
}

export function useGetAccountEscalations(
  accountId: string,
  offset: number,
  limit: number,
): UseQueryResult<EscalationDetails[], Error> {
  const api = useBackendApi();
  return useQuery<EscalationDetails[], Error>({
    queryKey: ["spl-account-escalations", accountId, offset, limit],
    queryFn: () =>
      api
        .get<EscalationDetails[]>(
          `/spl/accounts/${encodeURIComponent(accountId)}/escalations?offset=${offset}&limit=${limit}`,
        )
        .then((r) => r ?? []),
    enabled: Boolean(accountId),
  });
}

export interface EscalateCaseRequest {
  justification: string;
  requestSource: string;
  reason: string;
  severity: string;
}

/** POST /spl/accounts/{accountId}/cases/{caseId}/escalate. */
export function useEscalateCase(accountId: string, caseId: string) {
  const api = useBackendApi();
  return useMutation<unknown, Error, EscalateCaseRequest>({
    mutationFn: (body) =>
      api.post(
        `/spl/accounts/${encodeURIComponent(accountId)}/cases/${encodeURIComponent(caseId)}/escalate`,
        body,
      ),
  });
}

export function useGetAbtTeamMembers(teamId: string): UseQueryResult<ABTTeamMembersDetails[], Error> {
  const api = useBackendApi();
  return useQuery<ABTTeamMembersDetails[], Error>({
    queryKey: ["spl-abt-team-members", teamId],
    queryFn: () =>
      api
        .get<ABTTeamMembersDetails[]>(`/spl/abt-team-members?teamId=${encodeURIComponent(teamId)}`)
        .then((r) => r ?? []),
    enabled: Boolean(teamId),
  });
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

/** GET /spl/files?folderId=... (Google Drive folder listing). */
export function useGetDriveFiles(folderId: string): UseQueryResult<DriveFile[], Error> {
  const api = useBackendApi();
  return useQuery<DriveFile[], Error>({
    queryKey: ["spl-drive-files", folderId],
    queryFn: () =>
      api.get<DriveFile[]>(`/spl/files?folderId=${encodeURIComponent(folderId)}`).then((r) => r ?? []),
    enabled: Boolean(folderId),
  });
}
