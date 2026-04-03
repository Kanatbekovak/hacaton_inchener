import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);

  useEffect(() => {
    // Используем твой эндпоинт /api/persons/{id}
    fetch(`https://clara-precrural-nonprolixly.ngrok-free.dev/api/persons/${id}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => setPerson(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!person) return <div className="text-center py-20 font-black uppercase tracking-widest animate-pulse">Загрузка дела...</div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
      <button onClick={() => navigate(-1)} className="mb-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors">
        ← Вернуться к списку
      </button>

      <div className="bg-white rounded-[40px] border border-gray-100 p-12 shadow-sm">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter italic">
              {person.full_name}
            </h2>
            <p className="text-red-600 font-bold uppercase tracking-[0.2em] text-xs">
              {person.birth_year} — {person.death_year || '???'}
            </p>
          </div>
          <span className="bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
            Дело №{person.id}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Место жительства</h4>
              <p className="text-slate-700 font-medium">{person.region}, {person.district}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Профессия</h4>
              <p className="text-slate-700 font-medium">{person.occupation || 'Нет данных'}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Обвинение / Статья</h4>
              <p className="text-slate-700 font-medium">{person.charge || 'Информация засекречена'}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Источник</h4>
              <p className="text-slate-700 font-medium text-sm italic">{person.source || 'Государственный архив'}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-10">
          <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Биография и детали дела</h4>
          <p className="text-slate-600 leading-relaxed text-lg italic whitespace-pre-line">
            "{person.biography || 'Текст биографии в процессе оцифровки...'}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonDetails;