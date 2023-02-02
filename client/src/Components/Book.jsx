import { useState } from "react";
import "../Book.css";
import Reserve from "./Reserve";
import Ticket from "./Ticket";
import Spinner from "../assets/spinner.svg";
function Book() {
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState([[]]);
  const [booked, setBooked] = useState(false);
  const [value, setValue] = useState(1);
  const [uid, setUid] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let url = `/api/book`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ value: Number.parseInt(value) }),
      });
      if (response.status === 201) {
        const res = await response.json();
        setTicket(res.seats);
        setBooked(true);
        setUid(res.id);
      } else if (response.status === 403) {
        const res = await response.json();
        setTicket(res.seats);
        setBooked(true);
        setUid(res.id);
        alert("not enough empty seats");
      } else {
        const res = await response.json();
        alert(res.message ?? "there was an error");
        setBooked(false);
      }
      setLoading(false);
    } catch (err) {
      setBooked(false);
      setLoading(false);
      alert(err.message ?? "there was an error");
      // setTimeout(() => {
      //   setTicket(["2A", "2B", "2C", "2D", "2E", "2F", "2G"]);
      //   setBooked(true);
      //   setLoading(false);
      // }, 2000);
    }
  };
  const clear = async () => {
    setLoading(true);
    try {
      let url = "/api/clear";
      let response = await fetch(url);
      if (response.status === 200) {
        setLoading(false);
        alert("cleared successfully");
        window.location.reload();
      } else {
        setLoading(false);
        let res = await response.json();
        alert(res.message);
      }
    } catch (err) {
      setLoading(false);
      alert(err.message);
    }
  };
  return (
    <>
      {booked ? (
        <div className="fixed">
          <nav className="row middle" style={{ margin: "20px" }}>
            <button
              style={{ margin: "0.5rem" }}
              onClick={() => {
                setTicket([[]]);
                setBooked(false);
                setUid("");
              }}
            >
              Book More Tickets
            </button>
            <button style={{ margin: "0.5rem" }} onClick={clear}>
              {loading ? (
                <img src={Spinner} className="spinner" alt="loading.." />
              ) : (
                <span>Clear All Bookings</span>
              )}
            </button>
          </nav>
        </div>
      ) : (
        ""
      )}
      <div className="App">
        <h1>{booked ? "Your Ticket" : "Book Tickets"}</h1>
        {booked ? (
          <Ticket list={ticket} uid={uid} />
        ) : (
          <Reserve
            loading={loading}
            value={value}
            setValue={setValue}
            setLoading={setLoading}
            submit={submit}
          />
        )}
      </div>
    </>
  );
}

export default Book;
