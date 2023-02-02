import { Route, Routes } from "react-router-dom";
import Book from "./Components/Book";
import Error from "./Components/Error";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Book />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};
export default App;
