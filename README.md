# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## ☁️ Deployment

**Note:** This project has been updated to use Astro's `output: 'hybrid'` mode along with the `@astrojs/cloudflare` adapter. It is designed to be deployed to Cloudflare Pages/Workers, rather than traditional pure static hosting.

### Auto-Deployment via GitHub Actions

This repository is configured to automatically deploy to Cloudflare Pages on every `push` to the `main` branch. The deployment workflow is defined in `.github/workflows/deploy.yml`.

### Setting up GitHub Repository Secrets

To enable the automated deployment, you must configure two secrets in your GitHub repository:

1. Navigate to **Settings** > **Secrets and variables** > **Actions** > **Repository secrets** in your GitHub repository.
2. Add the following secrets:
   - `CLOUDFLARE_ACCOUNT_ID`: Find this on the overview page of any domain in your Cloudflare dashboard.
   - `CLOUDFLARE_API_TOKEN`: Create a new API Token from your Cloudflare dashboard (`My Profile` > `API Tokens` > `Create Token`). Use the **'Cloudflare Pages'** template, ensuring it has **'Account: read'** and **'Cloudflare Pages: edit'** permissions.

### Environment Variables

The application requires several environment variables to function correctly, particularly for booking features.

**Required Runtime Variables:**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `ADMIN_CALENDAR_EMAIL`
- `BOOKING_DAYS`
- `BOOKING_START_HOUR`
- `BOOKING_END_HOUR`
- `BOOKING_SLOT_MINUTES`
- `BOOKING_BUFFER_MINUTES`
- `BOOKING_MAX_DAYS_AHEAD`

These variables **must be configured in the Cloudflare Pages dashboard** under **Settings → Environment variables** for the deployed application to function correctly at runtime.

**Build-Time Variables (Optional):**
If any variables are required during the build process (e.g., for static site generation), they can optionally be added as GitHub repository secrets and injected into the `npm run build` step in `.github/workflows/deploy.yml` via an `env:` block (e.g., `env: { GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }} }`). **Note:** Runtime variables configured in the Cloudflare Pages dashboard always take precedence over build-time variables.

### Deployed URL

The default deployed URL for this project is: [https://wijnbladhs-consulting.pages.dev](https://wijnbladhs-consulting.pages.dev) (Note: A custom domain might be configured later).

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
