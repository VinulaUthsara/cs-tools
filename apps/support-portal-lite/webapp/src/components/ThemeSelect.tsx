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

import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  useThemeSwitcher,
} from "@wso2/oxygen-ui";
import { CheckIcon, PaletteIcon } from "@wso2/oxygen-ui-icons-react";
import { useState, type JSX } from "react";

/**
 * Picks the active named theme (palette) — one-wso2's own ThemeSelect,
 * ported verbatim for visual/UX consistency between the two apps: same icon,
 * same menu shape, same tick-on-the-selected-row pattern. Distinct from the
 * ColorSchemeToggle beside it: this chooses the palette, that chooses light
 * or dark within it. Persistence (localStorage) is handled internally by
 * OxygenUIThemeProvider's own `themes` support — no separate context needed
 * here, unlike one-wso2's bespoke ThemePreferenceProvider.
 */
export default function ThemeSelect(): JSX.Element {
  const { themes, setTheme, isActive } = useThemeSwitcher();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = anchorEl !== null;

  return (
    <>
      <Tooltip title="Change theme">
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          size="small"
          aria-label="Change theme"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <PaletteIcon size={20} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {themes.map((t) => (
          <MenuItem
            key={t.key}
            selected={isActive(t.key)}
            onClick={() => {
              setTheme(t.key);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              {isActive(t.key) ? <CheckIcon size={16} /> : null}
            </ListItemIcon>
            <ListItemText slotProps={{ primary: { variant: "body2" } }}>{t.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
