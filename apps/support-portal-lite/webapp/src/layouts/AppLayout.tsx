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

import { Box, ColorSchemeToggle, Sidebar, Typography } from "@wso2/oxygen-ui";
import ThemeSelect from "@components/ThemeSelect";
import {
  LayersIcon,
  Building2Icon,
  FolderKanbanIcon,
  CalendarClockIcon,
  UserSearchIcon,
  HeartPulseIcon,
  BarChart3Icon,
} from "@wso2/oxygen-ui-icons-react";
import { Outlet, matchPath, useLocation, useNavigate } from "react-router";

// Flat left nav — unlike csm-portal's own AppLayout (case tabs, recent
// views, notification banners, a collapsible grouped rail), this app has one
// audience and eight top-level destinations, no nested groups and no scroll
// anchors, so the simpler Sidebar usage one-wso2's SideRail also falls back
// to for a flat list is enough here.
const NAV_ITEMS = [
  { id: "cases", label: "Cases", icon: LayersIcon, path: "/cases", matchPaths: ["/cases"] },
  {
    id: "accounts",
    label: "Accounts",
    icon: Building2Icon,
    // Navigates to the "all accounts" list — App.tsx has no bare "/accounts"
    // route (it's "all-accounts"/"my-accounts"), so this row also has to
    // match both of those, plus the account-detail routes nested under
    // "/accounts/:accountId", to stay highlighted while on any of them.
    path: "/all-accounts",
    matchPaths: ["/all-accounts", "/my-accounts", "/accounts"],
  },
  { id: "projects", label: "Projects", icon: FolderKanbanIcon, path: "/projects", matchPaths: ["/projects"] },
  {
    id: "team-schedule",
    label: "Team schedule",
    icon: CalendarClockIcon,
    path: "/team-schedule",
    matchPaths: ["/team-schedule"],
  },
  { id: "user-scan", label: "User scan", icon: UserSearchIcon, path: "/user-scan", matchPaths: ["/user-scan"] },
  {
    id: "customer-health",
    label: "Customer health",
    icon: HeartPulseIcon,
    path: "/customer-health",
    matchPaths: ["/customer-health"],
  },
  {
    id: "usage-metrics",
    label: "Usage metrics",
    icon: BarChart3Icon,
    path: "/usage-metrics",
    matchPaths: ["/usage-metrics"],
  },
] as const;

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeItem = NAV_ITEMS.find((item) =>
    item.matchPaths.some((p) => matchPath(`${p}/*`, location.pathname)),
  )?.id;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activeItem={activeItem} onSelect={(id) => {
        const item = NAV_ITEMS.find((i) => i.id === id);
        if (item) navigate(item.path);
      }}>
        <Sidebar.Nav>
          <Sidebar.Category>
            <Sidebar.CategoryLabel>Support Portal Lite</Sidebar.CategoryLabel>
            {NAV_ITEMS.map((item) => (
              <Sidebar.Item key={item.id} id={item.id}>
                <Sidebar.ItemIcon>
                  <item.icon />
                </Sidebar.ItemIcon>
                <Sidebar.ItemLabel>{item.label}</Sidebar.ItemLabel>
              </Sidebar.Item>
            ))}
          </Sidebar.Category>
        </Sidebar.Nav>
      </Sidebar>

      <Box component="main" sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 0.5, p: 1 }}>
          <ThemeSelect />
          <ColorSchemeToggle />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, px: 3, pb: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

// A page title header, shared by every SPL page so they don't each repeat it.
export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography component="h1" variant="h5" sx={{ mb: subtitle ? 0.5 : 0 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
