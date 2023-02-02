import warning from "../assets/warning.svg";
import spinner from "../assets/spinner.svg";
const Reserve = ({ loading, submit, value, setValue }) => {
  return (
    <form className="card" onSubmit={submit}>
      <label>Enter the number of Seats</label>
      <input
        type="number"
        data-error={value >= 1 && value <= 7 ? undefined : "true"}
        value={value}
        disabled={loading}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      {value >= 1 && value <= 7 ? (
        ""
      ) : (
        <div className="error-warn">
          <img src={warning} alt="input error" />
          <span>Enter A valid number between 1 and 7</span>
        </div>
      )}
      <button
        disabled={value >= 1 && value <= 7 && !loading ? false : true}
        className="submit-btn"
        type="submit"
      >
        {loading ? (
          <img src={spinner} className="spinner" alt="loading" />
        ) : (
          <span>Reserve Ticket</span>
        )}
      </button>
    </form>
  );
};
export default Reserve;
