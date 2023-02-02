// import { useState } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Seat from "./Seat";
const status = ["filled", "empty", "current"];

const Ticket = ({ list, uid }) => {
  const [ticketList, setTicketList] = useState([]);
  useEffect(() => {
    let temp = [];
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < list[i].length; j++) {
        if (list[i][j].booked && list[i][j].userId === uid) {
          temp.push(list[i][j].row + list[i][j].seatId);
        }
      }
    }
    setTicketList(temp);
  }, [list, uid]);
  function displayStatus() {
    let res = [];
    for (let i = 0; i < list.length; i++) {
      let temp = [];
      for (let j = 0; j < list[i].length; j++) {
        if (list[i][j].booked && list[i][j].userId === uid) {
          temp.push(
            <Seat
              key={`${i}${j}`}
              status={status[2]}
              seatNo={list[i][j].row + list[i][j].seatId}
            />
          );
        } else if (list[i][j].booked && list[i][j].userId !== uid) {
          temp.push(
            <Seat
              key={`${i}${j}`}
              status={status[0]}
              seatNo={list[i][j].row + list[i][j].seatId}
            />
          );
        } else {
          temp.push(
            <Seat
              key={`${i}${j}`}
              status={status[1]}
              seatNo={list[i][j].row + list[i][j].seatId}
            />
          );
        }
      }
      if (i === 0) {
        res.push(
          <div key={`${i}8`} className="row middle">
            {temp}
          </div>
        );
      } else {
        res.push(
          <div key={`${i}8`} className="row evenly">
            {temp}
          </div>
        );
      }
    }
    return <div className="col">{res}</div>;
  }
  return (
    <div className="card">
      <div className="col">
        <div className="row">
          <div className="box" style={{ backgroundColor: "red" }}></div>
          <span>Booked by someone Else</span>
        </div>
        <div className="row">
          <div className="box" style={{ backgroundColor: "green" }}></div>
          <span>Your Current Seats</span>
        </div>
        <div className="row">
          <div className="box" style={{ backgroundColor: "blue" }}></div>
          <span>Empty Seats</span>
        </div>
      </div>
      <div className="col middle">
        <span>Your Seats Are :</span>
        <div className="row middle">
          {ticketList.map((ticket) => {
            return (
              <div
                className="row"
                style={{ padding: "0.5rem", color: "green" }}
                key={ticket}
              >
                {ticket}
              </div>
            );
          })}
        </div>
      </div>
      {displayStatus()}
    </div>
  );
};
export default Ticket;
