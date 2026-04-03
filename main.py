from fastapi import FastAPI, HTTPException
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