import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { User as userModel } from "../models/user-model.js";
import jwt from 'jsonwebtoken'

const verifyJWT = AsyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers['Authorization']?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized user")
    }

    const verifiedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await userModel.findById(verifiedToken._id).select("-password -refreshToken")

    if (!user) {
      throw new ApiError(404, "Invalid Token, User not found")
    }

    req.user = user;

    next()
  } catch (error) {
    throw new ApiError(400, error?.message)
  }
})

export default verifyJWT