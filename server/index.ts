// This whole server exists to do ONE thing your React app can't do safely:
// hold the EVE SSO "client secret" and exchange it for an access token.
// A secret can never live in frontend code — anyone could open devtools
// and steal it. So this tiny server sits between your React app and EVE.
//
// Everything else (UI, state, what to display) is your job in client/.

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();
app.use(cors()); // allows the Vite dev server (different port) to call this
app.use(express.json());

const PORT = 4000;

// --- Super simple "session": just variables in memory. ---
// This means: only one user can be logged in at a time, and logging
// out means restarting the server. That's fine for learning/local use.
// A real app would use a database or signed cookies per-user instead.
let accessToken: string | null = null;
let refreshToken: string | null = null;
let tokenExpiresAt: number | null = null;
let characterId: number | null = null;
let characterName: string | null = null;
let oauthState: string | null = null;

// TypeScript note: this is a "type" describing the shape of data
// EVE sends back after exchanging a code for tokens. Writing this out
// means TypeScript will warn you if you typo a field name below.
type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

type VerifyResponse = {
  CharacterID: number;
  CharacterName: string;
};

const ensureFreshToken = async () => {
	const now = Date.now();

	if (refreshToken && now > (tokenExpiresAt ?? 0) - 30_000) {
		const tokens = await exchangeToken(new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }));
		accessToken = tokens.access_token;
		refreshToken = tokens.refresh_token;
		tokenExpiresAt = Date.now() + tokens.expires_in * 1000;
	}
};

const exchangeToken = async (params: URLSearchParams) => {
	const basicAuth = Buffer.from(
		`${process.env.EVE_SSO_CLIENT_ID}:${process.env.EVE_SSO_SECRET_KEY}`
	).toString("base64");

	const res = await fetch("https://login.eveonline.com/v2/oauth/token", {
		method: "POST",
		headers: {
		Authorization: `Basic ${basicAuth}`,
		"Content-Type": "application/x-www-form-urlencoded",
		},
		body: params,
	});
	return res.json() as Promise<TokenResponse>;
};

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
	if (!accessToken || !characterId) {
		res.status(401).json({ error: "Not logged in" });
		return;
	}

	await ensureFreshToken();
	next();
};

const validateResponse = async (esiRes: globalThis.Response, res: Response) => {
	if (!esiRes.ok) {
		const errorBody = await esiRes.text();
		console.error(`ESI request failed: ${esiRes.status}`, errorBody);
		res.status(esiRes.status).json({ error: "ESI request failed", detail: errorBody });
		return;
	}

	const data = await esiRes.json();
	res.json(data);
};

// STEP 1: Browser hits this to start login. We redirect to EVE's login page.
app.get("/login", (req, res) => {
	oauthState = crypto.randomBytes(16).toString('hex');
	const params = new URLSearchParams({
		response_type: "code",
		redirect_uri: "http://localhost:4000/callback",
		client_id: process.env.EVE_SSO_CLIENT_ID as string,
		scope: process.env.EVE_SSO_SCOPES as string,
		state: oauthState
	});

	res.redirect(`https://login.eveonline.com/v2/oauth/authorize?${params}`);
});

// STEP 2: EVE redirects back here with a one-time "code" after the user logs in.
// We trade that code for an access token + refresh token.
app.get("/callback", async (req, res) => {
	const code = req.query.code as string;
	const stateReceived = req.query.state;

	// Update to go to some error page instead
	if (stateReceived !== oauthState) {
		res.redirect("http://localhost:5173");
		return;
	}

	const tokens = await exchangeToken(new URLSearchParams({ grant_type: "authorization_code", code }));

	// Find out WHO logged in (which character)
	const verifyRes = await fetch("https://login.eveonline.com/oauth/verify", {
		headers: { Authorization: `Bearer ${tokens.access_token}` },
	});
	const identity = (await verifyRes.json()) as VerifyResponse;

	// Save everything in our simple in-memory "session"
	accessToken = tokens.access_token;
	refreshToken = tokens.refresh_token;
	tokenExpiresAt = Date.now() + tokens.expires_in * 1000;
	characterId = identity.CharacterID;
	characterName = identity.CharacterName;
	oauthState = null;

	// Send the user back to the React app, now logged in
	res.redirect("http://localhost:5173");
});

// Lets the frontend ask "am I logged in, and as who?"
app.get("/me", (req, res) => {
  if (!accessToken) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }
  res.json({ characterId, characterName });
});

// EXAMPLE proxy route: character skills.
// This is the pattern to copy for every new ESI endpoint you want:
// take the path from ESI's docs, attach the access token, return JSON.
app.get("/api/skills", requireAuth, async (req, res) => {
	const esiRes = await fetch(
		`https://esi.evetech.net/latest/characters/${characterId}/skills/`,
		{ headers: { Authorization: `Bearer ${accessToken}` } }
	);

	await validateResponse(esiRes, res);
});

app.get("/api/portrait", requireAuth, async (req, res) => {
	const esiRes = await fetch(
		`https://esi.evetech.net/latest/characters/${characterId}/portrait`,
		{ headers: { Authorization: `Bearer ${accessToken}` } }
	);

	await validateResponse(esiRes, res);
});

app.get('/api/character_status', requireAuth, async (req, res) => {
	const esiRes = await fetch(
		`https://esi.evetech.net/latest/characters/${characterId}/online/`,
		{ headers: { Authorization: `Bearer ${accessToken}` } }
	);

	await validateResponse(esiRes, res);
});

app.get('/api/character_info', requireAuth, async (req, res) => {
	const esiRes = await fetch(
		`https://esi.evetech.net/latest/characters/${characterId}/`,
		{ headers: { Authorization: `Bearer ${accessToken}` } }
	);

	await validateResponse(esiRes, res);
});

app.post('/api/universe_names', requireAuth, async (req, res) => {
	const esiRes = await fetch(
		`https://esi.evetech.net/latest/universe/names/`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(req.body)
		}
	);

	await validateResponse(esiRes, res);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
