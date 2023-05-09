const jwt = require('jsonwebtoken')
const mongoose = require("mongoose")
const eventModel = require ('../models/eventModel')


const authentication  = (req, res, next)=>{
    let authtoken = req.headers.authorization 
   console.log(authtoken)
    if(!authtoken){
        return res
        .status(401)
        .send({status:false, message:"unauthenticated user"})
    }
    let token = authtoken.split(" ")[1]

    jwt.verify(token, process.env.Jwt_secret, (err , decode)=>{
        if(err){
            let msg = err.message = "jwt expired"
            ? "Token is Expired !!!"
            :"Token is Invalid !!!"
            return res.status(401).send({message:msg})
        }
        req.decode = decode .userId
        next()
    })
   
}

const authorization =  async(req, res, next)=>{
  try {
    let  eventId = req.params.id

    if(!mongoose.isValidObjectId(findeve))
    return res
    .status(400)
    .send({status:false, message:"please inter valid objectId"})

    let findeve = await eventModel.findById({eventId})

    
    if(!findeve || findeve.isDeleted == true){
        return res
        .status(404)
        .send({status:false, message:"event not found"})
    }
   
    if(req.decode !== findeve.moderator){
        return res
        .status(403)
        .send({status:false, message :"unauthorized user"})
    }
    
  } catch (err) {
    
  }
}

module.exports = {authentication, authorization}