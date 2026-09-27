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

// Ported from one-wso2's features/spl/accounts/pages/SplAccountsPage.tsx.
// Routed at both all-accounts and my-accounts (see App.tsx) — which one is
// active is read from the path itself.
import { useState } from "react";
import { useLocation } from "react-router";
import SplShell from "@components/SplShell";
import { PageHeader } from "@layouts/AppLayout";
import type { ToggleSwitchState } from "../api/splAccountTypes";
import ToggleSwitch from "../components/ToggleSwitch";
import ListAccounts from "../components/ListAccounts";
import ListMyAccounts from "../components/ListMyAccounts";

function AccountsContent() {
  const [toggleSwitchState, setToggleSwitchState] = useState<ToggleSwitchState>("active-accounts");
  const location = useLocation();

  // Pure function of the URL — no /csm prefix here (unlike one-wso2), so the
  // leaf segment is the first path segment directly.
  const leaf = location.pathname.slice(1).split("/")[0];
  const isMyAccounts = leaf !== "all-accounts";

  const active = toggleSwitchState === "active-accounts";

  return (
    <>
      <PageHeader title={isMyAccounts ? "My accounts" : "All accounts"} />
      <ToggleSwitch page={toggleSwitchState} onSwitchClick={setToggleSwitchState} />
      {isMyAccounts ? <ListMyAccounts active={active} /> : <ListAccounts active={active} />}
    </>
  );
}

export default function SplAccountsPage() {
  return (
    <SplShell>
      <AccountsContent />
    </SplShell>
  );
}
