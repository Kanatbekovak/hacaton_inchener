from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
import sqlite3
import os
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai

app = FastAPI(title="Голос из архива API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class PersonResponse(PersonCreate):
    id: int

def get_db_connection():
    conn = sqlite3.connect('archive.db')
    conn.row_factory = sqlite3.Row
    return conn

# ✅ Gemini вместо Groq
genai.configure(api_key="API_KEY_HERE")
model = genai.GenerativeModel("gemini-2.5-flash")

DOCUMENTS_DIR = "documents"

def extract_text_from_file(filepath: str) -> str:
    ext = os.path.splitext(filepath)[1].lower()
    if ext == ".txt":
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    else:
        return f"[Формат {ext} не поддерживается]"

def load_all_documents() -> str:
    if not os.path.exists(DOCUMENTS_DIR):
        return ""
    all_text = []
    for filename in os.listdir(DOCUMENTS_DIR):
        filepath = os.path.join(DOCUMENTS_DIR, filename)
        if os.path.isfile(filepath):
            text = extract_text_from_file(filepath)
            all_text.append(f"=== Документ: {filename} ===\n{text}")
    return "\n\n".join(all_text)

@app.get("/")
def read_root():
    return {"message": "Добро пожаловать в API проекта 'Голос из архива'"}

@app.get("/api/documents")
def list_documents():
    if not os.path.exists(DOCUMENTS_DIR):
        return {"documents": [], "message": "Папка documents/ не найдена"}
    files = [
        {"filename": f, "size_kb": round(os.path.getsize(os.path.join(DOCUMENTS_DIR, f)) / 1024, 2)}
        for f in os.listdir(DOCUMENTS_DIR)
        if os.path.isfile(os.path.join(DOCUMENTS_DIR, f))
    ]
    return {"documents": files, "total": len(files)}

# --- Вопрос по документам из папки ---
@app.post("/api/ask/documents")
async def ask_from_documents(payload: dict = Body(...)):
    user_query = payload.get("query")

    if not user_query or not isinstance(user_query, str):
        return {"response": "Некорректный запрос"}

    context = load_all_documents()

    if not context:
        return {"response": "Папка documents/ пуста или не существует"}

    try:
        prompt = (
            "Ты архивариус проекта 'Голос из архива' — цифрового мемориала жертв сталинских репрессий в Кыргызстане. "
            "Твоя задача — рассказывать истории репрессированных людей на основе архивных документов. "
            "Отвечай подробно, с уважением к памяти людей. "
            "Указывай из какого документа взята информация (название файла или номер дела). "
            "Если спрашивают о конкретном человеке — расскажи всё: кем был, в чём обвинили, что с ним случилось, была ли реабилитация. "
            "Если информации нет — пиши: 'В архиве данных не обнаружено'.\n\n"
            f"Документы:\n{context}\n\nВопрос: {user_query}"
        )

        response = model.generate_content(prompt)
        return {"response": response.text}

    except Exception as e:
        return {"response": f"Ошибка Gemini: {str(e)}"}

# --- Вопрос по БД ---
@app.post("/api/ask")
async def ask_ai(payload: dict = Body(...)):
    user_query = payload.get("query")

    if not user_query or not isinstance(user_query, str):
        return {"response": "Некорректный запрос"}

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, full_name, birth_year, death_year,
               region, occupation, charge, biography, source, status
        FROM persons
        WHERE full_name LIKE ?
    """, (f"%{user_query}%",))
    rows = cursor.fetchall()

    if not rows:
        cursor.execute("""
            SELECT id, full_name, birth_year, death_year,
                   region, occupation, charge, biography, source, status
            FROM persons
        """)
        rows = cursor.fetchall()

    conn.close()

    if not rows:
        return {"response": "База данных пуста"}

    context = "\n\n".join(
        f"[ID: {r['id']}] Имя: {r['full_name']} | "
        f"Годы жизни: {r['birth_year']}–{r['death_year']} | Регион: {r['region']} | "
        f"Профессия: {r['occupation']} | Обвинение: {r['charge']} | Статус: {r['status']}\n"
        f"Биография: {r['biography']}"
        for r in rows
    )

    try:
        prompt = (
            "Ты архивариус проекта 'Голос из архива' — цифрового мемориала жертв сталинских репрессий в Кыргызстане. "
            "Отвечай ТОЛЬКО на основе документов из архива. Каждый документ имеет уникальный ID. "
            "При ответе указывай ID документа из которого взята информация. "
            "Если спрашивают о конкретном человеке — расскажи всё: кем был, в чём обвинили, что с ним случилось, была ли реабилитация. "
            "Если ответа нет — пиши: 'В архиве данных не обнаружено'.\n\n"
            f"Документы из архива:\n{context}\n\nВопрос: {user_query}"
        )

        response = model.generate_content(prompt)
        return {"response": response.text}

    except Exception as e:
        return {"response": f"Ошибка Gemini: {str(e)}"}

@app.get("/api/persons")
def get_persons(search: str = "", region: str = "", status: str = ""):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM persons WHERE 1=1"
    params = []
    if search:
        s = f"%{search}%"
        query += " AND (full_name LIKE ? OR biography LIKE ? OR occupation LIKE ?)"
        params.extend([s, s, s])
    if region:
        query += " AND region LIKE ?"
        params.append(f"%{region.split(' ')[0]}%")
    if status:
        query += " AND status LIKE ?"
        params.append(f"%{status}%")
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
        cursor.execute('''
            INSERT INTO persons
                (full_name, birth_year, death_year, region, district,
                 occupation, charge, biography, source, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            person.full_name, person.birth_year, person.death_year,
            person.region, person.district, person.occupation,
            person.charge, person.biography, person.source, person.status
        ))
        new_id = cursor.lastrowid
        conn.commit()
        return {"id": new_id, "message": "Запись успешно создана"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@app.delete("/api/persons/{person_id}")
def delete_person(person_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM persons WHERE id = ?", (person_id,))
    if cursor.fetchone() is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Запись не найдена")
    cursor.execute("DELETE FROM persons WHERE id = ?", (person_id,))
    conn.commit()
    conn.close()
    return {"message": f"Запись с id {person_id} успешно удалена"}