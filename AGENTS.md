# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router entry points. `app/page.tsx` holds the UI and CSV conversion logic, `app/layout.tsx` defines the root layout, and `app/globals.css` contains global styles.
- `public/`: Static assets served as-is.
- Root configs: `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, and `eslint.config.mjs`.

## Build, Test, and Development Commands
- `npm install`: Install dependencies.
- `npm run dev`: Start the local dev server with Turbopack at `http://localhost:3000`.
- `npm run build`: Create a production build.
- `npm run start`: Run the production build locally.
- `npm run lint`: Run ESLint with the Next.js config.

## Coding Style & Naming Conventions
- Language: TypeScript + React (Next.js App Router).
- Indentation: 2 spaces; formatting favors single quotes and no semicolons (match existing files).
- Naming: React components in PascalCase, hooks/vars in camelCase; keep file names lowercase in `app/` per Next.js conventions.
- Styling: Tailwind CSS utility classes; keep global CSS changes in `app/globals.css`.

## Testing Guidelines
- No automated test framework is configured yet.
- Validate changes by running `npm run dev` and manually exercising the CSV upload/preview/download flow.
- If adding tests, document the framework and add a `test` script in `package.json`.

## Commit & Pull Request Guidelines
- Commit messages follow a Conventional Commits style seen in history, e.g. `feat: ...`, `fix: ...`.
- PRs should include: a short summary, testing notes (commands run), and screenshots or GIFs for UI changes.
- Link related issues when applicable.

## Data & Localization Notes
- CSV input is expected from the ETC service and read as Shift-JIS; keep encoding handling intact when modifying file parsing.
