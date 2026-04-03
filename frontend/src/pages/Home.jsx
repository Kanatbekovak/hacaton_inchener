import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import PersonCard from '../components/PersonCard';
import { fetchPersons } from '../services/api';


const Home = ({ t }) => {
  const [persons, setPersons] = useState([]); // Используем это вместо mockPersons
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(false);

  const regions = ["Чуйская обл.", "Ошская обл.", "Джалал-Абадская обл.", "Нарынская обл.", "Иссык-Кульская обл.", "Таласская обл.", "Баткенская обл."];

  useEffect(() => {
    loadData();
  }, [selectedRegion]);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchPersons(searchTerm, selectedRegion);
    setPersons(data); // Записываем результат в стейт
    setLoading(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10">
      <div className="py-12 text-center">
        <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">{t.home}</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">Архивная база данных</p>
      </div>

      <div className="max-w-4xl mx-auto mb-16 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-4">
          <div className="relative flex-grow">
            <input 
              className="w-full pl-6 pr-12 py-5 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-slate-100 focus:ring-2 focus:ring-red-100 outline-none transition-all font-medium"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2">
              <img className="w-5 opacity-30" src={assets.search_icon} alt="search" />
            </button>
          </div>

          <select 
            className="px-6 py-5 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-slate-100 focus:ring-2 focus:ring-red-100 outline-none cursor-pointer font-bold text-[11px] uppercase tracking-widest text-slate-500"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">Все регионы</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-300 font-black uppercase tracking-widest animate-pulse">Загрузка...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
          {persons && persons.length > 0 ? (
            persons.map(p => <PersonCard key={p.id} person={p} />)
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-50 rounded-[40px]">
              <p className="text-slate-300 font-bold uppercase tracking-widest text-sm">Ничего не найдено</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;