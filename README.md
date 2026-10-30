# ServerGrower

ServerGrower is a browser-based toolkit for independent Minecraft server owners.

## Current prototype

- **Listing Studio** — create, edit, copy and download a server listing.
- **SMP Operations** — a companion workspace for staff records, moderation cases, events, season tasks and downloadable operating templates.

## Run it

This is a static site. Open `index.html` in a browser or enable GitHub Pages for the repository. The SMP Operations workspace is available at `ops.html`.

No build step, API key, database or paid service is required.

## Data and privacy

- Listing Studio does not send form data to a backend.
- SMP Operations saves its demo workspace in the browser's local storage.
- Use **Export data** in SMP Operations to download a JSON backup.
- Browser-local data is not shared between devices or browsers. Clearing site data can remove it.
- Do not store passwords, authentication codes, private evidence or unnecessary personal information in this prototype.

## Prototype status

This is an early product prototype, not a production server-management platform. It does not connect to Minecraft servers, Discord, hosting panels or live player databases. Counts and initial records in the operations workspace are clearly marked sample data.

## Product validation

Before building integrations or charging for the product, test the workflow with owners of growing SMPs (roughly 100–500 community members). Ask them to complete real tasks using the prototype, note where they get stuck, and ask which templates they would actually pay to receive. Do not treat compliments or hypothetical interest as proof of demand.

## Planned product contents

- Staff handbook and role descriptions
- Moderation workflow and case log
- Event runbook
- Server launch checklist
- Staff application form
- Season planner

## Development

The project uses plain HTML, CSS and JavaScript so it can be maintained from GitHub's web interface and hosted as a static GitHub Pages site.
