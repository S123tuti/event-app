const eventModle = require("../models/eventModel");
const { eventvalid ,updateEventValid} = require("../validation/eventValid");

const createEvent = async (req, res) => {
  let data = req.body;

  const { error, value } = eventvalid.validate(data);

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  if (value.schedule) {
    value.schedule = new Date(value.schedule);
  }

  let event = await eventModle.create(value);

  return res
    .status(201)
    .send({ status: true, message: "event created successfuly", data: event });
};

const getById = async (req, res) => {
  try {
    let eventId = req.params.id;
    const findEvent = await eventModle.findById({ _id: eventId });

    return res
      .status(200)
      .send({
        status: true,
        message: "event find successfully",
        data: findEvent,
      });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "server error", error: err.message });
  }
};

const getAllEvent = async (req, res) => {
  try {

    let page = req.query.page
    let limit = req.query.limit
    let skipIndex = (page -1 )* limit
    let filterdata = await eventModle.find()
    .sort({schedule: -1})
    .skip(skipIndex)
    .limit(limit)

    return res 
    .status(200)
    .send({status:true, message:'data fetch successful', data : filterdata})
 
  } catch (err) {
    return res
    .status(500)
    .send({status:false, message:"server error", error : err.message})
  }
};

const updateEvent = async (req, res) => {
  try {
    let data = req.body;
    let eventId= req.params.id
   const {err, value} = updateEventValid.validate(data)

   if(err){
    return res
    .status(400)
    .send({ error: err.details[0].message })
   }
   if (value.schedule) {
    value.schedule = new Date(value.schedule);
  }
     await eventModle.findOneAndUpdate({_id : eventId},
      {$set: value}, {upsert: true}, {new:true}
     )
     return res.status(200).send({status:true, message:"event updated successfuly"})
  } catch (err) {
    return res
    .status(500)
    .send({status:false, message:"server error", error : err.message})
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id

     await eventModle.findOneAndUpdate({_id:eventId},{
      $set:{isDeleted :true}
     })
     return  res.status(204)
     .send({status:true, message:"user deleted successfully"})
  } catch (error) {
    return res
    .status(500)
    .send({status:false, message:"server error", error : err.message})
  }
};

module.exports = {
  createEvent,
  getById,
  getAllEvent,
  updateEvent,
  deleteEvent,
};
