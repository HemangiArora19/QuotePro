const User= require("../models/UserModel")
const bycrypt= require("bcryptjs")
const jwt= require("jsonwebtoken")
const secretKey= process.env.JWT_SECRET 
const userSignup = async(req, res) => {


  try{
    const { name,email,letterpad,password,address,cName,cPhone } = req.body;
    if(!email||!name||!password||!letterpad||!address||!cName||!cPhone){
        return res.send("Pls enter all the details")
    }
    //check the user is thwre in the daat base
    const existingEmail=await User.findOne({email})
    if(existingEmail){
        return res.send("User already exist")
    }
    //yser is new 
    const hashPassword= await bycrypt.hash(password,10);
const newUser= await User.create({
    name,
    email,
    letterpad,
    password:hashPassword,
    address,
    cName,
    cPhone
})
const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      secretKey,
      { expiresIn: "1d" }
    );
    res.send({message: "User signup successful",
    data: newUser,
    token:token
  });
  }catch(err){
    res.send(err);
  }
  
};

const userLogin = async(req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input first
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all the details" });
    }

    // 2. Find user
    const findUser = await User.findOne({ email });
    console.log("Found user:", findUser);
    
    if (!findUser) {
      return res.status(401).json({
        message: "Email or password is invalid"
      });
    }

    // 3. Compare password
    const match = await bycrypt.compare(password, findUser.password);
    if (!match) {
      return res.status(401).json({
        message: "Email or password is invalid"
      });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { id: findUser._id, email: findUser.email },
      secretKey,
      { expiresIn: "1h" }
    );

    // 5. Send safe response (no password)
    return res.status(200).json({
      message: "User login successful",
      token,
      user: {
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        letterpad: findUser.letterpad,
        address: findUser.address,
        cName: findUser.cName,
        cPhone: findUser.cPhone
      }
    });
  } catch(err) {
    console.error("Login error:", err); // Log the full error
    return res.status(500).json({
      message: "Internal server error",
      error: err.message, 
     
    });
  }
};

module.exports = {
  userSignup,
  userLogin,
};