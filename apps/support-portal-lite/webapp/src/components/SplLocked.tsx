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

import { Box, Button, Card, Typography } from "@wso2/oxygen-ui";
import { LockIcon } from "@wso2/oxygen-ui-icons-react";
import { csmPortalUrl } from "@config/apiConfig";

// Shown when useSplTeamGate resolves someone to neither Sales/SA nor
// Customer Success (a CS caller is redirected away entirely — see
// useSplTeamGate — so this is only ever "not recognised for either portal").
export default function SplLocked() {
  const csmUrl = csmPortalUrl();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Card variant="outlined" sx={{ p: 3, maxWidth: 480 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.75 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: 1.5,
              display: "grid",
              placeItems: "center",
              bgcolor: "background.default",
              border: 1,
              borderColor: "divider",
              color: "text.secondary",
            }}
            aria-hidden="true"
          >
            <LockIcon size={19} />
          </Box>
          <Box>
            <Typography component="h2" sx={{ fontSize: 17, fontWeight: 600, mb: 0.6 }}>
              You don't have access yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "52ch" }}>
              Support Portal Lite is for Sales / Solutions Architecture staff. Ask an
              admin to add you to the right Asgardeo group, then reload this page.
            </Typography>
          </Box>
        </Box>

        {csmUrl && (
          <>
            <Box sx={{ height: "1px", bgcolor: "divider", my: 2.25 }} />
            <Button component="a" href={csmUrl} variant="outlined" sx={{ textTransform: "none" }}>
              Go to CSM Portal
            </Button>
          </>
        )}
      </Card>
    </Box>
  );
}
