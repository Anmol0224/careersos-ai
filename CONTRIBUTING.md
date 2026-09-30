# Contributing to CareerOS AI

Thanks for your interest in CareerOS. This repo is a product prototype with a live demo at [careersos-ai.vercel.app](https://careersos-ai.vercel.app).

## Local development

1. Fork and clone the repository.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill in placeholders only (never commit real keys).
4. Run `npm run dev`. Local `/api/evaluate-challenge` is served by Vite; Vercel CLI is not required.

Do not commit `.env`, `.env.local`, or any API keys.

## Before you open a pull request

- Keep changes focused. Avoid unrelated refactors.
- Do not change readiness formulas, Gemini evaluation scoring, or auth/database contracts unless the PR is specifically about that work.
- Run `npm run lint` and `npm run build`.
- Update the README only when behavior or setup actually changes.

## Reporting issues

Please include:

- What you expected vs. what happened
- Browser and whether you used the live demo or local setup
- Steps to reproduce (no secrets)
