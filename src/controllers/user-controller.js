import AsyncHandler from "../utils/AsyncHandler.js";
import { User as userModel } from "../models/user-model.js";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary-config.js"

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
  if (req?.files?.profilePicture && req.files.profilePicture.length > 0) {
    profilePictureLocal = req.files.profilePicture[0].path;
  } else {
    profilePictureLocal = "./public/images/defaultProfilePicture.jpg";
  }
  const profilePicture = await uploadToCloudinary(profilePictureLocal);

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

export { registerUser };
