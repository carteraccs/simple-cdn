# Security policy

Report suspected vulnerabilities privately through GitHub's private vulnerability reporting feature if enabled. Otherwise, contact the repository owner through a verified private channel listed on their GitHub profile. Do not disclose exploit details or credentials in public issues.

Include affected versions, reproduction steps, impact, and a minimal example with sensitive data removed. Coordinate disclosure with the maintainer before publishing details.

Deployments serve content publicly. Do not add confidential files or credentials to `content/`, `public/`, manifests, or public environment variables. Only publish trusted assets, including SVG files. Keep dependencies patched and review security advisories before deployment.

Only the current maintained branch receives fixes; no response-time commitment is provided.

## Known dependency advisory

The full dependency audit currently reports one high-severity advisory in
`braces@3.0.3`, through `tailwindcss > micromatch > braces`:
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
There is no published patched version as of 2026-10-20. It can exhaust the
stack when parsing deeply nested glob patterns.

This application's Tailwind patterns are fixed in the repository configuration.
HTTP routes do not accept glob patterns or run Tailwind, and the affected
package is a development/build dependency. The advisory remains unresolved;
`bun audit` exits nonzero. Do not run builds with untrusted configuration or
expose the build tools as a public service. Reassess this finding if adding
user-controlled patterns, uploads, or build APIs.
