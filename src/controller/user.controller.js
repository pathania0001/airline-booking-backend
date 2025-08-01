

// import jwt  from 'jsonwebtoken';
// import { ApiError, ApiResponse, asyncHandler, uploadOnCloudinary } from "../utils/index.js";
// import { User } from '../models/index.js';
// import { StatusCodes } from 'http-status-codes';

// const generateAccessAndRefreshTokens = async(userId)=>
// {
//     try {
//         const user =  await User.findById(userId)
        
//        const accessToken= await user.generateAccessToken()
//        const refreshToken= await user.generateRefreshToken()
    
//        user.refreshToken = refreshToken
//        await user.save({validateBeforeSave:false})   //for save in datatbase
      
//        return {accessToken , refreshToken}

//     } catch (error) {
//          throw new ApiError(StatusCodes.INSUFFICIENT_STORAGE,"Something went wrong while generating refresh and access token")

//     }
// }

// //asyncHandler for error chaecking in request
// //if not having any error return res.st........
// //otherwise we have handle thr promise every time


//         const registerUser= asyncHandler(async (req,res) =>{
//        //get user  details from frontend
//        //validation -not empty
//        //check if user already exists: username & email
//        //check for image ,check for avatar
//        //upload them to cloudinary ,avatar
//        //create user object - create entry in db
//        // remove password and refesh token filef frim response 
//        //check for user creation 
//        //return res


//        const {fullName,email,username,password}=req.body

      
//        if([fullName,email,username,password].some((field)=>field?.trim()===""
//        ))
//            {
//               throw new ApiError(StatusCodes.PARTIAL_CONTENT,"All fields are  required")
//               } 

//               //you can valid email by email.find(@   like that)


//               // now check for already existed user by email or by username
//        const existedUser = await User.findOne({
//              $or:[{email} , {username}] 
//              //$or:[{},{},{}...]  if any one is true existedUser is true
//         })

//         if(existedUser)
//         {
//               throw new ApiError(StatusCodes.CONFLICT, "User with email or username already existed")
//         }

//         const avatarLocalPath =req.files?.avatar[0]?.path;

//       //   const coverImageLocalPath=req.files?.coverImage[0]?.path; 
//        //the above code is fail when  coverImage is not there  
//     let coverImageLocalPath;
//     if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
//         coverImageLocalPath = req.files.coverImage[0].path
//     }
//         if(!avatarLocalPath)
//         throw new ApiError(StatusCodes.PARTIAL_CONTENT,"Avatar file is required")
       
//         const avatar = await uploadOnCloudinary(avatarLocalPath)
//         const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
//      if(!avatar)
//         throw new ApiError(StatusCodes.PARTIAL_CONTENT,"Avatar and coverImage files are required")
      
//         const user= await User.create({
                   
//                fullName,
//                avatar: avatar.url,
//                coverImage: coverImage?.url || "",
//                email,
//                password,
//                username: username.toLowerCase(),
       
//                      })
     
//        const createdUser= await User.findById(user._id).select(
//               "-password -refreshToken"
//               // (-) means no need
//        )

//        if(!createdUser)
//         throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,"Something went wrong while regstering the user")

           
//         return res.status(StatusCodes.CREATED).json(
//             new ApiResponse(StatusCodes.OK,createdUser, "User registered Successfully"))
        
    
           
//               })

//         const loginUser = asyncHandler(async (req,res)=>{
//           //req.body->data
//           //username or email
//           //find the user
//           //password check
//           //access and refresh token generation
//           //send cookie
        
//           const {email,username,password}=req.body;
           
//           if(!username && !email)
//            throw new ApiError(StatusCodes.PARTIAL_CONTENT,"username or email is required")

//         const user=await User.findOne(
//             {
//              $or:[{email},{username}]
//              // chahe jitne marzi {} hoon inmain se koi bhi ek mila toh  return krega user data else false
//             }
//          )

//          if(!user)
//          throw new ApiError(StatusCodes.NOT_FOUND,"user doesn't exist")

//          const isPasswordValid= await user.isPasswordCorrect(password)
          
//            if(!isPasswordValid)
//              throw new ApiError(StatusCodes.UNAUTHORIZED,"password is not valid")

//        const {accessToken,refreshToken}  =  await generateAccessAndRefreshTokens(user._id)

//           //user ko kya kya information bhejni hai 
         
//           const loggedInUser = await User.findOne(user._id).select("-password -refeshToken")
//            //loggenInUser contains all information of user except password and refreshToken 
           
//            const options = {
//             httpOnly:true,
//             secure:true
//         }
//             //by defualt cookies are modifiable by frontend or beckend but by above option creation for cookies make it modifiable only in backend 
//             //in frontend it is only readable 
           

//             return res.status(StatusCodes.OK)
//             .cookie("accessToken",accessToken,options)
//             .cookie("refreshToken",refreshToken,options)//cookie set kr rh ehain bhejne se pehle 
//             .json(
//                 new ApiResponse(
//                 StatusCodes.OK,
//                 {
//                    user:loggedInUser,
//                    accessToken,
//                    refreshToken 
//                 },
//                 "User loggedIn successfully "
//                 )
//             )
//               })  

//         const logoutUser = asyncHandler(async(req,res)=>{
                 
            
//                 await User.findByIdAndUpdate(
//                     req.user._id ,
//                     {
//                         $set:{refreshToken:undefined}
//                     }
//                      )   
                   
//                      const options  = {
//                         httpOnly:true,
//                         secure:true
//                      }

//                      return res
//                      .status(StatusCodes.OK)
//                      .clearCookie("accessToken",options)
//                      .clearCookie("refreshToken",options)
//                      .json( 
//                         new ApiResponse(StatusCodes.OK,{},"User logged Out"))

//               }) 

//         const refreshAccessToken=asyncHandler(async(req,res)=>{

//           try {
//              const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken
  
//             if(!incomingRefreshToken)
//             throw new ApiError(StatusCodes.UNAUTHORIZED,"unauthorized request") 
           
//             const decodedToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
  
//             const user=await User.findById(decodedToken?._id)
  
//             if(!user)
//             throw new ApiError(StatusCodes.UNAUTHORIZED,"Invalid Refresh Token")
            
//             if(incomingRefreshToken!==user?.refreshToken)
//             throw new ApiError(StatusCodes.UNAUTHORIZED,"Invalid User or Refresh Token is ex[ired or used")
            
//             const options={
//               httpOnly:true,
//               secure:true
//             }
//             const {accessToken,newrefreshToken}=await generateAccessAndRefreshTokens(user._id)
  
//            return res
//            .status(StatusCodes.OK)
//            .cookie("accessToken",accessToken,options)
//            .cookie("refreshToken",newrefreshToken,options)
//            .json(
//               new ApiResponse(
//                 StatusCodes.OK,
//                 {
//                   accessToken,
//                   refreshToken:newrefreshToken,
//                 },
//                 "Access token refreshed"  
                
//               )
//            )
//           } catch (error) {
//             throw new ApiError(StatusCodes.UNAUTHORIZED,error?.message ||"Invalid refresh token")
//           }

         

//               })
        
//         const changeCuurentpassword = asyncHandler(async(req,res)=>
//         {
//           const {oldPassword,newPassword} = req.body
            
//           const user= await User.findById(req.user?._id)
         
//          const isPasswordCorrect = await  user.isPasswordCorrect(oldPassword)
          
//          if(!isPasswordCorrect)
//           throw new ApiError(StatusCodes.BAD_REQUEST,"invalid Old Password")

//           user.password=newPassword
//           await user.save({validateBeforeSave:false})//jo baki change nai huye hain unhe as it is hi rakho
        
        
//  return res
//           .status(StatusCodes.OK)
//           .json(new ApiResponse(
//             StatusCodes.OK,
//             {},
//             "Password changed succesfully"
//           )       
//         )
//               })

//          const getCurrentUser = asyncHandler(async(req,res)=>
//          {
//             return res
//                    .status(StatusCodes.OK)
//                    .json(
//                         StatusCodes.OK,
//                         req.user,
//                         "Current user fetched successfully"
//                    )
//               })    

//          const updateAccountDetials = asyncHandler(async(req,res)=>{
               
//                const {fullName,email} = req.body

//               if(!fullName || !email)
//                throw new ApiError(StatusCodes.BAD_REQUEST,"All fields are required")

//                const user = await User.findByIdAndUpdate(
//                 req.user?._id,
//                 {
//                   $set :{
//                     fullName,
//                     email
//                   }
//                 },
//                 {
//                   new:true  // return information after updation
//                 }
//                ).select("-password")

//                return res
//                         .status(StatusCodes.OK)
//                         .json(new ApiResponse(
//                           StatusCodes.OK,user,
//                           "Account details updated successfully"
//                         ))
//               })
             
//          const updateUserAvatar = asyncHandler(async(req,res)=>
//          {
//             const avatarLocalPath= req.file?.path
            
//             if(!avatarLocalPath)
//             throw new ApiError(StatusCodes.BAD_REQUEST,"Avatar file is missing")

//            const avatar = await uploadOnCloudinary(avatarLocalPath)

//            if(!avatar.url)
//            throw new ApiError(StatusCodes.BAD_REQUEST,"Error while uploading avatar")

//           const user = await User.findByIdAndUpdate(
//             req.user?._id,
//             {
//               $set :{
//                 avatar:avatar.url
//               }
//             },
//             {
//               new:true  // return information after updation
//             }
//            ).select("-password")

//            return res
//                     .status(StatusCodes.OK)
//                     .json(new ApiResponse(
//                       StatusCodes.OK,
//                       user,
//                       "Avatar updated successfully"
                      
//                     )
//                     )

//               })
             
//          const updateUsercoverImage = asyncHandler(async(req,res)=>
//          {
//             const coverImageLocalPath= req.file?.path
            
//             if(!coverImageLocalPath)
//             throw new ApiError(StatusCodes.BAD_REQUEST,"coverImage file is missing")

//            const coverImage = await uploadOnCloudinary(coverImageLocalPath)

//            if(!coverImage.url)
//            throw new ApiError(StatusCodes.BAD_REQUEST,"Error while uploading coverImage")

//          const user =  await User.findByIdAndUpdate(
//             req.user?._id,
//             {
//               $set :{
//                 coverImage:coverImage.url
//               }
//             },
//             {
//               new:true  // return information after updation
//             }
//            ).select("-password")


//            return res
//            .status(StatusCodes.OK)
//            .json(new ApiResponse(
//              StatusCodes.OK,
//              user,
//              "CoverImage updated successfully"
             
//            )
//            )

//               })  

//          const getUserChannelProfile = asyncHandler(async(req,res)=>
//          {
//            const {userName} = req.params
            
//            if(!userName?.trim())
//            throw new ApiError(StatusCodes.BAD_REQUEST,"username is missing")

//            const channel = await User.aggregate([
//              {
//                 $match :{ 
//                   userName: userName?.toLowerCase() //it is equivalant to where match where username is match with above userName
//                 }
//              },
//              {
//                 $lookup: {
//                   from:"subscriptions",// becuase Subscription model store in database with name subscriptions as general rule of mongo db
//                   localField:"_id",
//                   foreignField:"channel",
//                   as:"subscribers"
//                 }
//              },
//              {
//               $lookup: {
//                 from:"subscriptions",// becuase Subscription model store in database with name subscriptions as general rule of mongo db
//                 localField:"_id",
//                 foreignField:"subscriber",
//                 as:"subscribedTo"
//               }
//              },
//              {
//               $addFields:{
//                 subscribersCount:{
//                   $size:"$subscribers"
//                 },
//                 channelsSubscribedToCount:{
//                   $size: "$subscribedTo"
//                 },
//                 isSubscribed: {
//                   $cond: {
//                     if:{
//                       $in : [req.user?._id,"$subscribers.subscriber"]
//                     },
//                     then: true,
//                     else : false
//                   }
//                 }
//               }
//              },
//              {
//               $project : //what fields are we going to respond .we are not providind all of them becuase of becoming big datasize to return 
//               {
//                 fullName:1,
//                 userName:1,
//                 email:1,
//                 avatar:1,
//                 coverImage:1,
//                 isSubscribed:1,
//                 subscribersCount:1,
//                 channelsSubscribedToCount:1
//               }
//              },

//            ])
           

//            if(!channel?.length){
//             throw new  ApiError(404,"channel does not exists")
//            }

//             return  res
//                        .status(StatusCodes.OK)
//                        .json(
//                         new ApiResponse(StatusCodes.OK,channel[0],"user channel fetched successfully")
//                        )
//               })   
              
//           const getWatchHistory = asyncHandler(async(req,res)=>{
//             const user = await User.aggregate(
//               [
//                 {
//                   $match:{
//                     _id: new mongoose.Types.ObjectId(req.user._id)
//                   }
//                 },
//                 {
//                   $lookup:{
//                     from: "videos",
//                     localField:"WatchHistory",
//                     foreignFeild:"_id",
//                     as:"watchHistory",
//                     pipeline: [
//                       {
//                         $lookup:{
//                           from:"users",
//                           localField:"owner",
//                           foreginField:"_id",
//                           pipeline:[
//                             {
//                               $project:{
//                                 fullName: 1,
//                                 username: 1,
//                                 avatar: 1,

//                               }
//                             }
//                           ]

//                         }
//                       },
//                       {
//                         $addFields: {
//                            owner:{
//                               $first:"$owner" //adding the field of owner in document or database
//                            }
//                         }
//                       }
//                     ]
//                   }
//                 }

//               ])

//               return res   
//                         .status(StatusCodes.OK)
//                         .json(
//                           new ApiResponse(
//                             StatusCodes.OK,user[0].watchHistory,"WatchHistory fetched succesfully"
//                           )
//                         )
//               })   
               
// export { 
//          registerUser,
//          loginUser,
//          logoutUser,
//          refreshAccessToken,
//          changeCuurentpassword,
//          getCurrentUser,
//          updateAccountDetials,
//          updateUserAvatar,
//          updateUsercoverImage,
//          getUserChannelProfile,
//          getWatchHistory
//         } 