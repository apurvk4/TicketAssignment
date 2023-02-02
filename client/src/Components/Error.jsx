import { Link } from "react-router-dom";
const Error = () => {
  return (
    <div className="card">
      <h2>Error 404 Page Not Found</h2>
      <Link to={"/"}>Go Back to Home</Link>
    </div>
  );
};
export default Error;
