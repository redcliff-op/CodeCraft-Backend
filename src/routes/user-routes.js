import { Router } from "express";
import { registerUser, signIn, signOut } from "../controllers/user-controller.js";
import { upload } from "../middlewares/multer-upload.js";
import verifyJWT from "../middlewares/auth-middleware.js";

const router = Router()

router.route("/register").post(
  upload.fields([
    {
      name: 'profilePicture',
      maxCount: 1
    }
  ]),
  registerUser
)

router.route("/signin").post(
  signIn
)

router.route("/signout").post(
  verifyJWT,
  signOut
)

export default router