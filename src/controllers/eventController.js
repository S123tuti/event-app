const eventModle = require("../models/eventModel")
const {eventvalid}  = require("../validation/eventValid")

const createEvent = async (req,res)=>{
let data = req.body

const {error, value} =  eventvalid.validate(data)

if(error){
    return res
    .status(400)
    .send({error: error.details[0].message })
}
if(value.schedule){
     value.schedule = new Date(value.schedule)
}

  let  event = await eventModle.create(value)

  return res
  .status(201)
  .send({status:true, message:"event created successfuly", data : event})
}


const getById = async (req, res) =>{
 try {
        let eventId = req.params.id
const  findEvent = await eventModle.findById({_id : eventId})

return res
.status(200)
.send({status:true, message:"event find successfully", data : findEvent})
    } catch (err) {
        return res
        .status(500)
        .send({status:false, message:"server error", error: err.message})
    }

}

const getAllEvent = async (req,res)=>{
    try {
        
    } catch (err) {
        
    }

}

const updateEvent = async (req, res) =>{

}

const deleteEvent = async (req,res)=>{

}

module.exports = {createEvent,getById, getAllEvent,updateEvent, deleteEvent}