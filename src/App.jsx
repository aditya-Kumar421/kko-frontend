import { motion } from "framer-motion";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Analytics from "./components/Analytics/Analytics";
import ChatInterface from "./components/Chat/ChatInterface";
import Dashboard from "./components/Dashboard/Dashboard";
import DocumentViewer from "./components/Document/DocumentViewer";
import Layout from "./components/Layout/Layout";
import DocumentUpload from "./components/Upload/DocumentUpload";

// Context
import { AppProvider } from "./context/AppContext";

import "./index.css";

/**
 * Metro background with animated lines, stations, and particles
 */
const MetroBackground = () => (
  <div className="fixed inset-0 -z+1 overflow-hidden">
    {/* 🔹 Background video */}
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover opacity-10"
    >
      <source src="/assets/Kochi_Metro_Video_Generation.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    Gradient overlay
    <div className="absolute inset-0 bg-gradient-to-br from-secondary-950/60 via-secondary-900/50 to-primary-950/60" />

   

    {/* Metro Stations */}
    <div className="absolute inset-0">
      {[
        { top: "20%", left: "15%", color: "metro-blue" },
        { top: "40%", left: "70%", color: "metro-green" },
        { top: "70%", left: "25%", color: "metro-orange" },
        { top: "85%", left: "80%", color: "metro-red" },
      ].map((station, i) => (
        <motion.div
          key={i}
          className={`absolute w-4 h-4 bg-${station.color} rounded-full shadow-lg`}
          style={{ top: station.top, left: station.left }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
        >
          <div
            className={`absolute inset-0 bg-${station.color} rounded-full animate-ping`}
          />
        </motion.div>
      ))}
    </div>

    {/* Floating particles */}
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>

    {/* Pattern Overlay */}
    <div className="absolute inset-0 bg-metro-pattern opacity-5" />
  </div>
);

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-secondary-950 text-white font-metro relative overflow-hidden">
          {/* Background */}
          <MetroBackground />

          {/* Foreground */}
          <div className="relative z-10">
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<DocumentUpload />} />
                <Route path="/documents/:id" element={<DocumentViewer />} />
                <Route path="/chat" element={<ChatInterface />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </div>

          {/* Toasts */}
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            className="z-50"
          />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;