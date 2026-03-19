import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import {
  Injectable,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";

export type Theme = "light" | "dark" | "system";

@Injectable({ providedIn: "root" })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  private readonly _theme = signal<Theme>(this.readInitialTheme());

  readonly theme = this._theme.asReadonly();

  readonly isDark = computed(() => {
    const t = this._theme();
    if (t === "dark") return true;
    if (t === "light") return false;
    if (isPlatformBrowser(this.platformId)) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      const html = this.document.documentElement;
      const t = this._theme();
      if (t === "light") {
        html.setAttribute("data-theme", "light");
      } else if (t === "dark") {
        html.setAttribute("data-theme", "dark");
      } else {
        html.removeAttribute("data-theme");
      }
    });
  }

  toggle(): void {
    const current = this._theme();
    let next: Theme;
    if (current === "dark") {
      next = "light";
    } else if (current === "light") {
      next = "dark";
    } else {
      const prefersDark =
        isPlatformBrowser(this.platformId) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      next = prefersDark ? "light" : "dark";
    }
    this._theme.set(next);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("theme", next);
    }
  }

  private readInitialTheme(): Theme {
    if (!isPlatformBrowser(this.platformId)) return "system";
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return "system";
  }
}
