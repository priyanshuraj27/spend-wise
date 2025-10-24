import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        user.accessToken = accessToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req,res) => {
    const{fullName,email,username,password} = req.body;
    
    // Validation 
    if(!fullName || !email || !username || !password){
        throw new ApiError(400,"Please provide all fields")
    }

    // Checking if user already exists
    const existedUser = await User.findOne({
        $or: [{email},{username}]
    })
    if(existedUser){
        throw new ApiError(409,"User already exists")
    }

    // Create user object and enter in database
    const user = await User.create({
        fullName,
        email,
        password,
        username : username.toLowerCase(),
    })
    
    // check for User
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"User not created")
    }
    return res.status(201).json(new ApiResponse(200,"User created",createdUser))
})

const loginUser = asyncHandler(async(req,res)=>{
    const {username,email,password} = req.body;

    // validate the fields
    if(!username && !email){
        throw new ApiError(400,"Please provide username or email")
    }
    
    // search for user in db
    const user = await User.findOne({
        $or : [{username},{email}]
    })
    if(!user){
        throw new ApiError(404,"User not found")
    }

    // check for password
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid password")
    }
    
    // generate access token and refresh token
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
    // send cookie
    const options = {
        httpOnly : true,
        secure : true
    }
    return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(new ApiResponse(200,{
            user : loggedInUser,
            accessToken : accessToken,
            refreshToken : refreshToken
        },"User logged in"))
})

const logoutUser = asyncHandler(async(req,res)=>{
    // remove the refresh token from the database
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset : {
                refreshToken : 1
            }
        },
        {
            new : true
        }
    )
    const options = {
        httpOnly : true,
        secure : true
    }
    return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,undefined,"User logged out"))
})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res.status(200)
        .json(new ApiResponse(200,req.user,"Current User Fetched Successfully"))
})

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
};