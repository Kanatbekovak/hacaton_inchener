from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Голос из архива API")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модель данных
class PersonCreate(BaseModel):
    full_name: str
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    region: str
    district: Optional[str] = None
    occupation: Optional[str] = None
    charge: Optional[str] = None
    biography: Optional[str] = None
    source: Optional[str] = None
    status: Optional[str] = None
    # gender: Optional[str] = None 

def get_db_connection():
    conn = sqlite3.connect('archive.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/")
def read_root():
    return {"message": "Добро пожаловать в API проекта 'Голос из архива'"}

# --- ЭНДПОИНТЫ ---

@app.get("/api/persons")
def get_persons(
    search: str = "", 
    region: str = "", 
    gender: str = "", 
    status: str = ""
):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM persons WHERE 1=1"
    params = []
    
    # 1. Поиск по инпуту
    if search:
        s = f"%{search}%"
        query += " AND (full_name LIKE ? OR biography LIKE ? OR occupation LIKE ?)"
        params.extend([s, s, s])
    
    # 2. Фильтр по региону
    if region:
        query += " AND region LIKE ?"
        params.append(f"%{region.split(' ')[0]}%")

    # 3. Фильтр по полу
    if gender:
        query += " AND gender = ?"
        params.append(gender)

    # 4. Фильтр по статусу (ПРИГОВОРУ)
    # Теперь этот блок находится ВНУТРИ функции, как и положено
    if status:
        query += " AND (sentence LIKE ? OR status LIKE ?)"
        params.extend([f"%{status}%", f"%{status}%"])

    cursor.execute(query, params)
    persons = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return persons

@app.get("/api/persons/{person_id}")
def get_person(person_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM persons WHERE id = ?", (person_id,))
    person = cursor.fetchone()
    conn.close()
    
    if person is None:
        raise HTTPException(status_code=404, detail="Человек не найден")
    
    return dict(person)

@app.post("/api/persons", status_code=201)
def create_person(person: PersonCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Убираем gender из списка колонок и один знак вопроса из VALUES
        cursor.execute('''
            INSERT INTO persons (full_name, birth_year, death_year, region, district, occupation, charge, biography, source, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            person.full_name, person.birth_year, person.death_year,
            person.region, person.district, person.occupation,
            person.charge, person.biography, person.source, person.status
            # person.gender  <-- УДАЛИЛИ ОТСЮДА
        ))
        new_id = cursor.lastrowid
        conn.commit()
        return {"id": new_id, "message": "Запись успешно создана"}
    # ... остальной код
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@app.delete("/api/persons/{person_id}")
def delete_person(person_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Проверяем, существует ли такая запись
    cursor.execute("SELECT id FROM persons WHERE id = ?", (person_id,))
    if cursor.fetchone() is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Запись не найдена")
    
    # 2. Удаляем
    cursor.execute("DELETE FROM persons WHERE id = ?", (person_id,))
    conn.commit()
    conn.close()
    
    return {"message": f"Запись с id {person_id} успешно удалена"}