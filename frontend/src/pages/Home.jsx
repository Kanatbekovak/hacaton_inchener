import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar'; // Импортируем наш новый компонент
import PersonCard from '../components/PersonCard';
import { fetchPersons } from '../services/api';

const Home = ({ t }) => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(false);

  // Состояния фильтров
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Универсальная загрузка
const loadData = async () => {
  setLoading(true);
  // Передаем строго в том порядке, который указали в api.js:
  // 1. Поиск, 2. Регион, 3. Пол, 4. Статус
  const data = await fetchPersons(searchTerm, selectedRegion, selectedGender, selectedStatus);
  setPersons(data);
  setLoading(false);
};

  useEffect(() => {
    loadData();
  }, [selectedRegion, selectedGender, selectedStatus]); // Авто-обновление при смене селектов

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    loadData();
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedRegion('');
    setSelectedGender('');
    setSelectedStatus('');
    // Загружаем чистый список напрямую
    fetchPersons('', '', '', '').then(data => setPersons(data));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10">
      <div className="py-12 text-center">
        <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">{t.home}</h2>
      </div>

      {/* Используем наш новый компонент */}
      <FilterBar 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion}
        selectedGender={selectedGender} setSelectedGender={setSelectedGender}
        selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
        onSearch={handleSearch}
        onReset={handleReset}
        t={t}
      />

      {/* Список */}
      {loading ? (
        <div className="text-center py-20 animate-pulse font-black uppercase text-slate-300">Загрузка...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
          {persons.map(p => <PersonCard key={p.id} person={p} />)}
        </div>
      )}
    </div>
  );
};

export default Home;