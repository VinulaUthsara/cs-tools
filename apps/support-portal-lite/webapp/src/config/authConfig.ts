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

// Extend window interface to include our runtime config, injected by
// public/config.js before the bundle loads — same pattern as csm-portal's
// own authConfig.ts.
declare global {
  interface Window {
    config: {
      SPL_APP_AUTH_BASE_URL: string;
      SPL_APP_AUTH_CLIENT_ID: string;
      SPL_APP_AUTH_SIGN_IN_REDIRECT_URL: string;
      SPL_APP_AUTH_SIGN_OUT_REDIRECT_URL: string;
      // Base URL for the SupportPortalLite backend (digiops-cs/apps/
      // support-portal-lite). Optional — when absent, every screen falls
      // back to mock data (see api/splMockApi.ts).
      SPL_APP_BACKEND_BASE_URL?: string;
      // Where a Customer Success caller gets sent — this app is Sales/
      // Solutions Architecture only, see useSplTeamGate.
      SPL_APP_CSM_PORTAL_URL: string;
      // Asgardeo group names distinguishing the two audiences: a caller in
      // SPL_APP_CS_TEAM_GROUPS is redirected to SPL_APP_CSM_PORTAL_URL above;
      // a caller in SPL_APP_SALES_TEAM_GROUPS sees this app. Neither backend
      // can tell the two apart on its own — see useSplTeamGate.
      SPL_APP_CS_TEAM_GROUPS?: string[];
      SPL_APP_SALES_TEAM_GROUPS?: string[];
      // Fine-grained SupportPortalLite permission groups, ported verbatim
      // from the source app's own group-list config. Independent of the
      // audience gate above: these gate what a Sales/SA caller may DO once
      // they're in (add a work note, escalate, download an attachment, view
      // usage metrics), not whether they see the app at all.
      SPL_APP_ADD_WORKNOTE_GROUPS?: string[];
      SPL_APP_ADD_ESCALATION_GROUPS?: string[];
      SPL_APP_DOWNLOAD_ATTACHMENT_GROUPS?: string[];
      SPL_APP_USAGE_METRICS_GROUPS?: string[];
    };
  }
}

interface AuthConfig {
  baseUrl: string;
  clientId: string;
  signInRedirectURL: string;
  signOutRedirectURL: string;
  scopes: string[];
}

function getAuthConfig(): AuthConfig {
  const config = window.config;
  const baseUrl = config?.SPL_APP_AUTH_BASE_URL;
  const clientId = config?.SPL_APP_AUTH_CLIENT_ID;
  const signInRedirectURL = config?.SPL_APP_AUTH_SIGN_IN_REDIRECT_URL;
  const signOutRedirectURL = config?.SPL_APP_AUTH_SIGN_OUT_REDIRECT_URL;

  const missingVars: string[] = [];
  if (!baseUrl) missingVars.push("SPL_APP_AUTH_BASE_URL");
  if (!clientId) missingVars.push("SPL_APP_AUTH_CLIENT_ID");
  if (!signInRedirectURL) missingVars.push("SPL_APP_AUTH_SIGN_IN_REDIRECT_URL");
  if (!signOutRedirectURL) missingVars.push("SPL_APP_AUTH_SIGN_OUT_REDIRECT_URL");

  if (missingVars.length > 0) {
    throw new Error(
      `Auth Config Error: Missing required configuration: ${missingVars.join(", ")}. Populate public/config.js from public/config.js.example.`,
    );
  }

  return {
    baseUrl,
    clientId,
    signInRedirectURL,
    signOutRedirectURL,
    // groups is required to read the CS-vs-Sales/SA audience claim — see
    // useSplTeamGate.
    scopes: ["openid", "email", "groups", "profile"],
  };
}

export const authConfig = getAuthConfig();
