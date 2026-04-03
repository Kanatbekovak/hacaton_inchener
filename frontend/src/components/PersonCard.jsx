import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const PersonCard = ({ person, onDelete }) => {
  
  const handleDeleteClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    // Теперь, когда onDelete передана из Home.jsx, ошибки не будет
    if (onDelete) {
      onDelete(person.id, person.full_name);
    }
  };

  return (
    <Link to={`/person/${person.id}`} className="block group">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
        <div className="aspect-video bg-slate-50 rounded-xl mb-4 flex items-center justify-center text-xs font-bold text-slate-300 uppercase tracking-widest overflow-hidden">
          {person.region || 'Регион не указан'}
        </div>
        
        <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">
          {person.full_name}
        </h3>
        
        <p className="text-[11px] text-gray-400 mb-4 font-medium uppercase tracking-wider">
          {person.birth_year ? `${person.birth_year} г.р.` : 'Год не указан'} • {person.district || 'Район не указан'}
        </p>

        <div className="pt-4 border-t border-gray-50 mt-auto">
          <p className="text-xs text-slate-600 line-clamp-2 italic mb-4">
            {person.biography || "Биография в процессе обработки..."}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase">
              {person.status}
            </span>
            
            <div className="flex items-center gap-3">
              <button className="text-red-600 font-bold text-[10px] uppercase tracking-widest hover:underline transition-all">
                Подробнее
              </button>
              
              {/* Кнопка удаления с иконкой */}
              <button 
                onClick={handleDeleteClick}
                className="p-2 hover:bg-red-50 rounded-full transition-colors group/bin"
              >
                <img 
                  className="w-5 opacity-20 group-hover/bin:opacity-100 transition-opacity" 
                  src={assets.bin_icon} 
                  alt="Удалить" 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PersonCard;