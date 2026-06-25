import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { authController } from "src/controllers/auth.controller";
import { authRateLimiter } from "src/middleware/rate-limiter";
import { authenticate } from "src/middleware/authenticate";
import { validate } from "src/middleware/validate";
import { registerSchema, loginSchema } from "src/schemas/auth.schemas";

const router = Router();

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL,
);

// Email/password auth
router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  authController.register,
);
router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  authController.login,
);
router.post("/refresh", authController.refresh);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.me);

// Google OAuth
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
