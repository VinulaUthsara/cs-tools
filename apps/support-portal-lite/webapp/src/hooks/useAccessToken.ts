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

import { useCallback } from "react";
import { useAsgardeo } from "@asgardeo/react";
import { devBypassAuth } from "@config/authConfig";

/** The signed-in caller's access token, for an `Authorization: Bearer` header. */
export function useAccessToken(): () => Promise<string> {
  const { getAccessToken } = useAsgardeo();
  return useCallback(async () => {
    // AuthGuard's SPL_APP_DEV_BYPASS_AUTH skips signing in, so there is no
    // real Asgardeo session for getAccessToken() to draw from — it would
    // otherwise throw here and every data hook would fail closed with a
    // generic error, never even attempting the request.
    if (devBypassAuth) return "dev-bypass-no-real-token";
    const token = await getAccessToken();
    if (!token) throw new Error("No access_token available from Asgardeo");
    return token;
  }, [getAccessToken]);
}
