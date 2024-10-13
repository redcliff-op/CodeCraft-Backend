import AsyncHandler from "../utils/AsyncHandler.js";
import { User as userModel } from "../models/user-model.js";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary-config.js"
import { cookieConfig, defaultProfilePictureUri } from "../utils/Constants.js";

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await userModel.findById(userId).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save().catch((error) => {
    throw new ApiError(500, "Failed to add refresh token");
  });
  return { accessToken, refreshToken };
};

const registerUser = AsyncHandler(async (req, res) => {
  const { name, username, password, mail } = req.body;

  if ([name, username, password, mail].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await userModel.findOne({
    $or: [
      { mail: mail },
      { username: username }
    ]
  });

  if (user) {
    throw new ApiError(409, "User is already registered");
  }

  let profilePictureLocal;
  let profilePicture;
  if (req?.files?.profilePicture && req.files.profilePicture.length > 0) {
    profilePictureLocal = req.files.profilePicture[0].path;
    profilePicture = await uploadToCloudinary(profilePictureLocal);
  } else {
    profilePicture = defaultProfilePictureUri
  }

  const createdUser = await userModel.create({
    name, username, password, mail, profilePicture
  });

  const existingUser = await userModel.findById(createdUser._id).select("-password");

  if (!existingUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  res.status(200).json(
    new ApiResponse(201, "User registered successfully", existingUser)
  );
});

const signIn = AsyncHandler(async (req, res) => {
  const { username, mail, password } = req.body
  if (!username && !mail) {
    throw new ApiError(400, "SignIn Error username or email required")
  }

  const user = await userModel.findOne({
    $or: [
      { username },
      { mail }
    ]
  })

  if (!user) {
    throw new ApiError(404, "user does not exist")
  }

  const passwordVerified = await user.checkPassword(password)

  if (!passwordVerified) {
    throw new ApiError(401, "Failed to sign in due to invalid credentials")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await userModel.findById(user._id).select("-password -refreshToken")

  res.status(200)
    .cookie("accessToken", accessToken, cookieConfig)
    .cookie("refreshToken", refreshToken, cookieConfig)
    .json(
      new ApiResponse(201, "Sign in complete", { user: loggedInUser, accessToken, refreshToken })
    )
})

const signOut = AsyncHandler(async (req, res) => {
  await userModel.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        refreshToken: null
      }
    },
    { new: true }
  ).catch((error)=>{
    throw new ApiError(500,error?.message)
  })

  res.status(200)
    .clearCookie("accessToken", cookieConfig)
    .clearCookie("refreshToken", cookieConfig)
    .json(
      new ApiResponse(200, "sign out complete", {})
    )
})

export { registerUser, signIn, signOut };
