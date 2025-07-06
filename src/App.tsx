import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LoginPage from './pages/login-page'
import HistoryPage from "./pages/history-page";
import HomePage from "./pages/home-page";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/nav-bar";

function AppContent() {
  const location = useLocation();

  // Routes where navbar should be hidden
  const knownRoutes = ["/history", "/home"];
  const showNavbar = knownRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "h-[calc(100%-60px)]" : "h-full"}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="w-[400px] h-[500px] bg-white overflow-hidden">
        <Toaster position='top-center' theme='dark' richColors toastOptions={{
          className: "bg-white text-black border border-gray-300 shadow-lg",
        }} />
        <Router>
          <AppContent />
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App