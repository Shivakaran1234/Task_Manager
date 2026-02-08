import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import BrainDump from "./pages/BrainDump";
import FocusMode from "./pages/FocusMode";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<BrainDump />} />
        <Route path="/focus" element={<FocusMode />} />
      </Routes>
    </>
  );
}
