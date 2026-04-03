# import sqlite3

# def get_answer_from_archive(question: str):
#     """
#     Эта функция ищет информацию в документах и выдает ответ.
#     """
#     conn = sqlite3.connect('archive.db')
#     cursor = conn.cursor()
    
#     # 1. Сначала ищем ключевые слова из вопроса в нашей базе документов
#     # Например, если в вопросе есть "Байтемиров", ищем его в таблице chunks
#     keywords = question.split()
#     search_term = f"%{keywords[-1]}%" # Берем последнее слово для примера
    
#     cursor.execute("SELECT chunk_text FROM chunks WHERE chunk_text LIKE ?", (search_term,))
#     result = cursor.fetchone()
#     conn.close()
    
#     if result:
#         # Если нашли текст в документах
#         return f"Согласно архивам: {result[0][:300]}..." 
#     else:
#         return "К сожалению, в архивных документах такой информации не найдено."

# # Давай добавим функцию для загрузки документов в базу (из папки documents)
# def upload_documents_to_db():
#     import os
#     conn = sqlite3.connect('archive.db')
#     cursor = conn.cursor()
    
#     doc_path = 'documents' # Путь к папке с файлами .txt
#     if not os.path.exists(doc_path):
#         print(f"Папка {doc_path} не найдена!")
#         return

#     for filename in os.listdir(doc_path):
#         if filename.endswith('.txt'):
#             with open(os.path.join(doc_path, filename), 'r', encoding='utf-8') as f:
#                 content = f.read()
#                 # Сохраняем весь документ
#                 cursor.execute("INSERT INTO documents (filename, content) VALUES (?, ?)", (filename, content))
#                 doc_id = cursor.lastrowid
                
#                 # Режем на куски (чанки) для удобства поиска
#                 chunks = [content[i:i+500] for i in range(0, len(content), 400)]
#                 for i, chunk in enumerate(chunks):
#                     cursor.execute("INSERT INTO chunks (document_id, chunk_text, chunk_index) VALUES (?, ?, ?)", 
#                                    (doc_id, chunk, i))
    
#     conn.commit()
#     conn.close()
#     print("Все документы загружены и разбиты на части!")

import sqlite3

def get_answer_from_archive(question: str):
    conn = sqlite3.connect('archive.db')
    cursor = conn.cursor()
    
    # 1. Приводим вопрос к нижнему регистру и убираем лишнее
    clean_question = question.lower()
    
    # 2. Извлекаем слова для поиска (длиннее 3 символов)
    words = [w.strip("?,.!") for w in clean_question.split() if len(w) > 3]
    
    if not words:
        return "Пожалуйста, задайте более конкретный вопрос (например, фамилию)."

    # 3. Ищем куски текста, где есть ХОТЯ БЫ ОДНО из слов вопроса
    # Мы будем искать по первым 4-5 буквам слов, чтобы не бояться окончаний
    search_results = []
    for word in words:
        search_term = f"%{word[:5]}%" 
        cursor.execute("SELECT chunk_text FROM chunks WHERE LOWER(chunk_text) LIKE ?", (search_term,))
        rows = cursor.fetchall()
        for row in rows:
            if row[0] not in search_results:
                search_results.append(row[0])

    conn.close()
    
    if search_results:
        # Берем первые 2 самых подходящих куска
        combined_text = "\n\n---\n\n".join(search_results[:2])
        return f"Найдено в архивных документах:\n\n{combined_text}"
    else:
        return "В документах архива не удалось найти информацию по вашему запросу. Попробуйте ввести только фамилию."