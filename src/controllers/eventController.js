const eventModle = require("../models/eventModel");
const { eventvalid, updateEventValid } = require("../validation/eventValid");
const uploadFile = require("../awsConfig/aws");
const moment = require("moment-timezone");
const { parse } = require("dotenv");


const createEvent = async (req, res) => {
  let data = req.body;
  const files = req.files;
  const { error, value } = eventvalid.validate(data);

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  if(req.decode !== value.moderator){
    return res
    .status(403)
    .send({status:false, message :"unauthorized user"})
}
  // const istDate = moment
  //   .tz(value.schedule, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata")
  //   .format("YYYY-MM-DDTHH:mm:ss.000Z");
  const istDateTime = new Date(value.schedule);
  const mongoDateTime = new Date(
    istDateTime.getTime() - istDateTime.getTimezoneOffset() * 60000
  );


  let img = await uploadFile(files[0]);
  let event = await new eventModle({
    type: value.type,
    name: value.name,
    tagline: value.tagline,
    schedule: mongoDateTime,
    description: value.description,
    image: img,
    moderator: value.moderator,
    category: value.category,
    sub_category: value.sub_category,
    rigor_rank: value.rigor_rank,
  });
  await event.save();
  return res
    .status(201)
    .send({ status: true, message: "event created successfuly", data: event });
};

const getById = async (req, res) => {
  try {
    let eventId = req.params.id;
    const findEvent = await eventModle.findById({ _id: eventId });

    return res.status(200).send({
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
    let page = req.query.page;
    let limit = req.query.limit;
    let skipIndex = (page - 1) * limit;
    let filterdata = await eventModle
      .find({isDeleted: false})
      .sort({ schedule: 1})
      .skip(skipIndex)
      .limit(limit);

    return res
      .status(200)
      .send({
        status: true,
        message: "data fetch successfully",
        data: filterdata,
      });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "server error", error: err.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    let data = req.body;
    let eventId = req.params.id;
    const { err, value } = updateEventValid.validate(data);

    if (err) {
      return res.status(400).send({ error: err.details[0].message });
    }
    if (value.schedule) {
    //    const istDate = moment
    // .tz(value.schedule, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata")
    // .format("YYYY-MM-DDTHH:mm:ss.000Z");
  const istDateTime = new Date(value.schedule);
   value.schedule= new Date(
    istDateTime.getTime() - istDateTime.getTimezoneOffset() * 60000
  );
    }
   let files = req.files
    if (files && files.length > 0) {
      data.image = await uploadFile(files[0]); 
    }

    await eventModle.findOneAndUpdate(
      { _id: eventId },
      { $set: value },
      { upsert: true },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "event updated successfuly" });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "server error", error: err.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    await eventModle.findOneAndUpdate(
      { _id: eventId },
      {
        $set: { isDeleted: true },
      }
    );
    return res
      .status(204)
      .send({ status: true, message: "user deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: "server error", error: err.message });
  }
};

module.exports = {
  createEvent,
  getById,
  getAllEvent,
  updateEvent,
  deleteEvent,
};
