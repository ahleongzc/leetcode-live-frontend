import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/login-page'
import HistoryPage from "./pages/history-page";
import DashboardPage from "./pages/dashboard-page";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/nav-bar";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="w-[400px] h-[500px] bg-white overflow-auto">
        <Toaster position='top-center' theme='dark' richColors toastOptions={{
          className: "bg-white text-black border border-gray-300 shadow-lg",
        }} />
        <Router>
          <Navbar />
          <Routes>
            <Route path="/history" element={< HistoryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </Router>
      </div></ThemeProvider>
  );
}

export default App