# Migration Checklist: Jekyll to Eleventy

This file tracks the progress of migrating the site from Jekyll to Eleventy.

## Phase 1: Foundation (Current)
- [x] **Environment Setup & Basic Site**
  - [x] Initialize `package.json`.
  - [x] Install `@11ty/eleventy`.
  - [x] Create minimal `.eleventy.js` config.
  - [x] Create `src/index.html` (Hello World).
  - [x] Update `README.md` with running instructions.

## Phase 2: Content Migration (Upcoming)
- [ ] **Migrate Posts**
  - [ ] Move `_posts` to `src/_posts`.
  - [ ] Configure Eleventy to process posts.
  - [ ] Verify HTML output for posts.
- [ ] **URL & Routing**
  - [ ] Configure permalinks to match Jekyll URLs.

## Phase 3: Verification & Deployment (Upcoming)
- [ ] **CI/CD**
  - [ ] Create GitHub Action for Eleventy build.
  - [ ] Verify build success on GitHub.
- [ ] **Cleanup**
  - [ ] Remove Jekyll dependencies and config.
