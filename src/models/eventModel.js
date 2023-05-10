const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const eventSchema = new mongoose.Schema({
    type: {
      type: String,
      default: "event",
    },
    name: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
      required: true,
    },
    schedule: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    moderator: {
      type: objectId,
      ref: "user",
    },
    category: {
      type: String,
      required: true,
    },
    sub_category: {
      type: String,
    },

    rigor_rank: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    attendees: [objectId],
  },
  { timestamps: true }
);

module.exports = mongoose.model("event", eventSchema);
