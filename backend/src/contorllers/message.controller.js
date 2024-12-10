import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    // Ensure `req.user` is defined
    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: "Invalid user information" });
    }

    const loggedInUserId = req.user._id;

    // Query the database to get users excluding the logged-in user
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } })
      .select("-password")
      .lean(); // Use `.lean()` to get plain JS objects (improves performance)

    if (!filteredUsers.length) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getMessages=async(req,res)=>{
    try{
      const {id:userToChatId}=req.params;
      const myId=req.user._id;

      const messages=await Message.find({
        $or:[
            {senderId:myId,recevierId:userToChatId},
            {senderId:userToChatId,recevierId:myId}
        ]
      })
      res.status(200).json(messages)
     
    }catch(error){
        console.log("error in getMessages ",error.message);
        res.status(500).json({error:"Internal server error"})
    }
}

export const sendMessage=async(req,res)=>{
    try{
      const {text, image}=req.body;
      const{id: recevierId}=req.params;
      const senderId=req.user._id;

      let imageUrl;
      if(image){
        //upload base64 image to cludinary
        const uploadResponse=await cloudinary.uploader.upload(image);
        imageUrl=uploadResponse.secure_url;
      }

      const newMessage=new Message({
        senderId,
        recevierId,
        text,
        image:imageUrl,
      }); 

      await newMessage.save();

      //todo realtime  functionality goes here=>socket.io
      
      res.status(201).json(newMessage)

    }catch(error){
     console.log("error in sendMessage:", error.message);

    }
}