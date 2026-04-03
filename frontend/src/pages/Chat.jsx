import React, { useState } from 'react';

const Chat = ({ t }) => {
  const [ans, setAns] = useState('');
  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
      <h2 className="text-2xl font-bold mb-6 italic underline decoration-red-600 uppercase tracking-tighter text-slate-800">{t.chat}</h2>
      <textarea className="w-full bg-slate-50 p-6 rounded-3xl outline-none focus:ring-2 focus:ring-red-100 mb-4 min-h-[150px]" placeholder={t.search} />
      <button onClick={() => setAns("Ищу информацию в архивных фондах...")} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition">
        {t.ask_btn}
      </button>
      {ans && <div className="mt-6 p-6 bg-red-50 rounded-2xl border-l-4 border-red-700 text-slate-700 italic">{ans}</div>}
    </div>
  );
};

export default Chat;