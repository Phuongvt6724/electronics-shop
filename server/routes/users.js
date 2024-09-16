const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authenticateToken } = require("../middleware/middleware");
const UserService = require("../services/UserService");

router.get("/", (req, res) => UserController.getAllUsers(req, res));

router.get("/:id", (req, res) => UserController.getOneUser(req, res));

router.get("/user/accesstoken", [authenticateToken], async (req, res) => {
  try {
    const user = await UserService.getOneUser(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/:token", (req, res) =>
  UserController.getUserByToken(req, res)
);

router.post("/register", (req, res) => UserController.createUser(req, res));

router.post("/login", (req, res) => UserController.login(req, res));

router.post("/loginGoogle", (req, res) => UserController.loginGoogle(req, res));

router.post("/loginFacebook", (req, res) =>
  UserController.loginFacebook(req, res)
);

router.post("/refreshToken", (req, res) =>
  UserController.refreshToken(req, res)
);

router.post("/sendContact", (req, res) => UserController.sendContact(req, res));

router.post("/forgotpassword", (req, res) =>
  UserController.forgotPassword(req, res)
);

router.put("/:id", (req, res) => UserController.updateUser(req, res));

router.put("/resetPasswordPut/:id", (req, res) =>
  UserController.resetPasswordPut(req, res)
);

router.put("/changePasswordPut/:id", (req, res) =>
  UserController.changePassword(req, res)
);

router.put("/updatephone/:id", (req, res) =>
  UserController.updatePhone(req, res)
);

router.delete("/:id", (req, res) => UserController.deleteUser(req, res));

module.exports = router;
