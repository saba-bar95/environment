# Copilot Instructions for Environment (React + Vite)

## Project Overview

- **Stack:** React 19, Vite, React Router v7, Sass, ESLint
- **Purpose:** Minimal, fast-reacting portal with HMR, modern routing, and strict linting.
- **Entry Point:** `src/main.jsx` mounts `App` to `#root` in `index.html`.
- **Routing:** Defined in `routes.jsx` using `react-router-dom`. Example: root (`/`) redirects to `/ge`.
- **Styling:** Use Sass (`.scss`), main styles in `src/App.scss`.

## Key Files & Structure

- `src/App.jsx`: Main app component, imports global styles.
- `src/main.jsx`: React root, strict mode enabled.
- `routes.jsx`: Route definitions, use `Navigate` for redirects.
- `vite.config.js`: Vite config, React plugin, server on port 3000.
- `vercel.json`: All routes rewrite to `index.html` for SPA support (Vercel deploy).
- `eslint.config.js`: ESLint with React, React Hooks, and Vite refresh rules. Ignores `dist`.

## Developer Workflows

- **Start dev server:** `npm run dev` (HMR enabled)
- **Build for production:** `npm run build`
- **Preview production build:** `npm run preview`
- **Lint:** `npm run lint`
- **Install dependencies:** Use `npm install <package>`

## Conventions & Patterns

- **Routing:** Use `react-router-dom` v7+ patterns. Redirects via `<Navigate />`.
- **Component Style:** Function components, import styles at the top.
- **Linting:** Unused vars starting with uppercase or `_` are ignored (see ESLint config).
- **SPA Routing:** All unknown routes handled by client (see `vercel.json`).
- **No TypeScript:** This template is JS-only, but see README for TS migration advice.

## Integration Points

- **Vercel:** SPA rewrites configured for deployment.
- **ESLint:** Uses modern plugins for React and Vite HMR.
- **Sass:** Use `.scss` for styles, imported directly in components.

## Examples

- **Redirect route:**
  ```js
  // routes.jsx
  {
    path: "/",
    element: <Navigate to="/ge" replace />,
  }
  ```
- **StrictMode root:**
  ```js
  // src/main.jsx
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  ```

## References

- See `README.md` for links to Vite/React plugin docs and TypeScript migration.
- See `eslint.config.js` for custom lint rules.
- See `vite.config.js` for dev server and plugin setup.

---

If any conventions or workflows are unclear or missing, please provide feedback for further refinement.
