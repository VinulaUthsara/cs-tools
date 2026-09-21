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

import { useQuery } from "@tanstack/react-query";
import { useAsgardeo } from "@asgardeo/react";

// The signed-in user's Asgardeo group memberships, read from the `groups`
// claim of the id_token. The `groups` scope is already requested at sign-in
// (see authConfig), so the claim is present without an extra round trip.
//
// This is how the CS-vs-Sales/SA audience gate works (see useSplTeamGate) —
// this backend has no `/me` endpoint that returns the caller's team, so the
// decision has to be made from the token itself, same technique one-wso2's
// useCsmTeamGate uses.
//
// Presentation only, in the strict sense: it decides whether this app shows
// itself or redirects away. The backend behind it still re-derives its own
// authorization from the JWT for every write action (see splAddWorknoteGroups
// and friends) — a tampered token doesn't grant anything here either.

export interface AsgardeoGroups {
  /** False until the token has been decoded — hold gated UI until it clears. */
  ready: boolean;
  /** Group names, or an empty array when the claim is absent. */
  groups: string[];
  /** Set when the decode itself failed, so callers can offer a retry. */
  error?: string;
  retry: () => void;
}

// Asgardeo emits `groups` as an array, but a user in exactly ONE group can
// come back as a bare string from some IS configurations. Normalising both
// shapes here means no caller has to know that.
function normalizeGroups(claim: unknown): string[] {
  if (Array.isArray(claim)) return claim.filter((g): g is string => typeof g === "string");
  if (typeof claim === "string" && claim.trim()) return [claim];
  return [];
}

export function useAsgardeoGroups(): AsgardeoGroups {
  const { isSignedIn, getDecodedIdToken } = useAsgardeo();

  const query = useQuery<string[]>({
    queryKey: ["asgardeo-groups"],
    enabled: isSignedIn,
    queryFn: async () => {
      const token = (await getDecodedIdToken()) as { groups?: unknown } | null;
      return normalizeGroups(token?.groups);
    },
    // The claim is fixed for the life of the token, so this only ever re-runs
    // after a token refresh replaces it.
    staleTime: 5 * 60 * 1000,
    // A decode either works or doesn't; retrying parses the same string again.
    retry: false,
  });

  const retry = () => void query.refetch();

  if (query.isError) {
    return {
      ready: true,
      groups: [],
      error: "Couldn't read your group memberships from your session.",
      retry,
    };
  }

  if (query.isPending) return { ready: false, groups: [], retry };

  return { ready: true, groups: query.data, retry };
}

/** True when `groups` contains any of `required`. Empty `required` → false. */
export function hasAnyGroup(groups: readonly string[], required: readonly string[]): boolean {
  return required.some((r) => Boolean(r) && groups.includes(r));
}
