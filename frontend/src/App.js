import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MagicListing from './pages/MagicListing';
import Products from './pages/Products';
import DraftsStudio from './pages/DraftsStudio';
import TaskManager from './pages/TaskManager';
import Autopilot from './pages/Autopilot';
import Reports from './pages/Reports';
import Integrations from './pages/Integrations';
import AIMemory from './pages/AIMemory';
import AgentDetail from './pages/AgentDetail';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/magic" element={<MagicListing />} />
            <Route path="/products" element={<Products />} />
            <Route path="/studio" element={<DraftsStudio />} />
            <Route path="/tasks" element={<TaskManager />} />
            <Route path="/autopilot" element={<Autopilot />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/memory" element={<AIMemory />} />
            <Route path="/agent/:slug" element={<AgentDetail />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
