import { Header } from './header/Header.tsx'
import { CardList } from './cardlist/CardList.tsx'

import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css'

function AppContent() {
  return (
    <div>
      <Header />
      <CardList />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
      </Routes>
    </Router>
  );
}