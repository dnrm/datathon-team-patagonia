# api/routes.py

from fastapi import APIRouter
from src.past.read import *
from src.past.wrapped import *
from src.past.frequency import *
import json
from src.future.incremento import *
import pandas as pd
from datetime import datetime
import calendar

router = APIRouter()

# Configura tu usuario y fechas
user_id = "6895dcebb7d7daf7e40aae43a2ea0cce91bffd4d"
month = 5
year = 2022
movements = get_transaction(user_id)
movements_year = get_transaction_year(movements, year)
movements_month = get_transaction_month(movements_year, month)
total_spend = yearly_total_spent(movements_year)
state_name, coord = get_estado_from_person_id(user_id)

# 6895dcebb7d7daf7e40aae43a2ea0cce91bffd4d

# Sample path for the CSV file - change this to your actual path
CSV_PATH = "data/base_transacciones_final.csv"

def read_and_process_data():
    try:
        # Read the CSV file
        df = pd.read_csv(CSV_PATH)
        
        # Convert fecha to datetime
        # sample format: 2022-01-01
        df['fecha'] = pd.to_datetime(df['fecha'], format='%Y-%m-%d')
        
        # Extract month and year
        df['month'] = df['fecha'].dt.month
        df['year'] = df['fecha'].dt.year
        
        return df
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return None

#Get id_user
@app.get("/get-id-user")
def get_id_user():
    return user_id
    
#Slider 1
#http://localhost:8000/top-commerce-year/2022
@router.get("/top-commerce-year/{year}")
def get_top_commerce(year: int):
    filtered = get_transaction_year(movements, year)
    return topCommerce(filtered)

#Slider 2
#http://localhost:8000/favorite-commerce/2022
@router.get("/favorite-commerce/{year}")
def get_favorite_commerce(year: int):
    filtered = get_transaction_year(movements, year)
    return favoriteCommerce(filtered)

#Slider 3
#http://localhost:8000/day-more-spent
@router.get("/day-more-spent")
def get_day_more_spent():
    return dayMoreSpent(movements_year)

#Slider 4
#http://localhost:8000/favorite-categorie
@router.get("/favorite-categorie")
def get_top_categories():
    return favoriteCategory(movements_year, total_spend)

#Slider 5
#http://localhost:8000/average-spending-daily
@router.get("/average-spending-daily")
def get_promedio_gasto_diario_router():
    resultado = promedio_gasto_diario(movements_year)
    return resultado 

#Slider 7
#http://localhost:8000/annual-summary
@router.get("/annual-summary")
def get_annual_summary():
    resumen = annual_summary(movements_year)
    return resumen 

## Slider de predicciones


# Los POST para ML también están bien:
@router.get("/predecir-incremento/{user_id}")
def predecir_incremento(user_id: str):
    try:
        transactions = get_transaction(user_id)
        resultados = cambio_mensual_func(transactions)
        return JSONResponse(content=resultados)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

#Slider 1 future
#http://localhost:8000/cambio-mensual
@router.get("/cambio-mensual")
def cambio_mensual():
    try:
        resultados = cambio_mensual_func(movements_year)
        return JSONResponse(content=resultados)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
# Slider 2 - Nuevos lugares
#Maneja el error para "category": "Unknown",
@router.get("/get_top_places")
def get_top_places_coord():
    return get_top_places(movements_year, state_name, coord[0], coord[1])

#Slider 3 future
#http://localhost:8000/predicted-future
@router.get("/predicted-future")
def get_predicted_future():
    result = predictedFuture(movements_year)
    return result

# Slider 4
#http://127.0.0.1:8000/subscriptions
@router.get("/subscriptions")
def subscriptions():
    result = analizar_gastos_usuario(movements_year)
    
    ordenado = sorted(result.items(), key=lambda item: item[1]["promedio_monto"], reverse=True)
    top_5 = dict(ordenado[:5])
    
    return top_5



@router.get("/monthly-spending")
def get_monthly_spending():
    df = read_and_process_data()
    if df is None:
        return {"error": "Could not read data"}
    
    # Group by month and sum the amounts
    monthly_data = df.groupby('month')['monto'].sum().reset_index()
    
    # Sort by month
    monthly_data = monthly_data.sort_values('month')
    
    # Create labels with month names
    labels = [calendar.month_name[month] for month in monthly_data['month']]
    
    # Prepare the response in Chart.js format
    response = {
        "labels": labels,
        "datasets": [{
            "label": "Monthly Spending",
            "data": monthly_data['monto'].tolist(),
            "fill": False,
            "borderColor": 'rgb(75, 192, 192)',
            "tension": 0.1
        }]
    }
    
    return response

@router.get("/spending-by-category")
def get_spending_by_category():
    df = read_and_process_data()
    if df is None:
        return {"error": "Could not read data"}
    
    # Group by category (giro_comercio) and sum the amounts
    category_data = df.groupby('giro_comercio')['monto'].sum().reset_index()
    
    # Sort by amount spent in descending order and get top 10
    category_data = category_data.sort_values('monto', ascending=False).head(10)
    
    # Generate random colors for each category
    colors = [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)',
        'rgb(199, 199, 199)',
        'rgb(83, 102, 255)',
        'rgb(255, 99, 255)',
        'rgb(64, 159, 133)'
    ]
    
    # Prepare the response in Chart.js format
    response = {
        "labels": category_data['giro_comercio'].tolist(),
        "datasets": [{
            "label": "Spending by Category",
            "data": category_data['monto'].tolist(),
            "backgroundColor": colors[:len(category_data)],
            "hoverOffset": 4
        }]
    }
    
    return response



# API de calendario
#http://127.0.0.1:8000/analizar-gastos-usuario
@router.get("/analizar-gastos-usuario")
def analizar_gastos_usuario_router():
    result = analizar_gastos_usuario(movements_year)
    return result