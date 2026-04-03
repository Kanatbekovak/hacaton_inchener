import React, { useState } from 'react';

const AddPerson = ({ t }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    birth_year: '',
    region: '',
    charge: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Данные к отправке:", formData);
    alert("Запись отправлена на модерацию!");
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">
          {t.add} в архив
        </h2>
        <p className="text-slate-400 text-sm tracking-wide">
          Заполните форму, чтобы увековечить память. Все данные проходят проверку модератором.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm">
        
        {/* Поле: ФИО */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
            Полное имя
          </label>
          <input 
            type="text"
            required
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 focus:ring-2 focus:ring-red-100 transition-all outline-none"
            placeholder="Иванов Иван Иванович"
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Поле: Год рождения */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
              Год рождения
            </label>
            <input 
              type="number"
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 focus:ring-2 focus:ring-red-100 transition-all outline-none"
              placeholder="1900"
              value={formData.birth_year}
              onChange={(e) => setFormData({...formData, birth_year: e.target.value})}
            />
          </div>

          {/* Поле: Регион */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
              Регион
            </label>
            <input 
              type="text"
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 focus:ring-2 focus:ring-red-100 transition-all outline-none"
              placeholder="Напр. Чуйская обл."
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
            />
          </div>
        </div>

        {/* Поле: Описание/Обвинение */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
            Краткая история / Статья
          </label>
          <textarea 
            rows="4"
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 focus:ring-2 focus:ring-red-100 transition-all outline-none resize-none"
            placeholder="Опишите известные детали..."
            value={formData.charge}
            onChange={(e) => setFormData({...formData, charge: e.target.value})}
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] hover:bg-red-600 shadow-2xl shadow-slate-200 transition-all active:scale-[0.98]"
        >
          Подтвердить и отправить
        </button>
      </form>

      <div className="mt-12 text-center">
        <button className="text-[10px] font-bold text-slate-300 hover:text-red-600 uppercase tracking-widest transition-colors">
          Нужна помощь с заполнением?
        </button>
      </div>
    </div>
  );
};

export default AddPerson;