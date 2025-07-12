import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useState } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Routes, Route, useLocation } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import LoginPage from "./pages/login-page";
import HomePage from './pages/home-page';
import HistoryPage from './pages/history-page';
import InterviewOngoingPage from './pages/interview-ongoing-page';
import { Navbar } from './components/nav-bar';

const queryClient = new QueryClient()

function App() {
  const location = useLocation();
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(500);

  const handleResize = (newWidth: number, newHeight: number) => {
    setWidth(newWidth);
    setHeight(newHeight);
  };

  const hideNavbarRoutes = ["/login", "/ongoing"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position='top-center' theme='dark' richColors />
      <div
        className="bg-white overflow-hidden"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {shouldShowNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/ongoing" element={<InterviewOngoingPage onResize={handleResize} />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div >
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App