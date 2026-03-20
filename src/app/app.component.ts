import { Component, inject, signal } from "@angular/core";
import { RouterModule, RouterOutlet, RouterLinkActive } from "@angular/router";
import { environment } from "../environments/environment";
import { ThemeService } from "./services/theme.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterModule, RouterLinkActive],
  template: `
    <nav class="noprint">
      <div class="nav-inner">
        <a class="nav-brand" routerLink="/">
          <span class="course-code">{{ courseCode }}</span>
          <span class="course-sep">·</span>
          <span class="course-semester">{{ semester }}</span>
        </a>

        <ul class="nav-links desktop-links">
          @for (item of navItems; track item.path) {
            <li>
              @if (item.path.startsWith("http")) {
                <a class="nav-link" href="{{ item.path }}" target="_blank">{{
                  item.name
                }}</a>
              } @else {
                <a
                  class="nav-link"
                  [routerLink]="item.path"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
                  >{{ item.name }}</a
                >
              }
            </li>
          }
        </ul>

        <button
          class="theme-toggle"
          (click)="themeService.toggle()"
          [attr.aria-label]="
            themeService.isDark()
              ? 'Switch to light mode'
              : 'Switch to dark mode'
          "
          [title]="
            themeService.isDark()
              ? 'Switch to light mode'
              : 'Switch to dark mode'
          "
        >
          @if (themeService.isDark()) {
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          } @else {
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          }
        </button>

        <button
          class="burger"
          (click)="menuOpen.set(!menuOpen())"
          [attr.aria-expanded]="menuOpen()"
        >
          <span class="burger-line" [class.open]="menuOpen()"></span>
          <span class="burger-line" [class.open]="menuOpen()"></span>
          <span class="burger-line" [class.open]="menuOpen()"></span>
        </button>
      </div>

      <div class="mobile-menu" [class.open]="menuOpen()">
        <ul class="nav-links">
          @for (item of navItems; track item.path) {
            <li>
              @if (item.path.startsWith("http")) {
                <a
                  class="nav-link"
                  href="{{ item.path }}"
                  target="_blank"
                  (click)="menuOpen.set(false)"
                  >{{ item.name }}</a
                >
              } @else {
                <a
                  class="nav-link"
                  [routerLink]="item.path"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
                  (click)="menuOpen.set(false)"
                  >{{ item.name }}</a
                >
              }
            </li>
          }
        </ul>
      </div>
    </nav>

    <main>
      <router-outlet />
    </main>

    <footer class="noprint">
      <p>
        © 2026 Cho Yin Yong &mdash; Made with
        <a href="https://analogjs.org" target="_blank">Analog</a> &mdash;
        Deployed with
        <a href="https://cite-met.com" target="_blank">cite-met.com</a>
      </p>
    </footer>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      nav {
        position: sticky;
        top: 0;
        z-index: 100;
        background: var(--bg);
        border-bottom: 1px solid var(--border);
      }

      .nav-inner {
        max-width: 860px;
        margin: 0 auto;
        padding: 0 1.5rem;
        height: var(--nav-height);
        display: flex;
        align-items: center;
        gap: 2rem;
      }

      .nav-brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        flex-shrink: 0;
      }

      .course-code {
        font-family: var(--mono);
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--accent);
        letter-spacing: 0.02em;
      }

      .course-sep {
        color: var(--border);
        font-size: 1.1rem;
      }

      .course-semester {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-weight: 400;
      }

      .nav-links {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin-left: auto;
      }

      .nav-link {
        display: block;
        padding: 0.35rem 0.7rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-muted);
        text-decoration: none;
        border-radius: var(--radius);
        transition:
          color 0.15s,
          background 0.15s;
      }

      .nav-link:hover {
        color: var(--text);
        background: var(--surface-hover);
        text-decoration: none;
      }

      .nav-link.active {
        color: var(--text);
        background: var(--surface);
      }

      .theme-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: transparent;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        color: var(--text-muted);
        cursor: pointer;
        flex-shrink: 0;
        transition:
          color 0.15s,
          background 0.15s,
          border-color 0.15s;
      }

      .theme-toggle:hover {
        color: var(--text);
        background: var(--surface-hover);
        border-color: var(--text-muted);
      }

      .theme-toggle:focus {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }

      .burger {
        display: none;
        flex-direction: column;
        gap: 5px;
        background: transparent;
        cursor: pointer;
        padding: 8px;
        border-radius: var(--radius);
        border: none;
      }

      .burger:focus {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }

      .burger-line {
        display: block;
        width: 20px;
        height: 2px;
        background: var(--text-muted);
        border-radius: 1px;
        transition: background 0.15s;
      }

      .burger:hover .burger-line {
        background: var(--text);
      }

      .mobile-menu {
        display: none;
        background: var(--surface);
        padding: 0.75rem 1.5rem 1rem;
      }

      .mobile-menu.open {
        display: block;
      }

      .mobile-menu .nav-links {
        flex-direction: column;
        align-items: flex-start;
        margin-left: 0;
        gap: 0.1rem;
      }

      .mobile-menu .nav-links li {
        width: 100%;
      }

      .mobile-menu .nav-link {
        padding: 0.5rem 0.75rem;
        font-size: 0.925rem;
        width: 100%;
      }

      main {
        flex: 1;
      }

      footer {
        padding: 1.25rem 1.5rem;
        border-top: 1px solid var(--border);
        text-align: center;
      }

      footer p {
        margin: 0;
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      footer a {
        color: var(--text-muted);
      }

      footer a:hover {
        color: var(--accent);
      }

      @media (max-width: 767px) {
        .desktop-links {
          display: none;
        }

        .theme-toggle {
          margin-left: auto;
        }

        .burger {
          display: flex;
        }
      }
    `,
  ],
})
export class AppComponent {
  readonly themeService = inject(ThemeService);
  menuOpen = signal(false);

  navItems = [
    { name: "Home", path: "/", exact: true },
    { name: "Schedule", path: "/lectures" },
    { name: "Coursework", path: "/work" },
    { name: "Resources", path: "/resources" },
    { name: "Team", path: "/team" },
    { name: "Feedback", path: "https://forms.gle/mpBh4MbNygwrAapr5" },
  ];

  courseCode = environment.courseCode;
  semester = environment.semester;
}
