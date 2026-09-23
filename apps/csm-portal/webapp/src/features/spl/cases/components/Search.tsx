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

// Ported from apps/support-portal-lite/webapp's own
// features/spl/cases/components/Search.tsx — rewritten against
// useBackendApi() (this app's existing authenticated fetch, no mock
// fallback needed since CSM_PORTAL_BACKEND_BASE_URL is always configured
// here, unlike the source app's optional SPL_APP_BACKEND_BASE_URL). Kept
// local to features/spl/cases/ (not shared across domains), same
// file-collision-avoidance precedent DefaultTable.tsx documents — the
// Accounts/Projects port needs its own copy of this, not a shared import.
import { useEffect, useState, type ChangeEvent } from "react";
import { InputAdornment, TextField } from "@wso2/oxygen-ui";
import { SearchIcon } from "@wso2/oxygen-ui-icons-react";
import { useIdTokenClaims } from "@hooks/useIdTokenClaims";
import { useBackendApi } from "@api/backend/client";
import { SearchResultBox } from "./SearchResultBox";
import type { CaseDetailsWithCount, AccountSummary, ProjectSummary } from "../api/splCaseTypes";

type SearchOptions = "account" | "myAccount" | "case" | "project";
type SearchResult = CaseDetailsWithCount | AccountSummary[] | ProjectSummary[];

export default function Search({
  searchOption,
  setShowTable,
}: {
  searchOption: SearchOptions;
  setShowTable?: (value: boolean) => void;
}) {
  const email = useIdTokenClaims()?.email;
  const api = useBackendApi();
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState<SearchResult>();

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    if (setShowTable) setShowTable(value.length < 4);
  };

  useEffect(() => {
    if (inputValue.length < 4) return;
    let endpoint = "";
    if (searchOption === "account") endpoint = `/spl/accounts?phrase=${encodeURIComponent(inputValue)}&offset=0&limit=10`;
    else if (searchOption === "myAccount")
      endpoint = `/spl/accounts?email=${encodeURIComponent(email ?? "")}&phrase=${encodeURIComponent(inputValue)}&offset=0&limit=10`;
    else if (searchOption === "case") endpoint = `/spl/cases?phrase=${encodeURIComponent(inputValue)}&offset=0&limit=10`;
    else if (searchOption === "project") endpoint = `/spl/projects?phrase=${encodeURIComponent(inputValue)}&offset=0&limit=10`;

    let cancelled = false;
    api
      .get<SearchResult>(endpoint)
      .then((result) => {
        if (!cancelled && result) setData(result);
      })
      .catch(() => {
        // Search is best-effort — a failed lookup just leaves the result list empty.
      });

    return () => {
      cancelled = true;
    };
  }, [inputValue, searchOption, email, api]);

  return (
    <div>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={
          searchOption === "case"
            ? "Search by Case Number"
            : searchOption === "account" || searchOption === "myAccount"
              ? "Search by Account Name"
              : "Search by Project Name"
        }
        value={inputValue}
        onChange={onInputChange}
        sx={{ maxWidth: 640, mx: "auto", display: "block", "& .MuiOutlinedInput-root": { borderRadius: 8 } }}
        slotProps={{ input: { endAdornment: <InputAdornment position="end"><SearchIcon size={18} /></InputAdornment> } }}
      />
      {inputValue.length >= 4 && <SearchResultBox searchDataResponse={data} type={searchOption} />}
    </div>
  );
}
