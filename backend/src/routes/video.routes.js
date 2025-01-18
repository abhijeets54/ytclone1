import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();

// Add debug middleware
const debugMiddleware = (req, res, next) => {
    console.log('Video Route accessed:', {
        method: req.method,
        path: req.path,
        cookies: req.cookies,
        headers: req.headers,
        user: req.user
    });
    next();
};

router.use(verifyJWT); // Apply verifyJWT middleware to all routes
router.use(debugMiddleware); // Add debug middleware after auth

router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router