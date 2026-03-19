import {
  ContentFile,
  MarkdownComponent,
  injectContent,
} from "@analogjs/content";
import { Component, inject } from "@angular/core";
import { LectureAttributes } from "../interfaces/file-attributes";
import { AsyncPipe } from "@angular/common";
import { Meta, Title } from "@angular/platform-browser";
import { getMeta } from "../meta/route-meta";
import { SafePipe } from "../pipes/safe.pipe";
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  imports: [MarkdownComponent, AsyncPipe, SafePipe, RouterLink],
  styles: [
    `
      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        font-size: 0.8125rem;
        color: var(--text-muted);
        text-decoration: none;
        margin-bottom: 1.75rem;
        transition: color 0.15s;
      }

      .back-link:hover {
        color: var(--accent);
        text-decoration: none;
      }

      .back-arrow {
        font-size: 1rem;
        line-height: 1;
      }

      .lecture-header {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--border);
      }

      .week-tag {
        display: inline-block;
        font-family: var(--mono);
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-muted);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 4px;
        padding: 0.2rem 0.6rem;
        margin-bottom: 0.75rem;
      }

      .lecture-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .lecture-description {
        color: var(--text-muted);
        font-size: 0.9375rem;
        margin: 0;
      }

      .slides-link {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        margin: 1.5rem 0 1rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--accent);
        text-decoration: none;
        padding: 0.4rem 0.875rem;
        border: 1px solid var(--accent);
        border-radius: var(--radius);
        transition: background 0.15s;
      }

      .slides-link:hover {
        background: var(--accent-dim);
        text-decoration: none;
      }

      .slides-embed {
        margin: 1rem 0 2rem;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        overflow: hidden;
      }

      .slides-embed iframe {
        display: block;
        width: 100%;
      }
    `,
  ],
  template: `
    <div class="container">
      @if (lecture) {
        <a routerLink="/lectures" class="back-link">
          <span class="back-arrow">←</span> Schedule
        </a>

        <div class="lecture-header">
          <div class="week-tag">Week {{ lecture.attributes.week }}</div>
          <h1 class="lecture-title">{{ lecture.attributes.title }}</h1>
          @if (lecture.attributes.description) {
            <p class="lecture-description">
              {{ lecture.attributes.description }}
            </p>
          }
        </div>

        @if (lecture.attributes.googleSlidesUrl) {
          <a
            [href]="lecture.attributes.googleSlidesUrl"
            target="_blank"
            class="slides-link"
          >
            ↗ Open slides
          </a>
          <div class="slides-embed">
            <iframe
              [src]="lecture.attributes.googleSlidesUrl + 'embed' | safe"
              frameborder="0"
              width="100%"
              height="480"
              allowfullscreen="true"
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
            ></iframe>
          </div>
        }

        <analog-markdown [content]="lecture.content"></analog-markdown>
      }
    </div>
  `,
  providers: [Meta],
})
export default class LectureComponent {
  meta = inject(Meta);
  title = inject(Title);
  lecture: ContentFile<LectureAttributes | Record<string, never>> | undefined =
    undefined;

  constructor() {
    injectContent<LectureAttributes>({
      param: "lectureId",
      subdirectory: "lectures",
    }).subscribe((lecture) => {
      this.setLecture(lecture as ContentFile<LectureAttributes>);
    });
  }

  setLecture(lecture: ContentFile<LectureAttributes>) {
    this.lecture = lecture;
    this.title.setTitle(
      `Week ${lecture.attributes.week}: ${lecture.attributes.title}`,
    );
    const meta = getMeta({
      title: `Week ${lecture.attributes.week}: ${lecture.attributes.title}`,
      description: lecture.attributes.description,
    });
    meta.forEach((tag) => this.meta.updateTag(tag));
  }
}
