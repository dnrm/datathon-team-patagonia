import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import GradientBoostingRegressor, GradientBoostingClassifier
from sklearn.metrics import mean_squared_error, mean_absolute_error, accuracy_score, f1_score
from sklearn.model_selection import train_test_split

# --- 1. Cargar CSVs ---
train_df = pd.read_csv("Training/training.csv")
val_df = pd.read_csv("Training/validation.csv")
test_df = pd.read_csv("Training/test.csv")

# --- 2. Procesar fechas y columnas ---
for df in [train_df, val_df, test_df]:
    df.columns = df.columns.str.strip()
    df["fecha"] = pd.to_datetime(df["fecha"], format="%Y-%m-%d")
    df["mes"] = df["fecha"].dt.month
    df["anio"] = df["fecha"].dt.year
    df["dia_semana"] = df["fecha"].dt.dayofweek
    df["trimestre"] = df["fecha"].dt.quarter
    df["es_fin_de_semana"] = df["dia_semana"].isin([5, 6]).astype(int)

# --- 3. Crear diccionarios de codificación ---
cliente_map = {v: i for i, v in enumerate(train_df["id"].astype(str).str.strip().unique())}
comercio_map = {v: i for i, v in enumerate(train_df["comercio"].astype(str).str.strip().unique())}
giro_map = {v: i for i, v in enumerate(train_df["giro_comercio"].astype(str).str.strip().unique())}
tipo_map = {v: i for i, v in enumerate(train_df["tipo_venta"].astype(str).str.strip().unique())}

# --- 4. Función de mapeo robusto ---
def mapear(df):
    df["id"] = df["id"].astype(str).str.strip()
    df["comercio"] = df["comercio"].astype(str).str.strip()
    df["giro_comercio"] = df["giro_comercio"].astype(str).str.strip()
    df["tipo_venta"] = df["tipo_venta"].astype(str).str.strip()

    df["cliente_id"] = df["id"].map(cliente_map).fillna(-1).astype(int)
    df["comercio_id"] = df["comercio"].map(comercio_map).fillna(-1).astype(int)
    df["giro_id"] = df["giro_comercio"].map(giro_map).fillna(-1).astype(int)
    df["tipo_venta_id"] = df["tipo_venta"].map(tipo_map).fillna(-1).astype(int)
    return df

train_df = mapear(train_df)
val_df = mapear(val_df)
test_df = mapear(test_df)

# --- 5. Agregar columna de clasificación binaria ---
for df in [train_df, val_df, test_df]:
    df["comprara"] = (df["monto"] > 0).astype(int)

# --- 6. Agrupar por cliente y comercio ---
def agregar_por_comercio(df):
    return df.groupby([
        "cliente_id", "comercio_id", "giro_id", "tipo_venta_id",
        "mes", "anio", "dia_semana", "trimestre", "es_fin_de_semana"
    ]).agg(monto=("monto", "sum"), comprara=("comprara", "max")).reset_index()

train_agg = agregar_por_comercio(train_df)
val_agg = agregar_por_comercio(val_df)
test_agg = agregar_por_comercio(test_df)

# --- 7. Limitar valores extremos ---
clip_val = train_agg["monto"].quantile(0.95)
train_agg["monto"] = train_agg["monto"].clip(upper=clip_val)
val_agg["monto"] = val_agg["monto"].clip(upper=clip_val)
test_agg["monto"] = test_agg["monto"].clip(upper=clip_val)

# --- 8. Agregar ejemplos sintéticos ---
ejemplos_sinteticos = pd.DataFrame([
    {
        "cliente_id": -1, "comercio_id": -1, "giro_id": -1, "tipo_venta_id": -1,
        "mes": m, "anio": 2022, "dia_semana": d, "trimestre": (m - 1)//3 + 1,
        "es_fin_de_semana": int(d in [5, 6]), "monto": 0.0, "comprara": 0
    }
    for m in range(1, 13) for d in range(7)
])
train_agg = pd.concat([train_agg, ejemplos_sinteticos], ignore_index=True)

# --- 9. Preparar features y targets ---
features = [
    "cliente_id", "comercio_id", "giro_id", "tipo_venta_id",
    "mes", "anio", "dia_semana", "trimestre", "es_fin_de_semana"
]

X_train = train_agg[features]
y_train_reg = np.log1p(train_agg["monto"])
y_train_cls = train_agg["comprara"]

X_test = test_agg[features]
y_test_reg = np.log1p(test_agg["monto"])
y_test_cls = test_agg["comprara"]

# --- 10. Entrenar modelos ---
reg_model = GradientBoostingRegressor(n_estimators=150, max_depth=4, learning_rate=0.05, random_state=0)
reg_model.fit(X_train, y_train_reg)

cls_model = GradientBoostingClassifier(n_estimators=100, max_depth=4, learning_rate=0.05, random_state=0)
cls_model.fit(X_train, y_train_cls)

# --- 11. Guardar modelos ---
joblib.dump({
    "modelo_reg": reg_model,
    "modelo_cls": cls_model,
    "map_cliente": cliente_map,
    "map_comercio": comercio_map,
    "map_giro": giro_map,
    "map_tipo": tipo_map
}, "modelo_dual.pkl")

# --- 12. Evaluar métricas ---
y_pred_reg = np.expm1(reg_model.predict(X_test))
y_true_reg = np.expm1(y_test_reg)

rmse = np.sqrt(mean_squared_error(y_true_reg, y_pred_reg))
mae = mean_absolute_error(y_true_reg, y_pred_reg)
mape_all = np.mean(np.abs((y_true_reg - y_pred_reg) / np.maximum(y_true_reg, 1))) * 100

mask = y_true_reg > 10
mape_filtered = np.mean(np.abs((y_true_reg[mask] - y_pred_reg[mask]) / y_true_reg[mask])) * 100

def mape_segment(y_true, y_pred, min_val, max_val):
    mask = (y_true >= min_val) & (y_true < max_val)
    if mask.sum() == 0:
        return np.nan
    return np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100

mape_low = mape_segment(y_true_reg, y_pred_reg, 0, 50)
mape_mid = mape_segment(y_true_reg, y_pred_reg, 50, 200)
mape_high = mape_segment(y_true_reg, y_pred_reg, 200, 10000)

# Clasificación
y_pred_cls = cls_model.predict(X_test)
acc = accuracy_score(y_test_cls, y_pred_cls)
f1 = f1_score(y_test_cls, y_pred_cls)

print("\n📊 MÉTRICAS DE REGRESIÓN TEST:")
print(f"✅ RMSE: {rmse:.2f}")
print(f"✅ MAE:  {mae:.2f}")
print(f"✅ MAPE (total):     {mape_all:.2f}%")
print(f"✅ MAPE (> $10):     {mape_filtered:.2f}%")
print(f"✅ MAPE ($0–50):     {mape_low:.2f}%")
print(f"✅ MAPE ($50–200):   {mape_mid:.2f}%")
print(f"✅ MAPE ($200+):     {mape_high:.2f}%")

print("\n📊 MÉTRICAS DE CLASIFICACIÓN TEST:")
print(f"✅ Accuracy: {acc:.2f}")
print(f"✅ F1 Score: {f1:.2f}")