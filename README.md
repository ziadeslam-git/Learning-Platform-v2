# Learning Platform v2

Interactive LMS-style training platform for digital transformation skills, built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Zustand.

## Overview

The app presents a structured Arabic learning path with modules, activities, assessments, media cards, progress persistence, resume learning, and statistics. Generated course content lives under `generated/content`, while extracted media lives under `generated/images`.

## Features

- Learning timeline with completed, active, and not-started states.
- Module renderer with lesson sections, objectives, lists, activities, media, summaries, and reading progress.
- Local persistence for module progress, open accordions, checklist items, assessment answers, and resume state.
- Assessment resume after refresh.
- Real grading for questions with a verified answer key from `docs/assessments/اجابة الاختبار.docx`.
- Review mode that shows selected answers, verified correct answers, and source rationale.
- Statistics page for modules, assessments, learning time, and last visit.

## Known Limitations

- The achievement test currently has 22 verified answer-key entries extracted from the original answer document. The remaining questions are intentionally marked ungraded until a source explicitly identifies their correct answers.
- Generated JSON does not preserve rich DOCX formatting such as bold answer markers; verified grading relies on the original answer DOCX source.
- External video links that do not expose a YouTube video id are shown as video cards that open the source link.

## Architecture

```text
src/
  data/                 static path and answer-key data
  features/             landing, timeline, modules, assessments, footer
  hooks/                app-level hooks for progress and assessment state
  pages/                route-level pages
  services/             content repository and persistence abstractions
  stores/               Zustand stores
  shared/               shared UI, icons, background
  styles/               global theme and utilities
  types/                content, progress, and assessment types
generated/
  content/              imported JSON documents
  images/               extracted media files
docs/
  modules/              source module documents
  assessments/          source assessment and answer documents
scripts/
  content-importer/     DOCX-to-JSON importer
```

## State And Persistence

State is managed with Zustand and persisted through service wrappers rather than direct `localStorage` calls in components.

- `src/stores/progress.store.ts`: module progress, resume state, timeline state, statistics.
- `src/stores/assessment.store.ts`: assessment attempts, current question, answers, completion state.
- `src/services/progressStorage.ts`: progress persistence.
- `src/services/assessmentStorage.ts`: assessment persistence.
- `src/services/settingsStorage.ts`: settings persistence.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open the printed local Vite URL in a browser.

## Build

```bash
npm run build
```

This runs TypeScript project build and Vite production bundling.

## Lint

```bash
npm run lint
```

The project uses Oxlint.

## Content Import

```bash
npm run import-content
```

This reads DOCX sources from `docs/` and writes generated JSON/media into `generated/`.

## Deployment

The production build is emitted to `dist/`. Deploy `dist/` to any static hosting provider that supports single-page applications. Configure fallback routing to `index.html` for client-side routes such as `/module/m1` and `/assessment/pre-test`.

## Production Checklist

- `npm run build` succeeds without errors or warnings.
- `npm run lint` succeeds.
- Main pages load: `/`, `/about`, `/stats`, `/module/m1`, `/assessment/pre-test`, `/assessment/pre-scale`.
- Refresh preserves module and assessment progress.
- Media renders or falls back to explicit missing-media states.
- No console runtime errors during primary flows.

## Future Enhancements

- Preserve DOCX answer formatting in the importer so all answer keys can be generated automatically.
- Add automated browser regression tests for progress persistence and assessment resume.
- Add a deployment-specific SPA fallback configuration for the target host.
