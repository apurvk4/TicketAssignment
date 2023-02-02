const mongoose = require("mongoose");
const { TicketSchema } = require("./ticketSchema");
const Schema = mongoose.Schema;
const ObjectID = Schema.Types.ObjectId;

const CoachSchema = new Schema(
  {
    name: {
      type: String,
      default: "default",
    },
    seats: {
      type: [TicketSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coach = mongoose.model("coach", CoachSchema);
module.exports = { Coach };
