const handleError = require("../handleError");
const { Coach } = require("../Models/coachSchema");
const { Ticket } = require("../Models/ticketSchema");
const clearRecords = async (req, res) => {
  try {
    let result = await Coach.deleteMany({});
    if (result) {
      let seatList = [];
      for (let i = 1; i <= 12; i++) {
        let seatNos = 7;
        if (i == 1) {
          seatNos = 3;
        }
        for (let j = 1; j <= seatNos; j++) {
          let s = String.fromCharCode(j + 64);
          seatList.push(new Ticket({ row: i, seatId: s, booked: false }));
        }
      }
      const defaultCoach = new Coach({
        name: "default",
        seats: seatList,
      });
      defaultCoach.save((err) => {
        if (err) {
          console.log(err);
          res.status(400).send(handleError(err));
        } else {
          res.status(200);
          res.end();
        }
      });
    } else {
      res.status(400).send({ message: "there was some error !!" });
    }
  } catch (err) {
    res.status(400).send(handleError(err));
  }
};
module.exports = { clearRecords };
