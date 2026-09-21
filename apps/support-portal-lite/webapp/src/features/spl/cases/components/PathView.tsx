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

// Ported from the source app's components/PathView.tsx (breadcrumb: Home >
// Account > Project > Case), via one-wso2's plain-MUI port, rebuilt on
// @wso2/oxygen-ui. One-wso2's version routes a missing account/project
// number through its own NotificationsContext ("Account not found."); this
// app has no equivalent global toast context (out of scope to add for one
// breadcrumb edge case), so that path just doesn't navigate — the button
// stays inert instead of showing an error toast.
import type { ReactNode } from "react";
import { Stack, Tooltip, Button } from "@wso2/oxygen-ui";
import { HomeIcon, ChevronRightIcon } from "@wso2/oxygen-ui-icons-react";
import { useNavigate } from "react-router";

function PathButton({
  text,
  icon,
  onClick,
  tooltip,
  active,
}: {
  text?: string;
  icon?: ReactNode;
  onClick?: () => void;
  tooltip: string;
  active?: boolean;
}) {
  return (
    <Tooltip title={tooltip}>
      <Button
        size="small"
        onClick={onClick}
        startIcon={icon}
        variant={active ? "contained" : "text"}
        sx={{ textTransform: "none" }}
      >
        {text}
      </Button>
    </Tooltip>
  );
}

export default function PathView({
  accountName,
  projectKey,
  accountNumber,
  projectNumber,
  caseKey,
}: {
  accountName?: string;
  projectKey?: string;
  accountNumber?: string;
  projectNumber?: string;
  caseKey?: string;
}) {
  const navigate = useNavigate();
  const activeButton = caseKey ? "Case" : projectKey ? "Project" : "Account";

  const handleAccountClick = () => {
    if (accountNumber) navigate(`/accounts/${accountNumber}`);
  };

  const handleProjectClick = () => {
    if (projectNumber) navigate(`/projects/${projectNumber}`);
  };

  return (
    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 2 }}>
      <PathButton icon={<HomeIcon size={16} />} onClick={() => navigate("/cases")} tooltip="Home" />
      <ChevronRightIcon size={14} style={{ opacity: 0.5 }} />
      <PathButton text={accountName} onClick={handleAccountClick} tooltip="Account" active={activeButton === "Account"} />
      {projectKey && (
        <>
          <ChevronRightIcon size={14} style={{ opacity: 0.5 }} />
          <PathButton text={projectKey} onClick={handleProjectClick} tooltip="Project" active={activeButton === "Project"} />
        </>
      )}
      {caseKey && (
        <>
          <ChevronRightIcon size={14} style={{ opacity: 0.5 }} />
          <PathButton text={caseKey} tooltip="Case" active={activeButton === "Case"} />
        </>
      )}
    </Stack>
  );
}
