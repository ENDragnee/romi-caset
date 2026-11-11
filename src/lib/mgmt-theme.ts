// Theme preference for the management area. "system" follows the OS setting.
// The first paint is handled by the inline script in theme-init.astro (same
// key and rules), so there is no flash before this module loads.

export type ThemePref = "light" | "dark" | "system";

const KEY = "kaset-theme";
const media = () => window.matchMedia("(prefers-color-scheme: dark)");

export function getThemePref(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "light" || v === "dark") return v;
  } catch {}
  return "system";
}

export function resolvedTheme(pref = getThemePref()): "light" | "dark" {
  if (pref !== "system") return pref;
  return media().matches ? "dark" : "light";
}

export function setThemePref(pref: ThemePref) {
  try {
    if (pref === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {}
  applyTheme();
}

export function applyTheme() {
  const theme = resolvedTheme();
  document.documentElement.setAttribute("data-theme", theme);
  document.dispatchEvent(
    new CustomEvent("mgmt-theme-change", {
      detail: { pref: getThemePref(), theme },
    }),
  );
}

// Keep "system" in step with the OS while the page is open.
let watching = false;
export function watchSystemTheme() {
  if (watching) return;
  watching = true;
  media().addEventListener("change", () => {
    if (getThemePref() === "system") applyTheme();
  });
}
