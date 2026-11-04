# Akilisoft Tech Company Limited website

The public Akilisoft company website is a static, multi-page HTML site styled with locally hosted Bootstrap 5 and custom CSS. There is no application server, database, build step, or package-manager dependency.

## Pages

- Home: company overview, capabilities, products, and FAQs
- About: company and leadership information
- Products and Services: published product and service details
- Portfolio: case studies and category filters
- Careers: current opportunities information
- Contact and Support: email-based enquiries
- Insights: static editorial content
- Client Portal: information about client access; no sign-in is implemented
- Company Profile: print-friendly company information

Product interface illustrations are conceptual artwork, not screenshots of deployed products. Email links open the visitor's email application; they do not submit or store enquiries.

## Local preview

Open `index.html` in a browser or use any static-file server. All site assets and Bootstrap files are stored in the repository.

## Quality checks

Node.js 18 or newer is required for the dependency-free local link and sitemap checker:

```powershell
node scripts/check-site.js
node --check js/main.js
node --check scripts/check-site.js
git diff --check
```

GitHub Actions runs the static checks on pushes and pull requests. A scheduled/manual check also verifies the deployed pages and assets.

## Deployment

The current Vercel deployment is [projects-opal-seven.vercel.app](https://projects-opal-seven.vercel.app/). See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment settings, contact limitations, and the custom-domain setup notes.
