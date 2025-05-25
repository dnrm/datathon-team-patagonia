from collections import Counter
import datetime
import json
import os
from collections import defaultdict
from flask import Flask, request, jsonify
from src.past.read import total_visitas_en_tienda
import requests
from src.future.location import mapeo_categorias

app = Flask(__name__)

def yearly_total_spent(transactions):
    total = sum(t.amount for t in transactions)
    return round(total, 2)

def topCommerce(transactions, top_n=5):
    stats = defaultdict(lambda: {"count": 0, "total": 0.0, "category": None})

    for t in transactions:
        stats[t.merchant]["count"] += 1
        stats[t.merchant]["total"] += t.amount
        stats[t.merchant]["category"] = t.merchant_category  

    sorted_stats = sorted(stats.items(), key=lambda x: x[1]["count"], reverse=True)

    result = [
        {
            "commerce": merchant,
            "count": data["count"],
            "total": round(data["total"], 2),
            "category": data["category"]
        }
        for merchant, data in sorted_stats[:top_n]
    ]

    return result

def favoriteCommerce(transacciones_usuario):
    visitas = defaultdict(int)
    gastos = defaultdict(float)

    for t in transacciones_usuario:
        visitas[t.merchant] += 1
        gastos[t.merchant] += t.amount

    if not visitas:
        return {"error": "El usuario no tiene transacciones registradas."}

    tienda_top = max(visitas.items(), key=lambda x: x[1])[0]
    visitas_usuario = visitas[tienda_top]
    gasto_promedio = round(gastos[tienda_top] / visitas_usuario, 2)

    total_visitas = total_visitas_en_tienda(tienda_top) / 100
    porcentaje_usuario = round(100-(visitas_usuario / total_visitas) * 100,2)

    return {
        "tienda_favorita": tienda_top,
        "visitas_usuario": visitas_usuario,
        "porcentaje_participacion": porcentaje_usuario,
        "gasto_promedio": gasto_promedio
    }

def favoriteCategory(transactions, yearly_total_spent):
    if not transactions:
        return {"error": "No transactions available."}

    stats = defaultdict(lambda: {"count": 0, "total": 0.0})

    for t in transactions:
        category = t.merchant_category
        stats[category]["count"] += 1
        stats[category]["total"] += t.amount

    favorite_category, data = max(stats.items(), key=lambda x: x[1]["count"])
    
    count = data["count"]
    total_spent = data["total"]
    average_spent = round(total_spent / count, 2) if count > 0 else 0.0
    percentage_spent = round((total_spent / yearly_total_spent) * 100, 2) if yearly_total_spent > 0 else 0.0

    return {
        "favorite_category": favorite_category,
        "purchase_count": count,
        "average_spent_in_category": average_spent,
        "percentage_of_total_spent": percentage_spent,
        "total_spent_in_category": round(total_spent, 2)
    }

def topCategories(transactions, top_n=5):
    """
    Returns the top N most frequent merchant categories with total spending.

    Output format:
    [
        {"category": "Groceries", "count": 15, "total": 212.50},
        {"category": "Restaurants", "count": 10, "total": 154.30},
        ...
    ]
    """
    stats = defaultdict(lambda: {"count": 0, "total": 0.0})

    for t in transactions:
        stats[t.merchant_category]["count"] += 1
        stats[t.merchant_category]["total"] += t.amount

    sorted_stats = sorted(
        stats.items(),
        key=lambda x: x[1]["count"],
        reverse=True
    )

    result = [
        {
            "category": category,
            "count": data["count"],
            "total": round(data["total"], 2)
        }
        for category, data in sorted_stats[:top_n]
    ]

    return result

def dayMoreSpent(transactions):
    """
    Returns the date with the highest total spending and the amount spent that day.

    Output format:
    {
        "date": "2024-05-10",
        "total": 345.67,
        "top3_merchants": [
            {"merchant": "AMAZON", "amount": 120.0},
            ...
        ]
    }
    """
    spending_by_day = defaultdict(float)
    merchants_by_day = defaultdict(list)

    for t in transactions:
        spending_by_day[t.date] += t.amount
        merchants_by_day[t.date].append((t.merchant, t.amount))

    if not spending_by_day:
        return json.dumps({"date": None, "total": 0.0, "top3_merchants": []}, indent=4)

    max_day, total = max(spending_by_day.items(), key=lambda x: x[1])

    # Calcular top 3 merchants para ese día
    merchant_totals = defaultdict(float)
    for merchant, amount in merchants_by_day[max_day]:
        merchant_totals[merchant] += amount
    top3 = sorted(merchant_totals.items(), key=lambda x: x[1], reverse=True)[:3]
    top3_merchants = [{"merchant": m, "amount": round(a, 2)} for m, a in top3]

    result = [{
        "date": str(max_day),
        "total": round(total, 2),
        "top3_merchants": top3_merchants
    }]

    return result

def annual_summary(transactions):
    if not transactions:
        return {"error": "No transactions recorded."}

    total_spent = sum(t.amount for t in transactions)
    transaction_days = {t.date for t in transactions}
    total_transactions = len(transactions)
    unique_merchants = {t.merchant for t in transactions}

    return {
        "total_spent": round(total_spent, 2),
        "transaction_days_count": len(transaction_days),
        "total_transactions": total_transactions,
        "unique_merchants_count": len(unique_merchants)
    }

def get_top_places_by_categories(state_name, latitude, longitude, category_ids, radius=10000, limit=3):
    url = "https://api.foursquare.com/v3/places/search"
    headers = {
        "Accept": "application/json",
        "Authorization": "fsq3jRQ+AaizYAQIJjSe31snrDAUyobhW0O3D+lqZnKzk/Q="  # Tu API key
    }

    categorias_resultado = []

    for category_id in category_ids:
        params = {
            "ll": f"{latitude},{longitude}",
            "radius": radius,
            "limit": limit,
            "categories": category_id
        }

        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json().get("results", [])
            places = []

            category_name = None
            for lugar in data:
                if not category_name and lugar.get("categories"):
                    category_name = lugar["categories"][0]["name"]

                places.append({
                    "commerce": lugar.get("name"),
                    "address": lugar.get("location", {}).get("formatted_address"),
                    "latitude": lugar.get("geocodes", {}).get("main", {}).get("latitude"),
                    "longitude": lugar.get("geocodes", {}).get("main", {}).get("longitude")
                })

            categorias_resultado.append({
                "category": category_name if category_name else f"Unknown",
                "results": places
            })
        else:
            print(f"Error con categoría {category_id}: {response.status_code}")
            categorias_resultado.append({
                "category": f"Error ({category_id})",
                "results": []
            })

    return {
        "estado": state_name,
        "categorias": categorias_resultado
    }

def get_id_categorie(categorias):
    ids = []
    for cat in categorias:
        if cat in mapeo_categorias:
            ids.append(mapeo_categorias[cat]["id_foursquare"])
        else:
            print(f"Categoría no encontrada en mapeo: {cat}")
    return ids

def get_top_places(transactions, state_name, latitude, longitude):
    print("Top commer")
    top = topCategories(transactions, 3)
    categorias = [item["category"] for item in top]
    print(categorias)
    category_ids = get_id_categorie(categorias)
    print(category_ids)

    result = get_top_places_by_categories(state_name, latitude, longitude, category_ids, 100000, 3)

    return result

    
