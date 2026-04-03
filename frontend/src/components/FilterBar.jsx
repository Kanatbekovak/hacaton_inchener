import React from 'react';
import { assets } from '../assets/assets';

const FilterBar = ({ 
  searchTerm, setSearchTerm, 
  selectedRegion, setSelectedRegion,
  selectedGender, setSelectedGender,
  selectedStatus, setSelectedStatus,
  onSearch, onReset, t 
}) => {

  const regions = ["Чуйская обл.", "Ошская обл.", "Джалал-Абадская обл.", "Нарынская обл.", "Иссык-Кульская обл.", "Таласская обл.", "Баткенская обл."];
  const genders = [{id: 'male', label: 'Мужской'}, {id: 'female', label: 'Женский'}];
  
  // Три вида статусов, которые есть в твоей базе
  const statuses = [
    { id: "Расстрел", label: "Расстрел" },
    { id: "ИТЛ", label: "ИТЛ (Лагеря)" },
    { id: "ссылки", label: "Ссылка" }
  ];

  return (
    <div className="max-w-5xl mx-auto mb-16 bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-50">
      <form onSubmit={onSearch} className="space-y-6">
        
        {/* Ряд 1: Поиск */}
        <div className="relative w-full">
          <input 
            className="w-full pl-8 pr-16 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium text-lg"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform">
            <img className="w-6 opacity-40" src={assets.search_icon} alt="search" />
          </button>
        </div>

        {/* Ряд 2: Фильтры */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Регион */}
          <select 
            className="px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none cursor-pointer font-bold text-[11px] uppercase tracking-widest text-slate-500"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">Все регионы</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          {/* Пол */}
          <select 
            className="px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none cursor-pointer font-bold text-[11px] uppercase tracking-widest text-slate-500"
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
          >
            <option value="">Любой пол</option>
            {genders.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
          </select>

          {/* Статус (Приговор) */}
          <select 
            className="px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none cursor-pointer font-bold text-[11px] uppercase tracking-widest text-slate-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Все приговоры</option>
            {statuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>

          {/* Кнопка сброса */}
          <button 
            type="button"
            onClick={onReset}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 transition-colors shadow-lg shadow-slate-200"
          >
            Сбросить всё
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterBar;