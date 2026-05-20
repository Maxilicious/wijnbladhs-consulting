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

## 📅 Booking Scheduler Setup

To enable the custom meeting booking scheduler with Google Calendar integration, you need to configure the following:

### 1. Google Cloud Setup
1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Google Calendar API** for your project.
3. Configure the **OAuth consent screen** (Internal or External).
4. Create **OAuth 2.0 Client IDs** (Web application type). Add authorized redirect URIs if needed (e.g., `http://localhost:4321/api/auth/callback` for local development).
5. Copy your **Client ID** and **Client Secret**.

### 2. Generate Refresh Token
1. Run your application locally.
2. Navigate to `/api/auth/login`. You will be redirected to the Google consent screen.
3. After authorizing, you will be redirected to `/api/auth/callback`.
4. The page will display your `refresh_token` as plain text. Save this securely; you only need to do this once.

### 3. Environment Variables
Add the following environment variables to your Cloudflare Pages dashboard (and `.env` for local development):

- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID.
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret.
- `GOOGLE_REFRESH_TOKEN`: The refresh token obtained from step 2.
- `ADMIN_CALENDAR_EMAIL`: The primary email address of the calendar you want to manage.
- `BOOKING_DAYS`: Comma-separated list of working days (e.g., `1,2,3,4,5` for Mon-Fri). Defaults to `1,2,3,4,5`.
- `BOOKING_START_HOUR`: Start of working hours (0-23). Defaults to `9`.
- `BOOKING_END_HOUR`: End of working hours (0-23). Defaults to `17`.
- `BOOKING_SLOT_MINUTES`: Duration of each meeting slot in minutes. Defaults to `30`.
- `BOOKING_BUFFER_MINUTES`: Buffer time between meetings in minutes. Defaults to `0`.
- `BOOKING_MAX_DAYS_AHEAD`: How far in advance meetings can be booked. Defaults to `30`.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
