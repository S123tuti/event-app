const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { userValid, loginvaild } = require("../validation/userValid");
const jwt = require("jsonwebtoken")

// ====================================user created==================================================================
const createUser = async (req,res) => {
  try {
    let data = req.body;

    const { error, value } = userValid.validate(data);
    if (error) {
      return res
      .status(400)
      .send({ error: error.details[0].message });
    }

    let user = await userModel.findOne({ email: value.email });
// console.log(user)
    if (user)
      return res
        .status(400)
        .send({ status: false, message: "user already exist" });

    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(value.password, saltRounds);

    let createUser = await new userModel({
      name: value.name,
      email: value.email,
      gender:value.gender,
      password: encryptedPassword,
    });
    await createUser.save();
    return res
    .status(201)
    .send({
      status: true,
      message: "user created sucessfully",
      data: createUser,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "server error", error: err.message });
  }
};

// ========================================login=================================================================
const userLogin = async (req,res)=>{
try {
    const data = req.body

    const {error, value} = loginvaild.validate(data)

    if(error){
        return res
        .status(400)
        .send({ error: error.details[0].message })
    }
   let user = await userModel.findOne({email:value.email})

   if(!user)
   return res
   .status(404)
   .send({status:false,message:"user not exist" })

   let  isValidPass =  await bcrypt.compare(value.password, user.password)
   if (!isValidPass) {
    return res
    .status(404)
    .send({ status: false, message: "enter correct password..." })
   }
    let payload = {
        userId: user._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000 + 60 * 60 * 24),
      };
      let token = jwt.sign(payload, process.env.Jwt_secret);
      return res
        .status(201)
        .send({ status: true, data: { userId: user._id, token: token } });

} catch (err) {
    return res
    .status(500)
    .send({staus:false , message:"server error", error : err.message})
}
}


module.exports = {createUser, userLogin}
