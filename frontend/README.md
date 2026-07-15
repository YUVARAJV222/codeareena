# CodeArena Frontend

React (Vite) client.

## Run
```bash
npm install
npm run dev
```
Opens at http://localhost:5173 — proxies `/api/*` to `http://localhost:8080`.

## Google Sign-In
Copy `.env.example` to `.env` and set `VITE_GOOGLE_CLIENT_ID` to your Google
OAuth 2.0 Web Client ID (create one in Google Cloud Console → APIs & Services
→ Credentials). The same client ID must also be set as `google.client.id` /
`GOOGLE_CLIENT_ID` on the backend.

## Pages
| Route              | Description                                  |
|--------------------|-----------------------------------------------|
| `/login`           | Login form                                    |
| `/register`        | Registration form                             |
| `/dashboard`       | Stats + recent submissions                    |
| `/problems`        | Problem list with difficulty filter           |
| `/problems/:id`    | Problem detail + code editor + submit         |
| `/leaderboard`     | Ranked leaderboard                            |

## Structure
```
src/
├── pages/       → Route-level pages
├── components/  → Navbar, ProtectedRoute
├── context/     → AuthContext (JWT + user state)
├── api/         → Axios client with auth interceptor
└── index.css    → Global dark theme styling
```

Auth token is stored in `localStorage` and attached automatically to every
API request by the Axios interceptor in `src/api/api.js`.
