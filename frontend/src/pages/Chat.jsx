import React, { useState } from 'react';

const Chat = ({ t }) => {
  const [query, setQuery] = useState(''); // Текст вопроса
  const [ans, setAns] = useState('');    // Ответ от AI
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setAns(""); // Очищаем старый ответ перед новым запросом

    try {
      const response = await fetch('http://127.0.0.1:8000/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      });

      if (!response.ok) throw new Error('Ошибка сервера');

      const data = await response.json();
      // Убедись, что в Python ты возвращаешь именно {"response": ...}
      setAns(data.response); 
    } catch (error) {
      console.error("Ошибка чата:", error);
      setAns("Не удалось связаться с архивным ИИ. Проверьте, запущен ли бэкенд.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 transition-all mb-20">
      <h2 className="text-2xl font-bold mb-6 italic underline decoration-red-600 uppercase tracking-tighter text-slate-800">
        {t.chat}
      </h2>
      
      <textarea 
        className="w-full bg-slate-50 p-6 rounded-3xl outline-none focus:ring-2 focus:ring-red-100 mb-4 min-h-[150px] text-slate-700 placeholder:text-slate-300 transition-all border-none resize-none" 
        placeholder={t.search}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={loading}
      />
      
      <button 
        onClick={handleAsk}
        disabled={loading || !query.trim()}
        className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] ${
          loading 
          ? 'bg-slate-400 cursor-not-allowed text-slate-200' 
          : 'bg-slate-900 text-white hover:bg-red-700 shadow-slate-200'
        }`}
      >
        {loading ? "Архивариус ищет документы..." : t.ask_btn}
      </button>
      
      {ans && (
        <div className="mt-8 p-8 bg-red-50 rounded-[32px] border-l-8 border-red-700 text-slate-800 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-700">
              Результат анализа ИИ
            </span>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium italic">
            «{ans}»
          </p>
        </div>
      )}
    </div>
  );
};

export default Chat;