import { motion } from 'framer-motion';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Analytics from './components/Analytics/Analytics';
import ChatInterface from './components/Chat/ChatInterface';
import Dashboard from './components/Dashboard/Dashboard';
import DocumentViewer from './components/Document/DocumentViewer';
import Layout from './components/Layout/Layout';
import DocumentUpload from './components/Upload/DocumentUpload';
import { AppProvider } from './context/AppContext';
import './index.css';

const MetroBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-secondary-950 via-secondary-900 to-primary-950 opacity-95" />
    
    {/* Metro Rail Lines Animation */}
    <div className="absolute inset-0">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 bg-gradient-to-b from-primary-500/20 to-accent-500/20"
          style={{
            left: `${20 + i * 15}%`,
            height: '120%',
            top: '-10%',
          }}
          animate={{ y: ['-10%', '110%'] }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 1.5,
          }}
        />
      ))}
      
      {/* Horizontal lines */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute h-1 bg-gradient-to-r from-metro-blue/20 to-metro-green/20"
          style={{
            top: `${30 + i * 20}%`,
            width: '120%',
            left: '-10%',
          }}
          animate={{ x: ['-10%', '110%'] }}
          transition={{
            duration: 10 + i * 3,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 2,
          }}
        />
      ))}
    </div>

    {/* Metro Stations */}
    <div className="absolute inset-0">
      {[
        { top: '20%', left: '15%', color: 'metro-blue' },
        { top: '40%', left: '70%', color: 'metro-green' },
        { top: '70%', left: '25%', color: 'metro-orange' },
        { top: '85%', left: '80%', color: 'metro-red' },
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
          <div className={`absolute inset-0 bg-${station.color} rounded-full animate-ping`} />
        </motion.div>
      ))}
    </div>

    {/* Floating particles */}
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary-400/20 rounded-full"
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

    {/* Metro pattern overlay */}
    <div className="absolute inset-0 bg-metro-pattern opacity-5" />
  </div>
);

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-secondary-950 text-white font-metro relative overflow-hidden">
          <MetroBackground />
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
