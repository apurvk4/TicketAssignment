const handleError = require("../handleError");
const { Coach } = require("../Models/coachSchema");
function fillRow(value, row, id) {
  let count = value;
  let filled = Array(row.length);
  for (let j = row.length - 1; j >= 0; j--) {
    let temp = { ...row[j] };
    if (count > 0 && !row[j].booked) {
      count--;
      temp.booked = true;
      temp.userId = id;
    }
    filled[j] = temp;
  }
  return filled;
}
function generateSeats(
  value,
  seatMatrix,
  start,
  end,
  emptySeats,
  id,
  len,
  flag
) {
  if (start < 0 || end >= len || start > end) {
    return {
      remaining: value,
      modified: {},
    };
  }
  let minRow = -1;
  let minVal = Infinity;
  if (flag == 1) {
    for (let i = end; i >= start; i--) {
      let empty = emptySeats[i];
      if (value <= empty) {
        let filled = fillRow(value, seatMatrix[i], id);
        let temp = {};
        temp[i] = filled;
        return {
          modified: temp,
          remaining: 0,
        };
      } else if (empty > 0) {
        minVal = Math.min(value - empty, minVal);
        if (minVal == value - empty) {
          minRow = i;
        }
      }
    }
  } else {
    for (let i = start; i <= end; i++) {
      let empty = emptySeats[i];
      if (value <= empty) {
        let filled = fillRow(value, seatMatrix[i], id);
        let temp = {};
        temp[i] = filled;
        return {
          modified: temp,
          remaining: 0,
        };
      } else if (empty > 0) {
        minVal = Math.min(value - empty, minVal);
        if (minVal == value - empty) {
          minRow = i;
        }
      }
    }
  }
  if (minRow != -1) {
    let filled = fillRow(emptySeats[minRow], seatMatrix[minRow], id);
    let remaining = value - emptySeats[minRow];
    let res1 = generateSeats(
      remaining,
      seatMatrix,
      start,
      minRow - 1,
      emptySeats,
      id,
      len,
      1
    );
    if (res1.remaining != 0) {
      let ans2 = generateSeats(
        res1.remaining,
        seatMatrix,
        minRow + 1,
        end,
        emptySeats,
        id,
        len,
        0
      );
      if (ans2.remaining == 0) {
        // mix this update and res1 updates and store in res1
        res1.remaining = 0;
        res1.modified = { ...res1.modified, ...ans2.modified };
      }
    }
    let res2 = generateSeats(
      remaining,
      seatMatrix,
      minRow + 1,
      end,
      emptySeats,
      id,
      len,
      0
    );
    if (res2.remaining != 0) {
      let ans1 = generateSeats(
        res2.remaining,
        seatMatrix,
        minRow + 1,
        end,
        emptySeats,
        id,
        len,
        0
      );
      if (ans1.remaining == 0) {
        // mix this update and res2 updates and store in res2
        res2.remaining = 0;
        res2.modified = { ...res2.modified, ...ans1.modified };
      }
    }
    let temp = {};
    temp[minRow] = filled;
    if (res1.remaining != 0 && res2.remaining != 0) {
      // keep min(res1.remaining,res2.remaining)
      let min = Math.min(res1.remaining, res2.remaining);
      if (min == res1.remaining) {
        return {
          modified: { ...res1.modified, ...temp },
          remaining: res1.remaining,
        };
      } else {
        return {
          modified: { ...res2.modified, ...temp },
          remaining: res2.remaining,
        };
      }
    } else if (res1.remaining != 0 && res2.remaining == 0) {
      // keep res2
      return {
        modified: { ...res2.modified, ...temp },
        remaining: 0,
      };
    } else if (res1.remaining == 0 && res2.remaining != 0) {
      // keep res1
      return {
        modified: { ...res1.modified, ...temp },
        remaining: 0,
      };
    } else {
      // both 0
      // keep the one which is less spread out
      let len1 = Object.keys(res1.modified).length;
      let len2 = Object.keys(res2.modified).length;
      if (len1 < len2) {
        return {
          modified: { ...res1.modified, ...temp },
          remaining: res1.remaining,
        };
      } else if (len1 == len2) {
        ans1keys = Object.keys(res1.modified);
        ans1keys.sort((a, b) => {
          return Number.parseInt(b) - Number.parseInt(a);
        });
        ans2keys = Object.keys(res2.modified);
        ans2keys.sort((a, b) => {
          return Number.parseInt(a) - Number.parseInt(b);
        });
        if (minRow - ans1keys[0] <= ans2keys[0] - minRow) {
          return {
            modified: { ...res1.modified, ...temp },
            remaining: 0,
          };
        } else {
          return {
            modified: { ...res2.modified, ...temp },
            remaining: 0,
          };
        }
      } else {
        return {
          modified: { ...res2.modified, ...temp },
          remaining: 0,
        };
      }
    }
  }
  return {
    modified: {},
    remaining: value,
  };
}

const bookTickets = async (req, res) => {
  try {
    let { value } = req.body;
    if (typeof value == "undefined" || !Number.isInteger(value)) {
      return res.status(400).send({ message: "invalid input value !!" });
    }
    let result = await Coach.findOne(
      { name: "default" },
      {
        seats: 1,
      }
    );
    if (result) {
      let seats = result.seats;
      //   generateSeats(value,seats);
      let seatMatrix = [];
      for (let i = 0; i < seats.length; ) {
        let len = 7;
        if (i == 0) {
          len = 3;
        }
        let temp = [];
        for (let j = i; j < i + len; j++) {
          temp.push(seats[j].toObject());
        }
        seatMatrix.push(temp);
        i += len;
      }

      // seatMatrix.sort((a, b) => {
      //   let num1 = a.reduce((prev, val) => {
      //     if (!val.booked) {
      //       return prev + 1;
      //     }
      //     return prev;
      //   }, 0);
      //   let num2 = b.reduce((prev, val) => {
      //     if (!val.booked) {
      //       return prev + 1;
      //     }
      //     return prev;
      //   }, 0);
      //   return num1 - num2;
      // });
      let emptySeats = {};
      for (let i = 0; i < seatMatrix.length; i++) {
        emptySeats[i] = seatMatrix[i].reduce((prev, val) => {
          if (!val.booked) {
            return prev + 1;
          }
          return prev;
        }, 0);
      }
      let id = "" + Date.now() + Math.random() * 100 + 1;
      let ans = generateSeats(
        value,
        seatMatrix,
        0,
        seatMatrix.length - 1,
        emptySeats,
        id,
        seatMatrix.length,
        1
      );
      if (ans.remaining != 0) {
        res.status(403).send({
          message: "Not Enough Empty Seats",
          seats: seatMatrix,
          id: id,
        });
        return;
      }
      let keys = Object.keys(ans.modified);
      for (let i = 0; i < keys.length; i++) {
        let j = Number.parseInt(keys[i]);
        seatMatrix[j] = ans.modified[j];
      }
      let temp = Array(12);
      for (let i = 0; i < seatMatrix.length; i++) {
        let rowNo = seatMatrix[i][0].row;
        temp[rowNo - 1] = seatMatrix[i];
      }
      let val = [].concat(...temp);
      Coach.updateOne(
        { name: "default" },
        {
          seats: val,
        }
      )
        .then(() => {
          res.status(201).send({ seats: temp, id: id });
        })
        .catch((err) => {
          res.status(400).send(handleError(err));
        });
    } else {
      return res.status(400).send({ message: "coach not found" });
    }
  } catch (err) {
    res.status(400).send(handleError(err));
  }
};
module.exports = { bookTickets };
