import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/login-page'
import StartInterviewPage from "./pages/start-interview-page";
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <div className="w-[400px] h-[500px]">
      <Toaster position='top-center' theme='dark' richColors toastOptions={{
        className: "bg-white text-black border border-gray-300 shadow-lg",
      }} />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/start-interview" element={<StartInterviewPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App