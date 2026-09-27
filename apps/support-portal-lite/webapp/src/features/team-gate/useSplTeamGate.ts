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

import { useEffect } from "react";
import { useAsgardeoGroups, hasAnyGroup } from "@hooks/useAsgardeoGroups";
import { csTeamGroups, salesTeamGroups, csmPortalUrl } from "@config/apiConfig";

// This app is the Sales/Solutions Architecture half of what one-wso2's
// useCsmTeamGate does as a single shared route: instead of switching which
// component tree renders, here the two audiences are two entirely separate
// deployables, so the "other audience" branch is a real browser redirect
// rather than a client-side swap — csm-portal is not modified to redirect
// back the other way (see the port decision this mirrors), so a Sales/SA
// caller who lands on csm-portal directly stays there; only this app acts on
// the gate.
export type SplTeam = "customerSuccess" | "salesOrSa" | "none";

export interface SplTeamGate {
  team: SplTeam;
  isResolving: boolean;
  isError: boolean;
  errorMessage?: string;
  /** True once a Customer Success caller has been redirected away. */
  isRedirecting: boolean;
  retry: () => void;
}

export function useSplTeamGate(): SplTeamGate {
  const identity = useAsgardeoGroups();

  const isCs = hasAnyGroup(identity.groups, csTeamGroups());
  const isSalesOrSa = hasAnyGroup(identity.groups, salesTeamGroups());
  const team: SplTeam = isCs ? "customerSuccess" : isSalesOrSa ? "salesOrSa" : "none";
  const isRedirecting = identity.ready && team === "customerSuccess";

  useEffect(() => {
    if (!isRedirecting) return;
    const target = csmPortalUrl();
    if (!target) return;
    window.location.href = target;
  }, [isRedirecting]);

  return {
    team,
    isResolving: !identity.ready,
    isError: Boolean(identity.error),
    errorMessage: identity.error,
    isRedirecting,
    retry: identity.retry,
  };
}
