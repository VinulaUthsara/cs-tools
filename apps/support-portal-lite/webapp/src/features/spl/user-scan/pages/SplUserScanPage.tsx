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

// Ported from one-wso2's features/spl/user-scan/pages/SplUserScanPage.tsx
// (itself ported from the source app's src/components/UserScanning.tsx),
// restyled onto @wso2/oxygen-ui. Same source-specific swaps one-wso2 made:
// useAuthContext().httpRequest -> useSplHttpRequest, copy-to-clipboard
// package -> navigator.clipboard.
import { useState, type ChangeEvent } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@wso2/oxygen-ui";
import { CheckCircleIcon, XCircleIcon, CopyIcon } from "@wso2/oxygen-ui-icons-react";
import SplShell from "@components/SplShell";
import { splBackendUrl } from "@config/apiConfig";
import { useSplHttpRequest } from "@features/spl/api/useSplApi";
import { PageHeader } from "@layouts/AppLayout";

interface ScanSystemResultInfo {
  issue: string;
  solution: string;
  documentation: string;
  invitationUrl: string | null;
}

interface ScanSystemResult {
  state: boolean;
  label: string;
  information: ScanSystemResultInfo | null;
}

interface ScanResponseItem {
  system: string;
  systemResult: ScanSystemResult[];
}

function copyToClipboard(value: string) {
  void navigator.clipboard.writeText(value);
}

function SplUserScanContent() {
  const httpRequest = useSplHttpRequest();

  const [email, setEmail] = useState("");
  const [projectKey, setProjectKey] = useState("");
  const [isPartner, setIsPartner] = useState(false);
  const [responseData, setResponseData] = useState<ScanResponseItem[]>([]);
  const [showLoading, setShowLoading] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isProjectKeyError, setIsProjectKeyError] = useState(false);

  const userScanAPI = async () => {
    if (email === "") {
      setIsEmailError(true);
      setResponseData([]);
    } else if (projectKey === "") {
      setIsProjectKeyError(true);
      setResponseData([]);
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setIsEmailError(true);
      setResponseData([]);
    } else {
      setIsEmailError(false);
      setIsProjectKeyError(false);
      setShowLoading(true);
      try {
        const result = await httpRequest<ScanResponseItem[]>({
          url: `${splBackendUrl}/scan-user`,
          method: "POST",
          headers: { accept: "application/json" },
          data: { email, subscriptionKey: projectKey, isPartner: false },
        });
        setResponseData(result);
      } catch {
        setResponseData([]);
      } finally {
        setShowLoading(false);
      }
    }
  };

  const handleEmailFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setIsEmailError(false);
    setIsPageLoading(true);
  };

  const handleProjectFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProjectKey(event.target.value);
    setIsProjectKeyError(false);
    setIsPageLoading(true);
  };

  return (
    <Box>
      <PageHeader title="User scan" />
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          User Scan
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
          <TextField
            id="email"
            size="small"
            label="Email"
            variant="outlined"
            required
            helperText="Please provide a valid Email"
            onChange={handleEmailFieldChange}
            color="primary"
          />
          <TextField
            id="projectKey"
            size="small"
            required
            label="Subscription Key"
            variant="outlined"
            helperText="Please provide a valid subscription key"
            onChange={handleProjectFieldChange}
          />
          <FormControlLabel
            control={<Checkbox checked={isPartner} onChange={() => setIsPartner(!isPartner)} />}
            label="Is Partner"
          />
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => void userScanAPI()}
            disabled={!isPageLoading || isEmailError || isProjectKeyError}
          >
            Analyze
          </Button>
        </Stack>
        {isEmailError && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Please provide valid Email address
          </Typography>
        )}
        {isProjectKeyError && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Please provide valid subscription key
          </Typography>
        )}
      </Paper>

      {showLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {responseData.map((responseObject, idx) => (
        <Paper key={idx} variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>{responseObject.system}</Typography>
          {responseObject.systemResult?.map((systemResult, resultIdx) => (
            <Box key={resultIdx} sx={{ mb: 1.5 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                {systemResult.state ? (
                  <CheckCircleIcon size={18} color="var(--mui-palette-success-main, #2e7d32)" />
                ) : (
                  <XCircleIcon size={18} color="var(--mui-palette-error-main, #d32f2f)" />
                )}
                <Typography variant="body2">{systemResult.label}</Typography>
              </Stack>
              {!systemResult.state && systemResult.information && (
                <Box component="table" sx={{ mt: 1, ml: 3.5 }}>
                  <Box component="tr">
                    <Box component="td" sx={{ pr: 2, verticalAlign: "top" }}>
                      <strong>Issue</strong>
                    </Box>
                    <Box component="td">{systemResult.information.issue}</Box>
                  </Box>
                  <Box component="tr">
                    <Box component="td" sx={{ pr: 2, verticalAlign: "top" }}>
                      <strong>Solution</strong>
                    </Box>
                    <Box component="td">
                      {systemResult.information.solution}{" "}
                      <a href={systemResult.information.documentation} target="_blank" rel="noreferrer">
                        (instructions)
                      </a>
                    </Box>
                  </Box>
                  {systemResult.information.invitationUrl && (
                    <Box component="tr">
                      <Box component="td" sx={{ pr: 2, verticalAlign: "top" }}>
                        <strong>Invitation</strong>
                      </Box>
                      <Box component="td">
                        You can copy the invitation link and share it with the user&nbsp;
                        <strong>directly without CC-ing anyone or group.</strong>&nbsp; It is
                        confidential. To copy, click the icon.&nbsp;
                        <Tooltip title="Copy here">
                          <Box
                            component="span"
                            sx={{ cursor: "pointer", verticalAlign: "middle", display: "inline-flex" }}
                            onClick={() => copyToClipboard(systemResult.information!.invitationUrl!)}
                          >
                            <CopyIcon size={16} />
                          </Box>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          ))}
        </Paper>
      ))}
    </Box>
  );
}

export default function SplUserScanPage() {
  return (
    <SplShell>
      <SplUserScanContent />
    </SplShell>
  );
}
