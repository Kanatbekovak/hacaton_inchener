import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Для перехода на главную после успеха

const AddPerson = ({ t }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    birth_year: '',
    region: '',
    charge: '',
    biography: ''
  });

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Подготавливаем объект ТОЧНО под модель PersonCreate в Python
    const payload = {
      full_name: formData.full_name,
      birth_year: formData.birth_year ? parseInt(formData.birth_year) : null,
      death_year: null, // Добавляем, так как в модели это есть
      region: formData.region || "Не указан", // Гарантируем, что регион не пустой
      district: "", 
      occupation: "",
      charge: formData.charge,
      biography: formData.charge, // Дублируем для надежности
      source: "User Submission",
      status: "pending",
      gender: formData.gender || "male"
    };

    console.log("Отправляем на сервер:", payload);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/persons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Запись успешно добавлена!");
        navigate('/');
      } else {
        // Выводим детальную ошибку от FastAPI в консоль
        const errorData = await response.json();
        console.error("Ошибка от сервера:", errorData);
        alert(`Ошибка: ${JSON.stringify(errorData.detail)}`);
      }
    } catch (error) {
      alert("Сервер не отвечает. Проверь терминал с Python.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">
          {t.add} в архив
        </h2>
        <p className="text-slate-400 text-sm tracking-wide">
          Заполните форму, чтобы увековечить память. Данные попадут в базу мгновенно.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm">
        
        {/* Поле: ФИО */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Полное имя</label>
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
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Год рождения</label>
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
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Регион</label>
            <input 
              type="text"
              required
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 focus:ring-2 focus:ring-red-100 transition-all outline-none"
              placeholder="Напр. Чуйская обл."
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
            />
          </div>
        </div>

        {/* Поле: Описание/Обвинение */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Краткая история / Статья</label>
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
          disabled={loading}
          className={`w-full ${loading ? 'bg-slate-400' : 'bg-slate-900 hover:bg-red-600'} text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 transition-all active:scale-[0.98]`}
        >
          {loading ? 'Отправка...' : 'Подтвердить и отправить'}
        </button>
      </form>
    </div>
  );
};

export default AddPerson;