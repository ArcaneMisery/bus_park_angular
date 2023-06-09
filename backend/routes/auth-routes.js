const Router = require("express");
const router = new Router();
const AuthController = require("../controllers/auth-controller");

router.post("/sign_up", AuthController.signUpUser);
router.post("/sign_in", AuthController.signInUser);
router.get("/sign_out", AuthController.signOutUser);
router.get("/refresh", AuthController.userRefreshToken);

module.exports = router;
