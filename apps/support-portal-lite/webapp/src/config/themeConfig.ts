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

// The same named-theme set one-wso2 offers (webapp/src/config/themeConfig.ts
// there) — same keys, same order, same default ("wso2") — so switching
// palettes feels like the same control in both apps. Oxygen's presets, used
// as shipped; no brand layer on top, same reasoning as one-wso2's own file.
import {
  AcrylicOrangeTheme,
  AcrylicPurpleTheme,
  ClassicTheme,
  HighContrastTheme,
  PaleGrayTheme,
  PaleIndigoTheme,
  WSO2Theme,
} from "@wso2/oxygen-ui";
import type { ThemeOption } from "@wso2/oxygen-ui";

// WSO2 is the default: Oxygen's own WSO2-branded preset, matching one-wso2's
// own default choice.
export const DEFAULT_THEME_KEY = "wso2";

export const THEME_OPTIONS: ThemeOption[] = [
  { key: "wso2", label: "WSO2", theme: WSO2Theme },
  { key: "acrylicOrange", label: "Acrylic Orange", theme: AcrylicOrangeTheme },
  { key: "acrylicPurple", label: "Acrylic Purple", theme: AcrylicPurpleTheme },
  { key: "classic", label: "Classic", theme: ClassicTheme },
  { key: "highContrast", label: "High Contrast", theme: HighContrastTheme },
  { key: "paleIndigo", label: "Pale Indigo", theme: PaleIndigoTheme },
  { key: "paleGray", label: "Pale Gray", theme: PaleGrayTheme },
];
