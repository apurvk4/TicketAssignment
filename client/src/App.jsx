import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Loading from "./Components/Loading";
const Book = lazy(() => import("./Components/Book"));
const Error = lazy(() => import("./Components/Error"));

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<Loading />}>
            <Book />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <Suspense fallback={<Loading />}>
            <Error />
          </Suspense>
        }
      />
    </Routes>
  );
};
export default App;
