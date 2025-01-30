import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userID) => {
    try {
        const user = await User.findById(userID);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
        
    } catch (error) {
        throw new ApiError(500, "Failed to generate access and refresh tokens");
    }
}

export const registerUser = asyncHandler(async (req, res) => {
    //get user details
    //validate user - not empty
    // check if user already exists: username and email
    //check for images, avatar
    //ipload images to cloudinary
    // create user object - create entry in db
    //remove password and  refresh token from response
    //check for user creation
    //send response


    const { username, email, password, fullName } = req.body;
    //console.log(username);   

    // check for validation errors
    if (!username ||!email ||!password ||!fullName) {
        throw new ApiError(400, "Please provide all the required fields");
    }

    const existingUser = await User.findOne({
        $or: [{ username}, { email }]
    })

    if (existingUser) {
         throw new ApiError(409, "Username or email already exists");
        }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImagePathLocalPath = req.files?.coverImage[0]?.path;
    
    let coverImagePathLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImagePathLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Please provide an avatar");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImagePathLocalPath);

    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar or cover image");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
     username: username.toLowerCase(), email, password});

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" 
    )

    if (!createdUser) {
        throw new ApiError(500, "Failed to create user");
    }

    return res.status(201).json(new ApiResponse(200, createdUser,"user created successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
    //get user details
    //validate user - not empty
    //check if user exists: username and email)
    //check for password match - check hash of the provided password against the stored hash in db (user.password)
    //access and refresh token
    //send cookie
    //send response 

    const { username, email, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "Please provide all the required fields");
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: false, // Set to false for local development
        }

    return res
    .status(200).cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, {
        user: loggedInUser, accessToken, refreshToken
    },
     "User logged in successfully"));  
     });   


export const logoutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(req.user._id,
         { $unset: { refreshToken: 1 }},
        {
            new: true,
        });

        const options = {
            httpOnly: true,
            secure: true, 
        }

        return res
       .status(200)
       .clearCookie("refreshToken", options)
       .clearCookie("accessToken", options)
         .json(new ApiResponse(200, {}, "User logged out successfully"));
})

 export const refreshAccessToken = asyncHandler(async (req, res) => {
    
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingrefreshToken) {
        throw new ApiError(401, "Please provide a refresh token");
    }

try {
        const decodedToken = jwt.verify(incomingrefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        } 
    
        if (incomingrefreshToken!== user?.refreshToken) {
            throw new ApiError(401, "Invalid refresh token");
        }
    
        const options = {
            httpOnly: true,
            secure: true, 
        }
    
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)
    
        return res
           .status(200)
           .cookie("refreshToken", newRefreshToken, options)
           .cookie("accessToken", accessToken, options)
           .json(new ApiResponse(200, {
                accessToken, newRefreshToken
            },
             "User refreshed successfully"));
} catch (error) {
    throw new ApiError(401, "Invalid refresh token");
}
     
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));

}); 

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200,req.user, "User retrieved successfully"));
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const  {fullName, email } = req.body;
    if (!fullName || !email) {
        throw new ApiError(400, "Please provide all the required fields"); 
    }

    User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: fullName,
                email: email 
            }
        },
        { new: true }
    ).select("-password")

    return res.status(200).json(new ApiResponse(200, {}, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Please provide an avatar");
    }

    //delete old avatar from cloudinary
    

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    //delete old avatar from cloudinary
    const oldAvatar = user.avatar;
    if (oldAvatar) {
        const publicId = oldAvatar.split("/").slice(-1)[0].split(".")[0];
        await cloudinary.uploader.destroy(publicId);
    }

    return res.status(200).json(new ApiResponse(200, user, {}, "Avatar updated successfully"));
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Please provide a cover image");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImage) {
        throw new ApiError(500, "Failed to upload cover image");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")

    return res.status(200).json(new ApiResponse(200, user, {}, "Cover image updated successfully"));
})
const getChannelProfile = asyncHandler(async (req, res) => {
    try {
        // Debug logs for request
        console.log("Full request params:", req.params);
        console.log("Full request query:", req.query);
        console.log("Full request path:", req.path);
        console.log("Full request method:", req.method);
        console.log("Full request URL:", req.originalUrl);
        console.log("Authentication status:", !!req.user);
        
        const { username } = req.params;
        
        // Check if username is literally 'undefined' or actually undefined
        if (!username || username === 'undefined') {
            console.log("Invalid username received:", username);
            throw new ApiError(400, "Valid username is required");
        }

        // Debug log for extracted username
        console.log("Requested username:", username);

        // Handle @me route and ensure we have a username
        let channelUsername;
        if (username === '@me') {
            console.log("@me route detected, checking authentication");
            
            if (!req.user) {
                console.log("Authentication missing for @me route");
                throw new ApiError(401, "Authentication required for @me route");
            }
            
            if (!req.user.username) {
                console.log("Authenticated user has no username");
                throw new ApiError(400, "Authenticated user does not have a username");
            }
            
            channelUsername = req.user.username;
            console.log("Using authenticated user's username:", channelUsername);
        } else {
            // Validate username format
            if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
                console.log("Invalid username format:", username);
                throw new ApiError(400, "Username can only contain letters, numbers, underscores, and hyphens");
            }
            
            channelUsername = username;
            console.log("Using provided username:", channelUsername);
        }

        // Find the user by username with case-insensitive search
        console.log("Searching for user in database with username:", channelUsername);
        
        const user = await User.findOne({ 
            username: { 
                $regex: new RegExp(`^${channelUsername}$`, 'i') 
            } 
        });

        if (!user) {
            console.log("No user found for username:", channelUsername);
            throw new ApiError(404, `Channel "${channelUsername}" not found`);
        }

        console.log("User found:", user._id);

        // Get channel statistics
        console.log("Fetching channel statistics for user:", user._id);
        
        const [subscribersCount, videosCount] = await Promise.all([
            subscription.countDocuments({ channel: user._id }),
            Video.countDocuments({ owner: user._id, isPublished: true })
        ]);

        console.log("Channel statistics:", { subscribersCount, videosCount });

        // Check if requesting user is subscribed
        let isSubscribed = false;
        if (req.user?._id) {
            console.log("Checking subscription status for authenticated user");
            
            const subscription = await subscription.findOne({
                subscriber: req.user._id,
                channel: user._id
            });
            
            isSubscribed = Boolean(subscription);
            console.log("Subscription status:", isSubscribed);
        }

        // Prepare response data
        const channelData = {
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            avatar: user.avatar,
            coverImage: user.coverImage,
            subscribersCount,
            videosCount,
            isSubscribed,
            createdAt: user.createdAt
        };

        // Add additional fields for own channel
        if (req.user?._id?.toString() === user._id.toString()) {
            console.log("Adding additional fields for own channel");
            channelData.email = user.email;
            channelData.about = user.about;
        }

        console.log("Successfully prepared channel data");

        return res.status(200).json({
            success: true,
            data: channelData
        });

    } catch (error) {
        console.error("Error in getChannelProfile:", {
            message: error.message,
            stack: error.stack,
            statusCode: error.statusCode || 500
        });
        throw error;
    }
});


  

const getWatchHistory = asyncHandler(async(req,res) => {
    const user = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup:{
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                },
                                {
                                    $addFields:{
                                        owner:{
                                            $first: "$owner"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ])
    return res.statbus(200).json(new ApiResponse(200, user[0].watchHistory, "Watch history retrieved successfully"));
})

export {changeCurrentPassword,
    getCurrentUser, updateAccountDetails, updateUserAvatar,updateUserCoverImage, getChannelProfile, getWatchHistory
};