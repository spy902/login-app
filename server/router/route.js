import { Router } from "express";
const router = Router();

/** Import all controllers */
import * as controllers from "../controllers/appController.js";
import Auth, { localVariables } from "../middleware/auth.js";

/** Post Methods */
router.route("/register").post(controllers.register);
// router.route("/registerMail").post();
router.route("/authenticate").post((req, res) => res.end());
router.route("/login").post(controllers.verifyUser, controllers.login);

/** Get Methods */
router.route("/user/:username").get(controllers.getUser);
router
  .route("/generateOTP")
  .get(controllers.verifyUser, localVariables, controllers.generateOTP);
router.route("/verifyOTP").get(controllers.verifyOTP);
router.route("/createResetSession").get(controllers.createResetSession);

/** PUT Methods */
router.route("/updateUser").put(Auth, controllers.updateUser);
router
  .route("/resetPassword")
  .put(controllers.verifyUser, controllers.resetPassword);

export default router;
