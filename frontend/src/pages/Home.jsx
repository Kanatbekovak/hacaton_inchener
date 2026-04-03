import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import PersonCard from '../components/PersonCard';
import { fetchPersons } from '../services/api';

const Home = ({ t }) => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await fetchPersons(searchTerm, selectedRegion, selectedGender, selectedStatus);
    setPersons(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedRegion, selectedGender, selectedStatus]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    loadData();
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedRegion('');
    setSelectedGender('');
    setSelectedStatus('');
    loadData();
  };

const deletePerson = async (id, name) => {
    // Подтверждение оставляем, чтобы не удалить случайно кликом
    if (!window.confirm(`Вы уверены, что хотите удалить: ${name}?`)) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/persons/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Просто обновляем данные. Список перерисуется, и карточка исчезнет сама.
        loadData(); 
      } else {
        console.error("Ошибка при удалении на стороне сервера");
      }
    } catch (err) {
      console.error("Сетевая ошибка:", err);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 pt-10">
      <div className="py-12 text-center">
        <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">
          {t.home}
        </h2>
      </div>

      <FilterBar 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion}
        selectedGender={selectedGender} setSelectedGender={setSelectedGender}
        selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
        onSearch={handleSearch}
        onReset={handleReset}
        t={t}
      />

      {loading ? (
        <div className="text-center py-20 animate-pulse font-black uppercase text-slate-300">
          Загрузка...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
          {persons.map(p => (
            <PersonCard 
              key={p.id} 
              person={p} 
              onDelete={deletePerson} // КРИТИЧЕСКИ ВАЖНО: передаем функцию сюда
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;