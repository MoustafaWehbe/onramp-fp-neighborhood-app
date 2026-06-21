// packages/api/src/routes/auth.routes.ts

import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { authController } from "src/controllers/auth.controller";
import { authRateLimiter } from "src/middleware/rate-limiter";

const router = Router();

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

router.get("/google", authRateLimiter, (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL;

  if (!clientId || !clientSecret || !callbackUrl) {
    return res.status(500).json({ error: "Google OAuth env vars missing" });
  }

  const googleClient = new OAuth2Client(clientId, clientSecret, callbackUrl);

  const url = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    prompt: "consent",
  });

  res.redirect(url);
});

router.get("/google/callback", authController.googleCallback);

export { router as authRouter };