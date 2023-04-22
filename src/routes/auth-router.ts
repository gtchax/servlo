import express from "express";
import { body } from "express-validator";
import { currentuser, signup, login, logout } from "../controllers/auth-controller";
import { validateRequest } from "../middlware/validate-request";
import { verifyUser } from "../middlware/verify-user";

const router = express.Router();

router.get("/currentuser", verifyUser, currentuser);
router.post("/logout", logout);

router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 and 20 characters"),
  ],
  validateRequest,
  signup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  login
);

export { router as authRouter };
