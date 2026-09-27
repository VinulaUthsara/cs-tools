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

// SupportPortalLite (digiops-cs/apps/support-portal-lite) backend — a
// Ballerina BFF in front of ServiceNow, an internal Employee GraphQL
// service, a risk MySQL DB and Google Drive. Same Choreo Bearer ->
// x-jwt-assertion gateway rewrite pattern as csm-portal's own backend.
//
// Empty string = not configured; every hook in features/spl/api falls back
// to an in-memory mock (see features/spl/api/splMockApi.ts), so the app is
// usable before a real backend is wired up.
export const splBackendUrl: string = (window.config?.SPL_APP_BACKEND_BASE_URL ?? "").replace(
  /\/+$/,
  "",
);

export function isSplBackendConfigured(): boolean {
  return Boolean(splBackendUrl);
}

export const splServiceUrls = {
  accounts: `${splBackendUrl}/accounts`,
  account: (id: string) => `${splBackendUrl}/accounts/${encodeURIComponent(id)}`,
  accountProjects: (id: string) => `${splBackendUrl}/accounts/${encodeURIComponent(id)}/projects`,
  cases: `${splBackendUrl}/cases`,
  case: (id: string) => `${splBackendUrl}/cases/${encodeURIComponent(id)}`,
  projects: `${splBackendUrl}/projects`,
  project: (id: string) => `${splBackendUrl}/projects/${encodeURIComponent(id)}`,
  teamSchedule: `${splBackendUrl}/team-schedule`,
  userScan: `${splBackendUrl}/user-scan`,
  customerHealth: `${splBackendUrl}/customer-health`,
  usageMetrics: `${splBackendUrl}/usage-metrics`,
};

// ---- CS vs. Sales/Solutions Architecture audience gate ---------------------
//
// This app is Sales/Solutions Architecture only. Neither this backend nor
// csm-portal's can tell the two teams apart — SupportPortalLite's own
// authJWT/userinfo modules parse the caller's Asgardeo `groups` claim
// internally but never return it from any endpoint — so the split is made
// client-side from the id_token's `groups` claim (see useAsgardeoGroups)
// against these two configured name lists, the same technique one-wso2's
// useCsmTeamGate uses. See useSplTeamGate.
export function csTeamGroups(): string[] {
  return window.config?.SPL_APP_CS_TEAM_GROUPS ?? [];
}

export function salesTeamGroups(): string[] {
  return window.config?.SPL_APP_SALES_TEAM_GROUPS ?? [];
}

// Where a Customer Success caller is redirected — see useSplTeamGate.
export function csmPortalUrl(): string {
  return window.config?.SPL_APP_CSM_PORTAL_URL ?? "";
}

// ---- Fine-grained SupportPortalLite permissions -----------------------------
//
// Independent of the audience gate above: these gate what a Sales/SA caller
// may DO inside this app (add a work note, escalate, download an
// attachment, view usage metrics), not whether they see it. Ported verbatim
// from the source app's own Authorize.tsx.
export function splAddWorknoteGroups(): string[] {
  return window.config?.SPL_APP_ADD_WORKNOTE_GROUPS ?? [];
}

export function splAddEscalationGroups(): string[] {
  return window.config?.SPL_APP_ADD_ESCALATION_GROUPS ?? [];
}

export function splDownloadAttachmentGroups(): string[] {
  return window.config?.SPL_APP_DOWNLOAD_ATTACHMENT_GROUPS ?? [];
}

export function splUsageMetricsGroups(): string[] {
  return window.config?.SPL_APP_USAGE_METRICS_GROUPS ?? [];
}
