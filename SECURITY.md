# Security policy

## Reporting a vulnerability

Please report security problems privately, not in a public issue.

- Preferred: open the **Security** tab of this repository and choose **Report a vulnerability**.
- Otherwise: send me a message at https://www.linkedin.com/in/aditya12t.

Include what you found, how to reproduce it, and the impact you expect. I aim to reply within 7 days.

## Scope

This is a portfolio project: a browser-only app with no server, no accounts and no secrets. It stores
its data only in the visitor's own browser. It reads public sample tasks from jsonplaceholder.typicode.com.

## How this repository is protected

- Code scanning (CodeQL) on every push, every pull request and weekly.
- Dependabot checks dependencies and GitHub Actions for updates.
- Secret scanning with push protection blocks committed credentials.
- Workflows run with read-only repository permissions.
