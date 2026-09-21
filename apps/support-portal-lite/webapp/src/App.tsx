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

import { Navigate, Route, Routes } from "react-router";
import AuthGuard from "@layouts/AuthGuard";
import AppLayout from "@layouts/AppLayout";
import SplCasesPage from "@features/spl/cases/pages/SplCasesPage";
import SplCaseDetailPage from "@features/spl/cases/pages/SplCaseDetailPage";
import SplAccountsPage from "@features/spl/accounts/pages/SplAccountsPage";
import SplAccountDetailPage from "@features/spl/accounts/pages/SplAccountDetailPage";
import SplProjectsPage from "@features/spl/projects/pages/SplProjectsPage";
import SplProjectDetailPage from "@features/spl/projects/pages/SplProjectDetailPage";
import SplSlaReportPage from "@features/spl/reports/pages/SplSlaReportPage";
import SplCsReportPage from "@features/spl/reports/pages/SplCsReportPage";
import SplTimelogsReportPage from "@features/spl/reports/pages/SplTimelogsReportPage";
import SplTeamSchedulePage from "@features/spl/schedule/pages/SplTeamSchedulePage";
import SplUserScanPage from "@features/spl/user-scan/pages/SplUserScanPage";
import SplCustomerHealthDashboardPage from "@features/spl/customer-health/pages/SplCustomerHealthDashboardPage";
import SplCustomerHealthDetailPage from "@features/spl/customer-health/pages/SplCustomerHealthDetailPage";
import SplUsageMetricsPage from "@features/spl/usage-metrics/pages/SplUsageMetricsPage";

// Route leaves reused verbatim from the source app's own AppRoutes.tsx (minus
// its /support prefix) — see digiops-cs/apps/support-portal-lite/webapp and
// one-wso2's docs/ported-apps/spl.md, which this app mirrors functionally.
// No "cases" -> "support-cases" rename here: unlike one-wso2, this app has no
// sibling CSM route to collide with — it IS the whole app.
export default function App() {
  return (
    <Routes>
      <Route element={<AuthGuard />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/cases" replace />} />
          <Route path="cases" element={<SplCasesPage />} />
          <Route path="cases/:caseId" element={<SplCaseDetailPage />} />
          <Route path="all-accounts" element={<SplAccountsPage />} />
          <Route path="my-accounts" element={<SplAccountsPage />} />
          <Route path="accounts/:accountId" element={<SplAccountDetailPage />} />
          <Route
            path="accounts/:accountId/projects/:projectId"
            element={<SplProjectDetailPage />}
          />
          <Route path="projects" element={<SplProjectsPage />} />
          <Route path="projects/:projectId" element={<SplProjectDetailPage />} />
          <Route path="projects/:projectId/sla-report/:sysId" element={<SplSlaReportPage />} />
          <Route path="projects/:projectId/cs-report/:sysId" element={<SplCsReportPage />} />
          <Route
            path="projects/:projectId/timelogs-report"
            element={<SplTimelogsReportPage />}
          />
          <Route path="team-schedule" element={<SplTeamSchedulePage />} />
          <Route path="team-schedule/:sysId" element={<SplTeamSchedulePage />} />
          <Route path="user-scan" element={<SplUserScanPage />} />
          <Route path="customer-health" element={<SplCustomerHealthDashboardPage />} />
          <Route
            path="customer-health/account/:accountId"
            element={<SplCustomerHealthDetailPage />}
          />
          <Route path="usage-metrics" element={<SplUsageMetricsPage />} />
          <Route path="*" element={<Navigate to="/cases" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
