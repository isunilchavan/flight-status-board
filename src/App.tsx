import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FlightBoard from './components/FlightBoard';
import FlightDetail from './components/FlightDetail';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold text-gray-900">Flight Status Board</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<FlightBoard />} />
            <Route path="/flight/:id" element={<FlightDetail />} />
          </Routes>
        </main>

        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;