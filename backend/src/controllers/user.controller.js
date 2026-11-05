import { User} from "../models/user.model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const registerUser= async (req,res) => {
try{
const { username, email,password}= req.body;
// basic validation 
if ( !username || !email || !password){

return res.status(400).json({ message: "all fields are required"})
}
// check if user alreadyy existss 
const existing = await User.findOne({email: email.toLowerCase()});
if ( existing){
return res.status(409).json({ message: "user already exists"})};

// creating userr
const user= await User.create({
    username,
    email: email.toLowerCase(),
    password,
    loggedIn: false,
}
);
 res.status(201).json({ message: "user registered succesfully", user: {id: user._id, email: user.email,username: user.username}})
;


}catch (error){
return res.status(500).json({ message: "internal server error", error: error.message});
}
};

const loginUser = async (req, res) => {
try{
// check if user exists
const { email, password } = req.body;
const user = await User.findOne({
email: email.toLowerCase(),
});
if (!user)
    res.set("Cache-Control", "private, no-store");
    return res.status(404).json({ message: "User not found" });

// check if password matches
const isMatch = await user.comparePassword(password);
if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

const access= jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

const refresh= jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });


res.status(200).json({ message: "Login successful", access, refresh,
     user: {
username: user.username,
email: user.email,
id: user._id
}
 });
} catch (error) {

res.status(500).json({ message : "server error"})

}
};


const refreshToken = async (req, res) => {
  try {
    const { refresh } = req.body;
    if (!refresh) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const payload = jwt.verify(refresh, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    const access = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
     
      { expiresIn: "15m" }
    );

    res.status(200).json({ access });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};




const logoutUser = async (req, res) => {
try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
if (!user) return res.status(404).json({ message: "User not found" });

res.status(200).json({ message: "Logout successful" });

} catch (error) {
res.status(500).json({ message: "Server error" });
}

};


export{ registerUser,loginUser,logoutUser, refreshToken}; 
