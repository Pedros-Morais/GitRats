# GitRats MVP Plan - "The Gym for your Git"

## Overview
GitRats is a gamified GitHub activity tracker. Think "Strava" or "GymRats" but for developers.
**Core Concept:** Turn coding contributions into "workouts", XP, and social competition.

## Current Status
- **Architecture:** Monorepo (Turborepo) with Next.js (Web) and NestJS (API).
- **Functionality:** Basic shell with mocked data service. No real database or Auth.

## MVP Requirements

### 1. Infrastructure & Data Layer
- [ ] **Database Setup**:
  - Add `packages/database` (Prisma + PostgreSQL).
  - Schema:
    - `User` (id, githubId, username, accessToken, level, xp, streak).
    - `ActivityLog` (date, count, type).
    - `Achievement` (badges unlocked).

### 2. Authentication (Real Auth)
- [ ] **GitHub OAuth**:
  - Replace mock auth with real GitHub OAuth.
  - Scope required: `read:user`, `user:email`, `read:org` (optional for org stats).
  - Sync user profile (avatar, bio) on login.

### 3. The "Gym" Engine (Gamification)
Instead of just showing stats, we interpret them as fitness metrics.
- [ ] **XP System**:
  - Commit: 10 XP
  - PR Merged: 50 XP
  - Code Review: 30 XP
  - Issue Closed: 20 XP
- [ ] **Levels**:
  - "Script Kiddie" (Lvl 1) -> "Senior Dev" (Lvl 50) -> "10x Engineer" (Lvl 100).
- [ ] **Streaks**:
  - Daily coding streaks (similar to Snap streaks or Duolingo).
  - "Rest Days": logic to allow 1 missed day if streak > 30.

### 4. Core Features
- [ ] **Dashboard (The "Gym Floor")**:
  - **Daily Workout**: Did you code today? (Yes/No + Intensity).
  - **Heatmap Visualization**: A customized, "brighter" or 3D version of the GitHub graph.
  - **Recent Activity Feed**: Parsed listing of recent commits/PRs.
- [ ] **Leaderboards**:
  - Global Leaderboard (Weekly/Monthly XP).
  - "Friends" Leaderboard (Need a simple follow system for this).

### 5. UI/UX (Aesthetics)
- Dark mode default (Cyberpunk/Neon or Clean Gym aesthetic).
- Animations for leveling up or completing a "daily workout" (commit).

## Technical Roadmap

### Phase 1: Foundation (Days 1-2)
1. [x] Initialize `packages/database`.
2. Implement `AuthModule` (Strategy + Guards) in API.
3. Connect Web interactions to real API endpoints.

### Phase 2: Data Ingestion (Days 3-4)
1. Implement `GithubSyncService` using Octokit/GraphQL.
2. Create background job (or on-demand sync) to pull latest commits.
3. Calculate XP and update User stats.

### Phase 3: UI & Polish (Days 5-7)
1. Build "Player Card" component.
2. Build Leaderboard page.
3. Add "Level Up" animations.
