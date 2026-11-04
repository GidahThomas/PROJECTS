# Deployment

## Vercel

1. Import this repository into Vercel and use the repository root as the project root.
2. Select the **Other** framework preset. This is a static HTML, CSS, and JavaScript site with no build step; leave the build command and output directory unset unless Vercel requires a value.
3. Add `akilisoft.co.tz` in the Vercel project's domain settings and apply the DNS records Vercel provides. The canonical URLs and health check already use this domain.
4. Enable Web Analytics in the Vercel project dashboard. The pages include Vercel's analytics script, but analytics data is unavailable until the feature is enabled.

## Contact

The Contact page uses email only. Its email link opens the visitor's configured mail app and makes no claim that a message has been sent before the visitor sends it.

## Static-site feature scope

- The Support page provides email links only; it does not create stored support tickets.
- The Client Portal page is informational. Secure sign-in, client-specific access, project tracking, and document storage need a backend and verified account provisioning.
- The Insights page contains static editorial content and has no publishing/CMS workflow.
- The Company Profile page uses the browser print dialog to save or print the profile; no downloadable PDF is currently provided.
- Full Kiswahili page translations require reviewed translation copy before publication.

## Visual assets

The site uses original, local SVG illustrations in `assets/illustrations/` and the branded social-preview image at `assets/og-image.png`. Product dashboard visuals are explicitly presented as illustrative mockups, not screenshots of deployed software. The founder's genuine photograph remains separate in `images/CEO.png`; no generated portrait is used.

## Website health checks

The GitHub Actions workflow at `.github/workflows/site-health.yml` checks the production pages, sitemap, robots file, and social preview image hourly. Enable GitHub Actions for the repository; the checks will only pass once `https://akilisoft.co.tz` serves those routes.
