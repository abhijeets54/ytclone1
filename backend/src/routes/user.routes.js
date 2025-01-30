import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getChannelProfile,
    getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post(
    "/register",
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registerUser
);

router.post("/login", loginUser);

// Secured routes
router.post("/logout", verifyJWT, logoutUser);

// Removed verifyJWT for refresh-token
router.post("/refresh-token", refreshAccessToken);

router.post("/change-password", verifyJWT, changeCurrentPassword);

router.get("/current-user", verifyJWT, getCurrentUser);

router.patch("/update-account", verifyJWT, updateAccountDetails);

router.patch(
    "/avatar",
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
);

router.patch(
    "/cover-image",
    verifyJWT,
    upload.single("coverImage"),
    updateUserCoverImage
);

// Channel routes
router.get("/c/:username", getChannelProfile); // Public route for any username
router.get("/c/@me", verifyJWT, getChannelProfile); // Secured route for the current user's channel

router.get("/history", verifyJWT, getWatchHistory);

export default router;
