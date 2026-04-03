import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Используем локальный адрес твоего FastAPI
    window.scrollTo(0, 0);
    const API_URL = `http://127.0.0.1:8000/api/persons/${id}`;

    fetch(API_URL, {
      headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true' // оставляем для совместимости
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Person not found');
        return res.json();
      })
      .then(data => {
        setPerson(data);
        setError(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки:", err);
        setError(true);
      });
  }, [id]);

  // Если произошла ошибка (человек не найден)
  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-500 font-black uppercase mb-4 tracking-widest">Ошибка: Дело не найдено</p>
      <button onClick={() => navigate(-1)} className="text-xs font-bold underline">Вернуться назад</button>
    </div>
  );

  // Состояние загрузки
  if (!person) return (
    <div className="flex flex-col items-center justify-center py-40">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
      <div className="text-center font-black uppercase tracking-widest text-slate-400 animate-pulse">Загрузка архивного дела...</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-all group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> {person.full_name ? 'Вернуться к списку' : 'Назад'}
      </button>

      <div className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        {/* Декоративная полоса сверху как на архивных папках */}
        <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter italic leading-tight">
              {person.full_name}
            </h2>
            <div className="inline-block bg-red-50 px-4 py-2 rounded-xl">
              <p className="text-red-600 font-black uppercase tracking-[0.2em] text-xs">
                {person.birth_year || '????'} — {person.death_year || '????'}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
             <span className="bg-slate-900 text-white px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-slate-200">
              Архивное дело №{person.id}
            </span>
            <p className="text-[10px] text-slate-300 font-bold mt-2 uppercase tracking-widest italic">{person.status || 'Verified'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
          <div className="space-y-8">
            <div>
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3 border-b border-slate-50 pb-1">География</h4>
              <p className="text-slate-800 font-bold text-lg">{person.region}</p>
              <p className="text-slate-500 font-medium">{person.district}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3 border-b border-slate-50 pb-1">Род деятельности</h4>
              <p className="text-slate-800 font-bold text-lg">{person.occupation || 'Сведения отсутствуют'}</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3 border-b border-slate-50 pb-1">Обвинение и приговор</h4>
              <p className="text-red-900/80 font-bold text-lg leading-snug">{person.charge || 'Данные уточняются'}</p>
              {person.sentence && <p className="mt-2 text-slate-600 font-bold uppercase text-[10px] tracking-wider italic">Приговор: {person.sentence}</p>}
            </div>
            <div>
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3 border-b border-slate-50 pb-1">Документальный источник</h4>
              <p className="text-slate-500 font-medium text-sm italic leading-relaxed">{person.source || 'Центральный государственный архив'}</p>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-gray-100 pt-10">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full"></span> Биографическая справка
          </h4>
          <div className="bg-slate-50 p-8 rounded-[30px] border border-slate-100">
            <p className="text-slate-700 leading-relaxed text-xl italic font-serif whitespace-pre-line">
              "{person.biography || 'Текст биографии находится на стадии оцифровки и проверки...'}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetails;