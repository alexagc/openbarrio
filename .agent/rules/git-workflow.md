# Git & Workflow Rules

## 1. Branching Strategy
* `main`: Always production-ready, clean, and tested.
* Feature branches: `feat/<name>`, `fix/<name>`, `docs/<name>`, `chore/<name>`.

## 2. Commit Standards
Follow **Conventional Commits**:
* `feat:` A new feature or provider implementation.
* `fix:` A bug fix.
* `docs:` Documentation updates only.
* `test:` Adding or refactoring tests.
* `chore:` Build scripts, configurations, or dependency maintenance.
* Commit messages must always be in **English**.

## 3. Pull Requests & Merging
* All merges to `main` must use **Squash & Merge**.
* CI pipeline must be green before merging.
