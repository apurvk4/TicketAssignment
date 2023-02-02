const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectID = Schema.Types.ObjectId;

const TicketSchema = new Schema(
  {
    booked: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      validate: {
        validator: function (value) {
          if (this.booked) {
            return true;
          }
          return false;
        },
        message: "userId can only be set when ticket is booked",
      },
    },
    row: {
      type: Number,
      min: 1,
      max: 12,
      required: true,
    },
    seatId: {
      type: String,
      enum: ["A", "B", "C", "D", "E", "F", "G"],
      required: true,
      validate: {
        validator: function (value) {
          if (this.row == 1) {
            return value == "A" || value == "B" || value == "C";
          }
          return true;
        },
        message: "invalid seatId",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model("ticket", TicketSchema);
module.exports = { Ticket, TicketSchema };
