import json
import sqlite3

def import_from_json():
    conn = sqlite3.connect('archive.db')
    cursor = conn.cursor()

    with open('seed.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    for item in data:
        cursor.execute('''
            INSERT OR IGNORE INTO persons 
            (id, full_name, birth_year, death_year, region, district, occupation, charge, biography, source, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            item.get('id'), item.get('full_name'), item.get('birth_year'),
            item.get('death_year'), item.get('region'), item.get('district'),
            item.get('occupation'), item.get('charge'), item.get('biography'),
            item.get('source'), item.get('status')
        ))

    conn.commit()
    conn.close()
    print("Данные из JSON успешно загружены!")

if __name__ == "__main__":
    import_from_json()