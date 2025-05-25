from fastapi import APIRouter, Body
from fastapi.responses import JSONResponse
import pandas as pd
import joblib
import numpy as np

router = APIRouter()

# --- Cargar modelo entrenado ---
modelo_data = joblib.load("modelo/modeloIncremento.pkl")
modelo = modelo_data["modelo_clf"]
label_encoder = modelo_data["label_encoder"]
features = modelo_data["features"]

obj = joblib.load("modelo/modelo_dual.pkl")
modelo_cls = obj["modelo_cls"]
modelo_reg = obj["modelo_reg"]
cliente_map = obj["map_cliente"]
comercio_map = obj["map_comercio"]
giro_map = obj["map_giro"]
tipo_map = obj["map_tipo"]


# --- Mapeo de categorías (como se usó en entrenamiento) ---
def generar_mapas(df):
    giro_map = {v: i for i, v in enumerate(df["giro_comercio"].astype(str).unique())}
    tipo_map = {v: i for i, v in enumerate(df["tipo_venta"].astype(str).unique())}
    return giro_map, tipo_map

# --- Clasificación del incremento (no se usa directamente, pero se mantiene si lo requieres) ---
def clasificar_incremento(x):
    if x > 50:
        return "alto"
    elif x > 10:
        return "moderado"
    elif x >= -10:
        return "estable"
    else:
        return "bajo"

def predecir_incremento_func(movements):
    # movements es una lista de Transaction o dicts
    if movements and isinstance(movements[0], dict):
        df = pd.DataFrame(movements)
    else:
        df = pd.DataFrame([{
            "id": t.id,
            "fecha": t.date,
            "comercio": t.merchant,
            "giro_comercio": t.merchant_category,
            "tipo_venta": t.sale_type,
            "monto": t.amount
        } for t in movements])

    df.columns = df.columns.str.strip()
    df["fecha"] = pd.to_datetime(df["fecha"])
    df["mes"] = df["fecha"].dt.month
    df["anio"] = df["fecha"].dt.year
    df_2022 = df[df["anio"] == 2022]

    for col in ["id", "comercio", "giro_comercio", "tipo_venta"]:
        df_2022[col] = df_2022[col].astype(str).str.strip()

    giro_map, tipo_map = generar_mapas(df_2022)
    df_2022["giro_id"] = df_2022["giro_comercio"].map(giro_map).fillna(-1).astype(int)
    df_2022["tipo_venta_id"] = df_2022["tipo_venta"].map(tipo_map).fillna(-1).astype(int)

    agg_monto = df_2022.groupby(["id", "comercio", "mes"])["monto"].sum().reset_index()
    pivot = agg_monto.pivot(index=["id", "comercio"], columns="mes", values="monto").fillna(0)
    pivot.columns = [f"mes_{col}" for col in pivot.columns]

    agg_features = df_2022.groupby(["id", "comercio"]).agg({
        "giro_id": lambda x: x.mode()[0] if not x.mode().empty else -1,
        "tipo_venta_id": lambda x: x.mode()[0] if not x.mode().empty else -1
    }).reset_index()

    pivot = pivot.merge(agg_features, on=["id", "comercio"], how="left")

    for m in range(1, 8):
        col = f"mes_{m}"
        if col not in pivot.columns:
            pivot[col] = 0.0

    X_pred = pivot[features]

    y_proba = modelo.predict_proba(X_pred)
    clases = label_encoder.classes_

    resultados = []
    pivot_reset = pivot.reset_index()
    for i, row in pivot_reset.iterrows():
        cliente = row["id"]
        comercio = row["comercio"]
        resultado = {
            "id": cliente,
            "comercio": comercio
        }
        for j, clase in enumerate(clases):
            resultado[f"prob_{clase}"] = round(y_proba[i][j] * 100, 2)
        resultados.append(resultado)

    return resultados

def cambio_mensual_func(movements):
    if movements and isinstance(movements[0], dict):
        df = pd.DataFrame(movements)
    else:
        df = pd.DataFrame([{
            "id": t.id,
            "fecha": t.date,
            "comercio": t.merchant,
            "giro_comercio": t.merchant_category,
            "tipo_venta": t.sale_type,
            "monto": t.amount
        } for t in movements])

    df.columns = df.columns.str.strip()
    df["fecha"] = pd.to_datetime(df["fecha"])
    df["mes"] = df["fecha"].dt.month
    df["anio"] = df["fecha"].dt.year

    df_2022 = df[df["anio"] == 2022]

    gasto_mensual = df_2022.groupby("mes")["monto"].sum().sort_index()
    cambios_pct = gasto_mensual.pct_change() * 100

    meses_nombres = {
        1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril", 5: "Mayo", 6: "Junio",
        7: "Julio", 8: "Agosto", 9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre"
    }

    resultados = []
    cambios_validos = []
    max_cambio = None
    max_a_mes = None

    trimestre_cambios = {1: [], 2: [], 3: [], 4: []}

    # Lista de gasto por mes para el JSON
    gasto_por_mes = []

    for mes in gasto_mensual.index:
        mes_nombre = meses_nombres.get(mes, str(mes))
        gasto_por_mes.append({
            "mes": mes_nombre,
            "gasto": round(gasto_mensual[mes], 2)
        })

    for mes in cambios_pct.index[1:]:
        cambio = round(cambios_pct[mes], 2)
        mes_nombre = meses_nombres.get(mes, str(mes))
        mes_ant_nombre = meses_nombres.get(mes - 1, str(mes - 1))
        resultados.append({
            "de_mes": mes_ant_nombre,
            "a_mes": mes_nombre,
            "cambio_porcentual": cambio,
            "gasto_mes_anterior": round(gasto_mensual[mes - 1], 2),
            "gasto_mes_actual": round(gasto_mensual[mes], 2)
        })
        cambios_validos.append((mes_ant_nombre, mes_nombre, cambio))
        if max_cambio is None or cambio > max_cambio:
            max_cambio = cambio
            max_de_mes = mes_ant_nombre
            max_a_mes = mes_nombre
        trimestre = ((mes - 1) // 3) + 1
        trimestre_cambios[trimestre].append(cambio)

    promedio_cambio = round(
        sum(c for _, _, c in cambios_validos) / len(cambios_validos), 2
    ) if cambios_validos else 0.0

    trimestre_mas_activo = max(trimestre_cambios.items(), key=lambda x: sum(x[1]) if x[1] else float('-inf'))[0]
    trimestre_nombre = {
        1: "Q1 (Enero-Marzo)",
        2: "Q2 (Abril-Junio)",
        3: "Q3 (Julio-Septiembre)",
        4: "Q4 (Octubre-Diciembre)"
    }[trimestre_mas_activo]

    promedio_monto_mensual = round(gasto_mensual.mean(), 2) if not gasto_mensual.empty else 0.0

    return {
        "promedio_cambio_porcentual": promedio_cambio,
        "promedio_monto_mensual": promedio_monto_mensual,
        "mayor_incremento": {
            "Mes": max_a_mes,
            "cambio_porcentual": max_cambio
        } if max_cambio is not None else None,
        "trimestre_mas_activo": trimestre_nombre,
        "gasto_por_mes": gasto_por_mes
    }

def predictedFuture(movements, modo="suma"):
    """
    Predice los futuros gastos por cliente y comercio usando modelos de clasificación y regresión.
    Recibe una lista movements (Transaction o dict), procesa igual que predict.py.
    Retorna el top 5 comercios por cliente con el monto predicho y el monto total predecido del siguiente año.
    Además, calcula los montos por mes y el total usando la lógica de cambio_mensual_func.
    """
    # Si movements es una lista de Transaction, conviértelo a DataFrame
    if movements and isinstance(movements[0], dict):
        df = pd.DataFrame(movements)
    else:
        df = pd.DataFrame([{
            "id": t.id,
            "fecha": t.date,
            "comercio": t.merchant,
            "giro_comercio": t.merchant_category,
            "tipo_venta": t.sale_type,
            "monto": t.amount
        } for t in movements])

    df.columns = df.columns.str.strip()
    df["fecha"] = pd.to_datetime(df["fecha"], format="%Y-%m-%d")
    df["mes"] = df["fecha"].dt.month
    df["anio"] = df["fecha"].dt.year
    df["dia_semana"] = df["fecha"].dt.dayofweek
    df["trimestre"] = df["fecha"].dt.quarter
    df["es_fin_de_semana"] = df["dia_semana"].isin([5, 6]).astype(int)

    df["id"] = df["id"].astype(str).str.strip()
    df["comercio"] = df["comercio"].astype(str).str.strip()
    df["giro_comercio"] = df["giro_comercio"].astype(str).str.strip()
    df["tipo_venta"] = df["tipo_venta"].astype(str).str.strip()

    df["cliente_id"] = df["id"].map(cliente_map).fillna(-1).astype(int)
    df["comercio_id"] = df["comercio"].map(comercio_map).fillna(-1).astype(int)
    df["giro_id"] = df["giro_comercio"].map(giro_map).fillna(-1).astype(int)
    df["tipo_venta_id"] = df["tipo_venta"].map(tipo_map).fillna(-1).astype(int)

    features = [
        "cliente_id", "comercio_id", "giro_id", "tipo_venta_id",
        "mes", "anio", "dia_semana", "trimestre", "es_fin_de_semana"
    ]

    X = df[features]
    pred_cls = modelo_cls.predict(X)
    prob_cls = modelo_cls.predict_proba(X)[:, 1]
    pred_reg = np.expm1(modelo_reg.predict(X))

    df["prob_compra"] = prob_cls
    df["comprara"] = pred_cls
    df["pred_monto"] = np.where(pred_cls == 1, pred_reg, 0.0)

    result = (
        df.groupby(["id", "comercio"])["pred_monto"].mean().reset_index()
          .sort_values(["id", "pred_monto"], ascending=[True, False])
          .groupby("id")
          .head(5)
    )

    # Calcular montos por mes y total usando la lógica de cambio_mensual_func
    df["mes"] = df["fecha"].dt.month
    monto_por_mes = df.groupby("mes")["pred_monto"].sum().sort_index()
    meses_nombres = {
        1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril", 5: "Mayo", 6: "Junio",
        7: "Julio", 8: "Agosto", 9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre"
    }
    gasto_por_mes = [
        {"mes": meses_nombres.get(mes, str(mes)), "gasto": round(monto, 2)}
        for mes, monto in monto_por_mes.items()
    ]
    total_predicho = round(monto_por_mes.sum(), 2)

    # Solo publica comercio y pred_monto, y agrega el total y los montos por mes
    output = [
        {"comercio": row["comercio"], "pred_monto": row["pred_monto"]*12}
        for _, row in result.iterrows()
    ]
    return {
        "top5": output,
        "total_anual": total_predicho
    }
