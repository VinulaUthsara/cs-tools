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

import { fileURLToPath, URL } from "node:url";
import { defineConfig, mergeConfig } from "vite";
import { configDefaults, defineConfig as defineVitestConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const viteConfig = defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@api": fileURLToPath(new URL("./src/api", import.meta.url)),
      "@config": fileURLToPath(new URL("./src/config", import.meta.url)),
      "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
      "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
      "@hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
      "@layouts": fileURLToPath(new URL("./src/layouts", import.meta.url)),
    },
  },
  envPrefix: ["SPL_APP_"],
  server: {
    // Distinct from csm-portal's 3001 so both can run side by side locally.
    port: 3002,
    strictPort: true,
  },
});

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: "jsdom",
    css: true,
    exclude: [...configDefaults.exclude],
    server: {
      deps: {
        inline: [
          "@wso2/oxygen-ui",
          "@wso2/oxygen-ui-icons-react",
          "@wso2/oxygen-ui-charts-react",
          "@asgardeo/browser",
        ],
      },
    },
  },
});

export default mergeConfig(viteConfig, vitestConfig);
