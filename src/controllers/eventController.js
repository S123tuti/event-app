const eventModel = require("../models/eventModel");
const userModel = require("../models/userModel");
const { eventvalid, updateEventValid } = require("../validation/eventValid");
const uploadFile = require("../awsConfig/aws");
const moment = require("moment-timezone");
const { parse } = require("dotenv");
const { default: mongoose } = require("mongoose");


// ===========================================create event=======================================================
const createEvent = async (req, res) => {
  let data = req.body;
  const files = req.files;
  const { error, value } = eventvalid.validate(data);

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  if (req.decode !== value.moderator) {
    return res
      .status(403)
      .send({ status: false, message: "unauthorized user" });
  }
  // const istDate = moment
  //   .tz(value.schedule, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata")
  //   .format("YYYY-MM-DDTHH:mm:ss.000Z");
  const istDateTime = new Date(value.schedule);
  const mongoDateTime = new Date(
    istDateTime.getTime() - istDateTime.getTimezoneOffset() * 60000
  );

  let img = await uploadFile(files[0]);
  let event = new eventModel({
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

// ======================================get by id==================================================================
const getById = async (req, res) => {
  try {
    let eventId = req.params.eventId;
    const findEvent = await eventModel.findById({ _id: eventId });

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

// =========================================all events============================================================
const getAllEvent = async (req, res) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    let skipIndex = (page - 1) * limit;
    let filterdata = await eventModel
      .find({ isDeleted: false })
      .sort({ schedule: 1 })
      .skip(skipIndex)
      .limit(limit);

    return res.status(200).send({
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

// ==========================================update event===========================================================

const updateEvent = async (req, res) => {
  try {
    let data = req.body;
    let eventId = req.params.eventId;
    const { err, value } = updateEventValid.validate(data);

    if (err) {
      return res.status(400).send({ error: err.details[0].message });
    }
    if (value.schedule) {
      //    const istDate = moment
      // .tz(value.schedule, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata")
      // .format("YYYY-MM-DDTHH:mm:ss.000Z");
      const istDateTime = new Date(value.schedule);
      value.schedule = new Date(
        istDateTime.getTime() - istDateTime.getTimezoneOffset() * 60000
      );
    }
    let files = req.files;
    if (files && files.length > 0) {
      data.image = await uploadFile(files[0]);
    }

    await eventModel.findOneAndUpdate(
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

// ====================================delete event by id===========================================================
const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    await eventModel.findOneAndUpdate(
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

// ===========================================attendees==========================================================

const attendees = async function (req, res) {
  try {
    const { userId } = req.params;
    const { eventId } = req.body;
    if (!eventId)
      return res
        .status(400)
        .send({
          status: false,
          message: "please provide eventId whom you attended",
        });

    if (!mongoose.isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid userId" });
    }
    const user = await userModel.findById(userId);
    if (!user)
      return res.status(404).send({ status: false, message: "user not found" });
  
    if (req.decode !== userId) {
      return res
        .status(403)
        .send({ status: false, message: "unauthorized user" });
    }

    const event = await eventModel.findById(eventId);

    if (event.attendees.includes(userId) || event.moderator.toString() === userId) {
      return res
        .status(400)
        .send({ msg: "You already resgistered for this event" });
    } else {
       event.attendees.push(user);
      
    }
     await event.save()
    return res.status(200).send({ message: "You are registered successfully" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "server error", error: err.message });
  }
};

module.exports = {
  createEvent,
  getById,
  getAllEvent,
  updateEvent,
  deleteEvent,
  attendees,
};
