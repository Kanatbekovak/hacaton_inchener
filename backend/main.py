# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware # Импорт CORS
# from pydantic import BaseModel, field_validator
# import sqlite3
# from typing import List, Optional

# app = FastAPI(title="Голос из архива API")

# # 1. ОБЯЗАТЕЛЬНО: Настройка CORS
# # Без этого фронтенд на localhost не сможет получить данные через ngrok
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class PersonCreate(BaseModel):
#     full_name: str
#     birth_year: Optional[int] = None
#     death_year: Optional[int] = None
#     region: Optional[str] = None
#     district: Optional[str] = None
#     occupation: Optional[str] = None
#     charge: Optional[str] = None
#     arrest_date: Optional[str] = None
#     sentence: Optional[str] = None
#     sentence_date: Optional[str] = None
#     rehabilitation_date: Optional[str] = None
#     biography: Optional[str] = None
#     source: Optional[str] = None
#     status: Optional[str] = "pending"

#     @field_validator("full_name")
#     @classmethod
#     def full_name_must_not_be_empty(cls, v: str) -> str:
#         v = v.strip()
#         if not v or v.lower() == "string":
#             raise ValueError("full_name не может быть пустым")
#         return v

# def get_db_connection():
#     conn = sqlite3.connect('archive.db')
#     conn.row_factory = sqlite3.Row
#     return conn

# @app.get("/")
# def read_root():
#     return {"message": "API работает", "status": "online"}

# # 2. УЛУЧШЕННЫЙ ПОИСК: Регистронезависимость и поиск по ФИО
# @app.get("/api/persons")
# def get_persons(search: Optional[str] = None, region: Optional[str] = None):
#     conn = get_db_connection()
#     cursor = conn.cursor()
    
#     query = "SELECT * FROM persons WHERE 1=1"
#     params = []
    
#     if search:
#         # LOWER и LIKE позволяют искать без учета регистра
#         query += " AND LOWER(full_name) LIKE ?"
#         params.append(f"%{search.lower()}%")
    
#     if region:
#         query += " AND region = ?"
#         params.append(region)
        
#     cursor.execute(query, params)
#     persons = [dict(row) for row in cursor.fetchall()]
#     conn.close()
    
#     return persons

# @app.get("/api/persons/{person_id}")
# def get_person(person_id: int):
#     conn = get_db_connection()
#     cursor = conn.cursor()
#     cursor.execute("SELECT * FROM persons WHERE id = ?", (person_id,))
#     person = cursor.fetchone()
#     conn.close()
    
#     if person is None:
#         raise HTTPException(status_code=404, detail="Человек не найден")
    
#     return dict(person)

# @app.post("/api/persons", status_code=201)
# def create_person(person: PersonCreate):
#     conn = get_db_connection()
#     cursor = conn.cursor()
    
#     cursor.execute('''
#         INSERT INTO persons (
#             full_name, birth_year, death_year, region, district, 
#             occupation, charge, biography, source, status
#         )
#         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
#     ''', (
#         person.full_name, person.birth_year, person.death_year,
#         person.region, person.district, person.occupation,
#         person.charge, person.biography, person.source, person.status
#     ))
    
#     new_id = cursor.lastrowid
#     conn.commit()
#     conn.close()
    
#     return {"id": new_id, "message": "Запись успешно создана"}

# @app.delete("/api/persons/{person_id}")
# def delete_person(person_id: int):
#     conn = get_db_connection()
#     cursor = conn.cursor()
#     cursor.execute("SELECT id FROM persons WHERE id = ?", (person_id,))
#     if cursor.fetchone() is None:
#         conn.close()
#         raise HTTPException(status_code=404, detail="Запись не найдена")
    
#     cursor.execute("DELETE FROM persons WHERE id = ?", (person_id,))
#     conn.commit()
#     conn.close()
#     return {"message": f"Запись {person_id} удалена"}


from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator
import sqlite3
from typing import List, Optional

app = FastAPI(title="Голос из архива API")

# Функция для удобного подключения к базе
def get_db_connection():
    conn = sqlite3.connect('archive.db')
    conn.row_factory = sqlite3.Row  # Это позволит получать данные как словари
    return conn

@app.get("/")
def read_root():
    return {"message": "Добро пожаловать в API проекта 'Голос из архива'"}

# Эндпоинт для получения всех репрессированных с поиском
@app.get("/api/persons")
def get_persons(search: Optional[str] = None, region: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM persons WHERE 1=1"
    params = []
    
    if search:
        query += " AND full_name LIKE ?"
        params.append(f"%{search}%")
    
    if region:
        query += " AND region = ?"
        params.append(region)
        
    cursor.execute(query, params)
    persons = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return persons

# Эндпоинт для получения детальной информации об одном человеке
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

# Эндпоинт для добавления нового человека
@app.post("/api/persons", status_code=201)
def create_person(person: PersonCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO persons (full_name, birth_year, death_year, region, district, occupation, charge, biography, source, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        person.full_name, person.birth_year, person.death_year,
        person.region, person.district, person.occupation,
        person.charge, person.biography, person.source, person.status
    ))
    
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return {"id": new_id, "message": "Запись успешно создана"}

# Эндпоинт для удаления человека по ID
@app.delete("/api/persons/{person_id}")
def delete_person(person_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Проверяем, существует ли запись
    cursor.execute("SELECT id FROM persons WHERE id = ?", (person_id,))
    person = cursor.fetchone()
    
    if person is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Человек не найден")
    
    cursor.execute("DELETE FROM persons WHERE id = ?", (person_id,))
    conn.commit()
    conn.close()
    
    return {"message": f"Запись с id={person_id} успешно удалена"}