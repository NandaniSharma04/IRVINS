import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import OldComplaintTagging from "./components/OldComplaintTagging";
import IrvinsComplaintForm from "./components/IrvinsComplaintForm";
import Dashboard from "./components/dashboard/Dashboard";  // 👈 ADD THIS IMPORT

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/form" element={<IrvinsComplaintForm />} />
        <Route path="/tagging" element={<OldComplaintTagging />} />
        <Route path="/dashboard" element={<Dashboard />} />  {/* 👈 ADD THIS ROUTE */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;