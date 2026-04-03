import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from "../assets/assets";

const Header = ({ t, lang, setLang }) => {
  const location = useLocation();
  
  const navLinks = [
    { path: "/", label: t.home },
    { path: "/chat", label: t.chat },
    { path: "/add", label: t.add },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white backdrop-blur-xl border-b border-gray-100 z-[100] px-12 flex items-center justify-between">
      
      {/* Логотип */}
      <Link to="/" className="flex-1">
        <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
          {t.title}
        </h1>
      </Link>

      {/* Центральная навигация (вместо сайдбара) */}
      <nav className="flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.2em]">
        {navLinks.map((link) => (
          <Link 
            key={link.path}
            to={link.path} 
            className={`transition-all duration-300 pb-1 border-b-2 ${
              location.pathname === link.path 
              ? 'text-red-600 border-red-600' 
              : 'text-slate-400 border-transparent hover:text-slate-900 hover:border-slate-200'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Правая часть: Язык и Кнопка */}
      <div className="flex-1 flex justify-end items-center gap-8">
        <button 
          onClick={() => setLang(lang === 'ru' ? 'kg' : 'ru')}
          className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
        >
          {lang}
        </button>
        <button>
          <img 
            className="w-5 cursor-pointer"
            src={assets.profile_icon} alt="" />
        </button>
      </div>
    </header>
  );
};

export default Header;