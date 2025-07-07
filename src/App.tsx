import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import LoginPage from "./pages/login-page";
import HomePage from './pages/home-page';
import HistoryPage from './pages/history-page';
import { Navbar } from './components/nav-bar';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position='top-center' theme='dark' richColors />
      <div className="w-[400px] h-[500px] bg-white overflow-hidden">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </Router>
      </div >
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App