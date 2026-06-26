import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/authenticate";
import { authRateLimiter } from "../middleware/rate-limiter";
import { registerSchema, loginSchema } from "../schemas/auth.schemas";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  authController.register
);

router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  authController.login
);

router.post("/refresh", authController.refresh);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.me);

router.get("/google", authRateLimiter, (_req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL;

  if (!clientId || !clientSecret || !callbackUrl) {
    res.status(500).json({ error: "Google OAuth env vars missing" });
    return;
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
