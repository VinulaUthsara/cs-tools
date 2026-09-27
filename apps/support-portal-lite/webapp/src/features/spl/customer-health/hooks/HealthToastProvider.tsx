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

import { useCallback, useState, type ReactNode } from "react";
import { Alert, Snackbar } from "@wso2/oxygen-ui";
import { HealthToastContext } from "./healthToastContext";

interface ToastState {
  message: string;
  severity: "success" | "error";
}

export function HealthToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showSuccess = useCallback((message: string) => setToast({ message, severity: "success" }), []);
  const showError = useCallback((message: string) => setToast({ message, severity: "error" }), []);
  const handleClose = useCallback(() => setToast(null), []);

  return (
    <HealthToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      <Snackbar
        open={toast !== null}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {toast ? (
          <Alert severity={toast.severity} onClose={handleClose} sx={{ width: "100%" }}>
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </HealthToastContext.Provider>
  );
}
