import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Routes, Route, useLocation } from "react-router-dom"
import { DEFAULT_PAGE_WIDTH, DEFAULT_PAGE_HEIGHT } from './types'
import { Toaster } from "@/components/ui/sonner"
import LoginPage from "./pages/login-page";
import HomePage from './pages/home-page';
import HistoryPage from './pages/history-page';
import InterviewOngoingPage from './pages/interview-ongoing-page';
import { Navbar } from './components/nav-bar';
import './App.css';

const queryClient = new QueryClient()

function App() {

  useEffect(() => {
    const handler = (message: any) => {
      if (message?.Type === "refresh") {
        window.close();
      }
    };

    chrome.runtime.onMessage.addListener(handler);
    return () => {
      chrome.runtime.onMessage.removeListener(handler);
    };

  }, []);

  const location = useLocation();
  const [width, setWidth] = useState(DEFAULT_PAGE_WIDTH);
  const [height, setHeight] = useState(DEFAULT_PAGE_HEIGHT);

  const handleResize = (newWidth: number, newHeight: number) => {
    setWidth(newWidth);
    setHeight(newHeight);
  };

  const hideNavbarRoutes = ["/login", "/ongoing"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className="bg-white overflow-y-visible flex flex-col"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {shouldShowNavbar && <Navbar />}
        <Toaster position='top-center' theme='dark' richColors />
        <Routes>
          <Route path="/" element={<HomePage onResize={handleResize} />} />
          <Route path="/login" element={<LoginPage onResize={handleResize} />} />
          <Route path="/ongoing" element={<InterviewOngoingPage onResize={handleResize} />} />
          <Route path="/home" element={<HomePage onResize={handleResize} />} />
          <Route path="/history" element={<HistoryPage onResize={handleResize} />} />
        </Routes>
      </div >
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App