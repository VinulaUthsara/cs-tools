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

// Stand-in for one-wso2's app-wide @context/notifications/NotificationsContext,
// which this app doesn't have — this app has no shell-level toast system yet,
// so a small local provider scoped to the accounts domain (the only domain
// that needs it: EscalateDialog, ListAccountDetail, PathView) is enough
// rather than adding a new global context outside this port's scope.
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Alert, Snackbar } from "@wso2/oxygen-ui";
import { NotificationsContext, type Notifications } from "./notificationsContext";

type Severity = "success" | "warning" | "error";

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; severity: Severity } | null>(null);

  const show = useCallback((severity: Severity, message: string) => setToast({ message, severity }), []);
  const value = useMemo<Notifications>(
    () => ({
      showSuccess: (message) => show("success", message),
      showWarning: (message) => show("warning", message),
      showError: (message) => show("error", message),
    }),
    [show],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <Snackbar
        open={toast !== null}
        autoHideDuration={5000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast?.severity ?? "success"}
          onClose={() => setToast(null)}
          sx={{ width: "100%" }}
        >
          {toast?.message ?? ""}
        </Alert>
      </Snackbar>
    </NotificationsContext.Provider>
  );
}
