
# DATATHON2025

Este repositorio contiene scripts y servicios diseñados para el análisis y predicción de transacciones financieras, desarrollados como parte de un reto de datathon.

---

## 📁 Estructura del Proyecto

```
DATATHON2025/
├── data/             # Archivos de entrada (CSV, JSON, etc.)
├── modelo/           # Modelos entrenados y lógica de predicción
├── json/             # Salidas generadas en formato JSON
├── src/              # Código fuente reutilizable (funciones, clases auxiliares)
├── main.py           # Script principal para ejecutar el backend con FastAPI
├── predict.py        # Servicio Flask para predicción de montos (experimental)
├── requirements.txt  # Dependencias del proyecto
└── README.md         # Documentación del proyecto
```

---

## 🚀 Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/datathon2025.git
cd datathon2025
```

### 2. Crea y activa un entorno virtual

```bash
python -m venv venv
source venv/bin/activate      # Para Mac/Linux
venv\Scripts\activate         # Para Windows
```

### 3. Instala las dependencias

```bash
pip install -r requirements.txt
```

---

## ▶️ Ejecución del Proyecto

### Levantar el servidor (FastAPI)

```bash
uvicorn main:app --reload
```

Esto iniciará el servidor en `http://127.0.0.1:8000`, donde podrás acceder a la documentación automática de la API en:

- **Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Redoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🔍 Funcionalidades principales

- Análisis de comportamiento financiero por usuario
- Predicción de montos usando modelos supervisados
- Generación de reportes JSON por categoría
- API RESTful para integración con otros sistemas
