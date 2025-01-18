import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import uploadOnCloudinary from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    
    try {
        const aggregateQuery = Video.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "details",
                    pipeline: [
                        {
                            $project: {
                                fullname: 1,
                                avatar: 1,
                                username: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    details: {
                        $first: "$details",
                    },
                },
            },
        ]);

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10)
        };

        const result = await Video.aggregatePaginate(aggregateQuery, options);

        if (!result.docs.length) {
            return res.status(200).json(
                new ApiResponse(200, [], "No videos found")
            );
        }

        return res.status(200).json(
            new ApiResponse(200, result.docs, "Videos fetched successfully!")
        );

    } catch (error) {
        console.error("Error in getAllVideos:", error);
        throw new ApiError(
            500,
            "Something went wrong while fetching videos"
        );
    }
});

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    const { title, description} = req.body;

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    const videoFileLocalPath = req.files?.videoFile[0]?.path;

    if (
        [title, description, thumbnailLocalPath, videoFileLocalPath].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All field are required!");
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    const videoFile = await uploadOnCloudinary(videoFileLocalPath);

    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail link is required");
    }

    if (!videoFile) {
        throw new ApiError(400, "VideoFile link is required");
    }

    const video = await Video.create({
        videoFile: videoFile.secure_url,
        thumbnail: thumbnail.secure_url,
        title,
        description,
        duration: videoFile.duration,
        isPublished: true,
        owner: req.user?._id,
    });

    if (!video) {
        throw new ApiError(
            500,
            "Something went wrong while uploading the video."
        );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video published succesfully."));
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
  
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid VideoID.");
    }

    const responce = await Video.findById(videoId);

    if (!responce) {
        throw new ApiError(400, "Failed to get Video details.");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, responce, "Video details fetched succesfully.")
        );
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid VideoID.");
    }
    const thumbnailLocalPath = req.file?.path;

    if (!title && !description && !thumbnailLocalPath) {
        throw new ApiError(400, "At lease one field is required.");
    }

    let thumbnail;
    if (thumbnailLocalPath) {
        thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

        if (!thumbnail.secure_url) {
            throw new ApiError(
                400,
                "Error while updating thumbnail in cloudinary."
            );
        }
    }

    const responce = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail,
            },
        },
        { new: true }
    );

    if (!responce) {
        throw new ApiError(401, "Video details not found.");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, responce, "Video details updated succesfully.")
        );

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(402, "Invalid VideoID.");
    }

    const deleteResponce = await Video.deleteOne({
        _id: ObjectID(`${videoId}`),
    });

    if (!deleteResponce.acknowledged) {
        throw new ApiError(400, "Error while deteing video from db");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, deleteResponce, "Video deleted succesfully.")
        );
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(401, "Invalid VideoID");
    }

    const responce = await Video.findById(videoId);

    if (!responce) {
        throw new ApiError(401, "Video not found.");
    }

    responce.isPublished = !responce.isPublished;
    await responce.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, responce, "Published toggled succesfully."));
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
