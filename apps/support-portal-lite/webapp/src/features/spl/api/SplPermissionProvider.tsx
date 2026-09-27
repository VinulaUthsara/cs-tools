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

import { useMemo, type ReactNode } from "react";
import { useAsgardeoGroups, hasAnyGroup } from "@hooks/useAsgardeoGroups";
import {
  splAddWorknoteGroups,
  splAddEscalationGroups,
  splDownloadAttachmentGroups,
  splUsageMetricsGroups,
} from "@config/apiConfig";
import { SplPermissionContext, type SplPermissions } from "./splPermissionsContext";

// Ported 1:1 from the source app's own Authorize.tsx PermissionContext, and
// from one-wso2's features/spl/api/useSplPermissions.tsx. Four independent
// booleans, each a group-membership check against its own configured list —
// UI guidance only, same as every group-based gate in this app:
// SupportPortalLite's Ballerina backend enforces its own copies of these
// checks server-side.
export function SplPermissionProvider({ children }: { children: ReactNode }) {
  const { groups } = useAsgardeoGroups();

  const value = useMemo<SplPermissions>(
    () => ({
      canAddWorkNotes: hasAnyGroup(groups, splAddWorknoteGroups()),
      canAddEscalations: hasAnyGroup(groups, splAddEscalationGroups()),
      canDownloadAttachments: hasAnyGroup(groups, splDownloadAttachmentGroups()),
      canViewUsageMetrics: hasAnyGroup(groups, splUsageMetricsGroups()),
    }),
    [groups],
  );

  return <SplPermissionContext.Provider value={value}>{children}</SplPermissionContext.Provider>;
}
