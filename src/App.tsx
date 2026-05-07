import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import OldComplaintTagging from "./components/OldComplaintTagging";
// import "./App.css";
import IrvinsComplaintForm from "./components/IrvinsComplaintForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/form" element={<IrvinsComplaintForm />} />
        <Route path="/tagging" element={<OldComplaintTagging />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;