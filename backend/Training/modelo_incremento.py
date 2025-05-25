import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# --- 1. Cargar y procesar datos ---
df = pd.read_csv("Training/training.csv")
df.columns = df.columns.str.strip()
df["fecha"] = pd.to_datetime(df["fecha"], format="%Y-%m-%d")
df["mes"] = df["fecha"].dt.month
df["anio"] = df["fecha"].dt.year
df_2022 = df[df["anio"] == 2022]

# --- 2. Codificar variables categóricas ---
for col in ["id", "comercio", "giro_comercio", "tipo_venta"]:
    df_2022[col] = df_2022[col].astype(str).str.strip()

giro_map = {v: i for i, v in enumerate(df_2022["giro_comercio"].unique())}
tipo_map = {v: i for i, v in enumerate(df_2022["tipo_venta"].unique())}

df_2022["giro_id"] = df_2022["giro_comercio"].map(giro_map).fillna(-1).astype(int)
df_2022["tipo_venta_id"] = df_2022["tipo_venta"].map(tipo_map).fillna(-1).astype(int)

# --- 3. Gasto mensual por cliente-comercio ---
agg_monto = df_2022.groupby(["id", "comercio", "mes"])["monto"].sum().reset_index()
pivot = agg_monto.pivot(index=["id", "comercio"], columns="mes", values="monto").fillna(0)
pivot.columns = [f"mes_{col}" for col in pivot.columns]

# --- 4. Enriquecer con variables adicionales ---
agg_features = df_2022.groupby(["id", "comercio"]).agg({
    "giro_id": lambda x: x.mode()[0] if not x.mode().empty else -1,
    "tipo_venta_id": lambda x: x.mode()[0] if not x.mode().empty else -1
}).reset_index()

pivot = pivot.merge(agg_features, on=["id", "comercio"], how="left")

# --- 5. Clasificar incremento ---
pivot["delta"] = pivot["mes_8"] - pivot["mes_1"]

def clasificar_incremento(x):
    if x > 50:
        return "alto"
    elif x > 10:
        return "moderado"
    elif x >= -10:
        return "estable"
    else:
        return "bajo"

pivot["clase_inc"] = pivot["delta"].apply(clasificar_incremento)

# --- 6. Features ---
for m in range(1, 8):
    col = f"mes_{m}"
    if col not in pivot.columns:
        pivot[col] = 0.0

features = [f"mes_{m}" for m in range(1, 8)] + ["giro_id", "tipo_venta_id"]
X = pivot[features]
y = pivot["clase_inc"]

# --- 7. Codificación y entrenamiento ---
le = LabelEncoder()
y_encoded = le.fit_transform(y)
X_train, X_val, y_train, y_val = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

clf = GradientBoostingClassifier(n_estimators=100, learning_rate=0.05, max_depth=4, random_state=0)
clf.fit(X_train, y_train)

# --- 8. Guardar modelo entrenado ---
joblib.dump({
    "modelo_clf": clf,
    "label_encoder": le,
    "features": features
}, "modeloIncremento.pkl")
