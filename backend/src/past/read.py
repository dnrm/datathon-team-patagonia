import os
import json
from collections import defaultdict
import pandas as pd
from datetime import datetime
from src.past.transaction import Transaction
from src.past.person import Person
from src.future.location import *

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    
def readDataFrames():
    personas_path = os.path.join(BASE_DIR, "../../data/base_clientes_final.csv")
    transacciones_path = os.path.join(BASE_DIR, "../../data/base_transacciones_final.csv")

    df_personas = pd.read_csv(personas_path)
    df_transacciones = pd.read_csv(transacciones_path)

    return df_personas, df_transacciones

def total_visitas_en_tienda(tienda):
    json_path = os.path.join(".", "data", "json", "stores", f"{tienda}.json")
    if not os.path.exists(json_path):
        print(f"No se encontró el archivo JSON para la tienda: {tienda}")
        return 0

    with open(json_path, "r", encoding="utf-8") as f:
        transacciones = json.load(f)

    return len(transacciones)

def saveTransaccionesPorUsuario(df_transacciones):
    output_dir = os.path.join(BASE_DIR, "../json")
    os.makedirs(output_dir, exist_ok=True)

    grouped = df_transacciones.groupby("id")

    for user_id, group in grouped:
        trans_list = group.to_dict(orient="records")
        with open(os.path.join(output_dir, f"{user_id}.json"), "w", encoding="utf-8") as f:
            json.dump(trans_list, f, ensure_ascii=False, indent=2)

    print(f"Se guardaron {len(grouped)} archivos JSON en: {output_dir}")

def saveTransaccionesPorTienda(df_transacciones):
    output_dir = os.path.join(BASE_DIR, "data", "json", "stores")
    os.makedirs(output_dir, exist_ok=True)

    grouped = df_transacciones.groupby("comercio")  # Ajusta el nombre de la columna si es necesario

    for tienda, group in grouped:
        trans_list = group.to_dict(orient="records")

        # Limpieza del nombre para evitar errores al guardar archivos
        safe_name = tienda.replace(' ', '_').replace('/', '_').replace('\\', '_')
        filename = f"{safe_name}.json"

        file_path = os.path.join(output_dir, filename)
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(trans_list, f, ensure_ascii=False, indent=2)

    print(f"Se guardaron {len(grouped)} archivos JSON en: {output_dir}")


def readPersonas():
    path = os.path.join(BASE_DIR, "../data/base_clientes_final.csv")
    df = pd.read_csv(path)

    personas = [
        Person(
            row['id'],
            row['fecha_nacim'],
            row['fecha_alta'],
            row['id_municipio'],
            row['id_estado'],
            row['tipo_persona'],
            row.get('genero', ''),
            row.get('actividad_empresarial', '')
        )
        for _, row in df.iterrows()
    ]
    return personas

def get_transaction(user_id):
    # Cambia "./json" por ruta absoluta relativa al proyecto
    project_root = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))
    json_path = os.path.join(project_root, "data/json/person", f"{user_id}.json")

    if not os.path.exists(json_path):
        print(f"No JSON found for user ID: {user_id} (looked in {json_path})")
        return []

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    transactions = [
        Transaction(
            item["id"],
            item["fecha"],
            item["comercio"],
            item["giro_comercio"],
            item["tipo_venta"],
            item["monto"]
        )
        for item in data
    ]
    return transactions

def get_transaction_month(transactions, month):
    return [
        t for t in transactions
        if datetime.strptime(t.date, "%Y-%m-%d").month == month
    ]

def get_transaction_year(transactions, year):
    return [
        t for t in transactions
        if datetime.strptime(t.date, "%Y-%m-%d").year == year
    ]

def get_estado_from_person_id(person_id):
    path = os.path.join(BASE_DIR, "../../data/base_clientes_final.csv")

    df = pd.read_csv(path)

    row = df[df["id"] == person_id]
    if not row.empty:
        raw_state_id = int(row.iloc[0]["id_estado"])
        adjusted_id = raw_state_id - 46  

        name = id_state_name.get(adjusted_id)
        coords = id_state_coordinates.get(adjusted_id)

        return name, coords
    else:
        print(f"No se encontró a la persona con ID: {person_id}")
        return None
