# EVE Tool

Two small, independent projects:

- **`server/`** — a plain Express + TypeScript server (~90 lines,
  one file) that does the one thing your browser can't do safely:
  hold your EVE SSO client secret and exchange it for an access
  token. It also proxies one example ESI endpoint (character skills).
- **`client/`** — a Vite + React + TypeScript app. This is yours to
  build. It currently just checks "am I logged in?" and shows a
  welcome message.

No Next.js, no session library, no UI framework — just React,
TypeScript, and enough backend to keep OAuth working.

## Setup

**Prerequisite:** Node.js 20.6 or newer (for `--env-file` support).

1. **Register an EVE SSO app**
   https://developers.eveonline.com/applications — set the callback
   URL to `http://localhost:4000/callback`. Copy the Client ID and
   Secret Key.

2. **Server**

   ```bash
   cd server
   npm install
   cp .env.example .env
   # paste your Client ID and Secret Key into .env
   npm run dev
   ```

   This starts the server on http://localhost:4000.

3. **Client** (in a new terminal)

   ```bash
   cd client
   npm install
   npm run dev
   ```

   This starts the React app on http://localhost:5173.

4. Open http://localhost:5173, click "Log in with EVE Online",
   authorize, and you'll land back on the app logged in.

## How the pieces talk to each other

```
React app (localhost:5173)
   │  click "Log in" → plain <a> link, not fetch
   ▼
server /login  (localhost:4000)  → redirects to login.eveonline.com
   │  you authorize on EVE's site
   ▼
server /callback  → trades the code for tokens, remembers them
   │                 in memory, redirects back to localhost:5173
   ▼
React app loads → calls server /me → shows your character name

Later, to show real data:
React component → fetch("localhost:4000/api/skills")
   → server attaches your access token → calls ESI → returns JSON
```

The browser never sees your access token or client secret directly
— it only ever talks to your own server.

## What the server does NOT do (on purpose)

This is intentionally minimal so you can learn by adding to it:

- **No token refresh.** Access tokens expire in ~20 minutes. Right
  now you'll just have to log in again when that happens. Adding
  refresh logic (there's a `refreshToken` variable already sitting
  unused in `server/index.ts`) is a good first exercise.
- **No CSRF `state` check** on the OAuth flow — fine for local
  learning, not fine for anything public-facing.
- **No real session/database** — just variables in memory, so one
  login at a time and it resets when the server restarts.

## Where to go next

1. **Read `server/index.ts` top to bottom** — it's short and every
   block is commented. This is the whole OAuth story.
2. **Read `client/src/App.tsx`** — this is where `useState`,
   `useEffect`, and TypeScript's `type` keyword are introduced with
   comments explaining each one.
3. **Copy `client/src/components/SkillList.tsx`** as your template
   for showing real data — it's not wired into the app yet, that's
   your call on where it goes.
4. **Add a new ESI endpoint**: pick something from ESI's docs
   (https://esi.evetech.net/ui/), add a route to `server/index.ts`
   following the `/api/skills` pattern, then fetch it from a new
   React component.
