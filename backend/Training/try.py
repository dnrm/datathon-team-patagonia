import pandas as pd
import numpy as np
import joblib

# --- 1. Cargar modelos y mappings ---
obj = joblib.load("modelo_dual.pkl")
modelo_cls = obj["modelo_cls"]
modelo_reg = obj["modelo_reg"]
cliente_map = obj["map_cliente"]
comercio_map = obj["map_comercio"]
giro_map = obj["map_giro"]
tipo_map = obj["map_tipo"]

# --- 2. Cargar nuevos datos ---
df = pd.read_csv("book4.csv")
df.columns = df.columns.str.strip()
df["fecha"] = pd.to_datetime(df["fecha"], format="%d/%m/%y")
df["mes"] = df["fecha"].dt.month
df["anio"] = df["fecha"].dt.year
df["dia_semana"] = df["fecha"].dt.dayofweek
df["trimestre"] = df["fecha"].dt.quarter
df["es_fin_de_semana"] = df["dia_semana"].isin([5, 6]).astype(int)

# --- 3. Mapear IDs ---
df["id"] = df["id"].astype(str).str.strip()
df["comercio"] = df["comercio"].astype(str).str.strip()
df["giro_comercio"] = df["giro_comercio"].astype(str).str.strip()
df["tipo_venta"] = df["tipo_venta"].astype(str).str.strip()

# IDs codificados (con fallback a -1)
df["cliente_id"] = df["id"].map(cliente_map).fillna(-1).astype(int)
df["comercio_id"] = df["comercio"].map(comercio_map).fillna(-1).astype(int)
df["giro_id"] = df["giro_comercio"].map(giro_map).fillna(-1).astype(int)
df["tipo_venta_id"] = df["tipo_venta"].map(tipo_map).fillna(-1).astype(int)

# --- 4. Preparar features ---
features = [
    "cliente_id", "comercio_id", "giro_id", "tipo_venta_id",
    "mes", "anio", "dia_semana", "trimestre", "es_fin_de_semana"
]
X = df[features]

# --- 5. Predicción dual ---
pred_cls = modelo_cls.predict(X)
prob_cls = modelo_cls.predict_proba(X)[:, 1]
pred_reg = np.expm1(modelo_reg.predict(X))

# Si el clasificador dice que NO compra, forzamos monto predicho = 0
df["prob_compra"] = prob_cls
df["comprara"] = pred_cls
df["pred_monto"] = np.where(pred_cls == 1, pred_reg, 0.0)

# --- 6. Agrupar por cliente y comercio ---
agg = df.groupby(["id", "comercio"])["pred_monto"].sum().reset_index()
agg = agg.sort_values(["id", "pred_monto"], ascending=[True, False])

# --- 7. Top 3 comercios por cliente ---
top3 = agg.groupby("id").head(3)

# --- 8. Guardar resultados ---
top3.to_csv("resultados_prediccion_dual.csv", index=False)
print("✅ Predicciones guardadas en 'resultados_prediccion_dual.csv'")