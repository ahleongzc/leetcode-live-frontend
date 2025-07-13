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
import DockBar from './components/dock-bar';
import './App.css';
import ErrorPage from './pages/error-page'
import NotFoundPage from './pages/not-found-page'
import ProfilePage from './pages/profile-page'
import { Navbar } from './components/nav-bar'

const queryClient = new QueryClient()

function App() {
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      const handler = (message: any) => {
        if (message?.Type === "refresh") {
          window.close();
        }
      };
      chrome.runtime.onMessage.addListener(handler);
      return () => {
        chrome.runtime.onMessage.removeListener(handler);
      };
    };
  }, []);

  const location = useLocation();
  const [width, setWidth] = useState(DEFAULT_PAGE_WIDTH);
  const [height, setHeight] = useState(DEFAULT_PAGE_HEIGHT);
  const [shouldShowNavbar, setShouldShowNavbar] = useState(true);

  const handleResize = (newWidth: number, newHeight: number) => {
    setWidth(newWidth);
    setHeight(newHeight);
  };

  const hideDockBarRoutes = ["/login", "/ongoing", "/history", "/error", "/profile", "*"];
  const shouldShowDockBar = !hideDockBarRoutes.includes(location.pathname);

  const hideNavBarRoutes = ["/", "/login", "/ongoing", "/home", "/error", "*"];
  const shouldShowNavbarFromRoutes = !hideNavBarRoutes.includes(location.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        {shouldShowNavbar && shouldShowNavbarFromRoutes && <Navbar
          width={width}
        />}
      </div>
      <div
        className="bg-white overflow-y-visible flex flex-col relative"
        style={{ width: `${width}px`, height: `${shouldShowNavbar && shouldShowNavbarFromRoutes ? height - 40 : height}px` }}
      >
        <Toaster position='top-center' theme='dark' richColors />
        <Routes>
          <Route path="/" element={<HomePage onResize={handleResize} />} />
          <Route path="/login" element={<LoginPage onResize={handleResize} />} />
          <Route path="/ongoing" element={<InterviewOngoingPage onResize={handleResize} />} />
          <Route path="/home" element={<HomePage onResize={handleResize} />} />
          <Route path="/history" element={<HistoryPage onResize={handleResize} />} />
          <Route path="/profile" element={<ProfilePage onResize={handleResize} setShouldShowNavbar={setShouldShowNavbar} />} />
          <Route path="/error" element={<ErrorPage onResize={handleResize} />} />
          <Route path="*" element={<NotFoundPage onResize={handleResize} />} />
        </Routes>
        {shouldShowDockBar && <DockBar />}
      </div >
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App