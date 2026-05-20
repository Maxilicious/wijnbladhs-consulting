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

### Automated Cloudflare Pages Deployment

This project is configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys the `main` branch to Cloudflare Pages on every push.

**Initial Setup Instructions:**

To enable automated deployments, you need to configure two GitHub Secrets for your repository:

1.  **`CLOUDFLARE_API_TOKEN`**:
    *   Go to your Cloudflare dashboard → My Profile → API Tokens → Create Token.
    *   Use the "Cloudflare Pages" template.
    *   Ensure permissions include: Account: read, Cloudflare Pages: edit.
    *   Copy the generated token.
    *   In your GitHub repository, go to Settings → Secrets and variables → Actions → New repository secret. Name it `CLOUDFLARE_API_TOKEN` and paste the token.

2.  **`CLOUDFLARE_ACCOUNT_ID`**:
    *   You can find your Account ID on any domain overview page in your Cloudflare dashboard (usually in the right sidebar).
    *   Add this as a repository secret named `CLOUDFLARE_ACCOUNT_ID` in GitHub.

**Environment Variables:**

This project uses Google Calendar API and booking-related configurations. Since these are needed at both build-time and runtime, they **should NOT be committed to the repository**. Instead, configure them in the Cloudflare Pages dashboard:

1.  Go to your Cloudflare dashboard → Pages → `wijnbladhs-consulting` → Settings → Environment variables.
2.  Add the following variables for both "Production" and "Preview" environments:
    *   `GOOGLE_CLIENT_ID`
    *   `GOOGLE_CLIENT_SECRET`
    *   `GOOGLE_REFRESH_TOKEN`
    *   `ADMIN_CALENDAR_EMAIL`
    *   `BOOKING_DAYS`
    *   `BOOKING_START_HOUR`
    *   `BOOKING_END_HOUR`
    *   `BOOKING_SLOT_MINUTES`
    *   `BOOKING_BUFFER_MINUTES`
    *   `BOOKING_MAX_DAYS_AHEAD`

*(Optional)* If any of these variables are required during the *build step* itself, you may also need to add them as GitHub Repository Secrets and pass them into the build job via the `env` block in `.github/workflows/deploy.yml`.

**Deployed Application:**

Once deployed, your application will be available at: `https://wijnbladhs-consulting.pages.dev` (or your custom domain if configured in Cloudflare).

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
