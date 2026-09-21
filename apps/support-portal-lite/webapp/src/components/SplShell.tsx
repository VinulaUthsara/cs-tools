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

import type { ReactNode } from "react";
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@wso2/oxygen-ui";
import { isSplBackendConfigured } from "@config/apiConfig";
import { useSplTeamGate } from "@features/team-gate/useSplTeamGate";
import { SplPermissionProvider } from "@features/spl/api/SplPermissionProvider";
import SplLocked from "./SplLocked";

//   1. team gate still resolving      → spinner, never a premature denial
//   2. redirecting a CS caller away   → spinner with a message, not a flash
//      of this app's own UI before the browser navigates
//   3. team gate errored              → an error with a retry, NOT a denial
//   4. team === "none"                → SplLocked (a locked door, not a fault)
//   5. team === "salesOrSa"           → children, wrapped in
//      SplPermissionProvider so every descendant can read
//      useSplPermissions(), with a non-blocking "sample data" banner when
//      the real backend isn't configured yet
export default function SplShell({ children }: { children: ReactNode }) {
  const gate = useSplTeamGate();
  const configured = isSplBackendConfigured();

  if (gate.isResolving || gate.isRedirecting) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
          <CircularProgress size={18} />
          <Typography variant="body2" color="text.secondary">
            {gate.isRedirecting ? "Taking you to CSM Portal…" : "Checking your access…"}
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (gate.isError) {
    return (
      <Box sx={{ p: 3, maxWidth: 640 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={gate.retry}>
              Retry
            </Button>
          }
        >
          Couldn't check your access. {gate.errorMessage}
        </Alert>
      </Box>
    );
  }

  if (gate.team !== "salesOrSa") {
    return <SplLocked />;
  }

  return (
    <SplPermissionProvider>
      <Box>
        {!configured && (
          <Alert severity="info" sx={{ m: 2 }}>
            Showing sample data — <code>SPL_APP_BACKEND_BASE_URL</code> isn't set in{" "}
            <code>public/config.js</code>, so nothing here reaches a real backend yet.
          </Alert>
        )}
        {children}
      </Box>
    </SplPermissionProvider>
  );
}
