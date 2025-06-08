import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Models from "./pages/Models";
import GenerateModel from "./pages/GenerateModel";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/models" element={<Models />} />
          <Route path="/generate" element={<GenerateModel />} />
        </Routes>
      </Router>
  );
}

export default App;
