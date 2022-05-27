import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainPage from './components/MainPage';
import PackagePage from './components/PackagePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<MainPage />}></Route>
        <Route path="/package/:pkg_name" element={<PackagePage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
