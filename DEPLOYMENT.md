# Deployment

## Vercel

The current public deployment is [projects-opal-seven.vercel.app](https://projects-opal-seven.vercel.app/). The repository is configured as a static site with no build step.

1. Connect the repository to Vercel and use the repository root as the project root.
2. Select the **Other** framework preset. Leave the build command and output directory unset unless Vercel requires a value.
3. Configure `akilisoft.co.tz` in Vercel and complete the DNS setup before using it as the public canonical domain. Confirm the domain resolves and serves every route before changing canonical URLs and sitemap entries.
4. Enable Web Analytics in the Vercel project dashboard if analytics are required. The deployed pages may include Vercel's analytics script, but analytics data is unavailable until the feature is enabled.

## Contact

The Contact page provides name, email, organisation, enquiry type, subject, and message fields. Submitting validates the required fields and opens a prefilled draft to `info@akilisoft.co.tz` in the visitor's configured email application. The website does not send or store messages; visitors must press Send in their email app. A direct `mailto:` link is available if the app handoff is not configured.

## Static-site feature scope

- The Support page provides email links only; it does not create stored support tickets.
- The Client Portal page is informational. Secure sign-in, client-specific access, project tracking, and document storage need a backend and verified account provisioning.
- The Insights page contains static editorial content and has no publishing/CMS workflow.
- The Company Profile page uses the browser print dialog to save or print the profile; no downloadable PDF is currently provided.
- Full Kiswahili page translations require reviewed translation copy before publication.

## Visual assets

The site uses original, local SVG illustrations in `assets/illustrations/` and the branded social-preview image at `assets/og-image.png`. Product dashboard visuals are explicitly presented as illustrative mockups, not screenshots of deployed software. The founder's genuine photograph remains separate in `images/CEO.png`; no generated portrait is used.

## Website health checks

The GitHub Actions workflow at `.github/workflows/site-health.yml` validates local HTML links, image dimensions, and sitemap coverage on pushes and pull requests. Its scheduled/manual production check verifies all pages and key assets on the current Vercel deployment.
