import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Chat from './pages/Chat';
import { translations } from './constants/translations';
import AddPerson from './pages/AddPerson';
import PersonDetails from './pages/PersonDetails';

function App() {
  const [lang, setLang] = useState('ru');
  const t = translations[lang];

  return (
    <Router>
      <div className="bg-white min-h-screen">
        <Header t={t} lang={lang} setLang={setLang} />
        
        {/* Контент начинается сразу под хедером и на всю ширину */}
        <main className="pt-32 px-12 pb-20">
          <Routes>
            <Route path="/" element={<Home t={t} />} />
            <Route path="/chat" element={<Chat t={t} />} />
            <Route path="/add" element={<AddPerson t={t} />} />
            <Route path="/person/:id" element={<PersonDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;