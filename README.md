# Project Tracker

[![CI](https://github.com/Adit12T/Project/actions/workflows/ci.yml/badge.svg)](https://github.com/Adit12T/Project/actions/workflows/ci.yml)
[![CodeQL](https://github.com/Adit12T/Project/actions/workflows/codeql.yml/badge.svg)](https://github.com/Adit12T/Project/actions/workflows/codeql.yml)

A lightweight project planner: add projects with a category, status and due date, search and filter
them, see what is overdue, and follow a live task feed from an external API. Built with **React 19,
TypeScript and Vite**, tested with **Vitest and Testing Library**.

This was a 2018 React 16 exercise using class components, jQuery AJAX and string refs. Version 2 is
a rewrite with hooks, typed data, input validation and a resilient API client.

**Live demo:** https://adit12t.github.io/Project/

## Features

- **Projects:** title, category, status (Planned, In progress, Done) and an optional due date.
- **Validation:** titles are required, at most 80 characters, and must be unique (case-insensitive).
- **Search and filters** by text, category and status, combined.
- **Overdue highlighting** for unfinished projects past their due date.
- **Status counts** in the header, announced to screen readers when they change.
- **Undo delete**, restoring the project to its original position.
- **Saved in the browser:** saved data is checked field by field when loaded, so tampered or old data
  falls back to the samples instead of breaking the page.
- **Task feed** from JSONPlaceholder with loading and error states, an 8-second timeout, cancellation
  when the component unmounts, response validation, and a **Try again** button.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 8 tests: rules, storage, user flows and API failures
npm run build
```

## License

Copyright © 2026 Aditya Tripathi. All rights reserved. The code is published for viewing only; see
[LICENSE](LICENSE). Security reports: see [SECURITY.md](SECURITY.md).
