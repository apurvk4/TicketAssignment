import Spinner from "../assets/spinner.svg";
const Loading = () => {
  return (
    <div className="card">
      <img
        src={Spinner}
        width="60px"
        height={"60px"}
        className="spinner"
        alt="loading.."
      />
    </div>
  );
};
export default Loading;
