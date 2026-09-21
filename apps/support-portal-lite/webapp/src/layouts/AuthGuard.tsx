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

import { useEffect, useRef } from "react";
import { useAsgardeo } from "@asgardeo/react";
import { Outlet } from "react-router";
import { Box, CircularProgress } from "@wso2/oxygen-ui";
import { devBypassAuth } from "@config/authConfig";

// Wraps every route. If the caller isn't signed in, starts the Asgardeo
// redirect flow; otherwise renders the routed page.
export default function AuthGuard() {
  const { isSignedIn, isLoading, signIn } = useAsgardeo();
  // Prevents a second signIn() from firing under StrictMode's double-render.
  const startedSignInRef = useRef(false);

  useEffect(() => {
    if (devBypassAuth) return; // dev-only: never redirect
    if (isLoading) return;
    if (!isSignedIn) {
      if (startedSignInRef.current) return;
      startedSignInRef.current = true;
      signIn();
      return;
    }
    startedSignInRef.current = false;
  }, [isLoading, isSignedIn, signIn]);

  if (devBypassAuth) return <Outlet />;

  if (isLoading || !isSignedIn) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <Outlet />;
}
