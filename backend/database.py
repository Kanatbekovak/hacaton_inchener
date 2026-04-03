import sqlite3

def init_db():
    # Создаем подключение к файлу базы данных
    conn = sqlite3.connect('archive.db')
    cursor = conn.cursor()
    
    # Читаем твой SQL файл, который ты приложил в архиве
    with open('seed.sql', 'r', encoding='utf-8') as f:
        sql_script = f.read()
    
    # Выполняем скрипт создания таблиц
    cursor.executescript(sql_script)
    
    conn.commit()
    conn.close()
    print("База данных успешно инициализирована!")

if __name__ == "__main__":
    init_db()