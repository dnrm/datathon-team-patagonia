import json
from collections import defaultdict, Counter
from datetime import datetime
import pandas as pd
from src.past.read import get_transaction

def analizar_gastos_usuario(transactions):
    """
    Para un usuario dado, identifica patrones de pago recurrente:
    - Si es mensual (al menos 3 meses distintos), guarda el día de pago y el promedio del monto.
    - Si es semanal (al menos 3 veces en la misma semana), guarda el día de la semana y el promedio del monto.
    Retorna un dict con la información.
    """
    

    gastos_por_comercio = defaultdict(lambda: {
        "mensual": defaultdict(list),
        "semanal": defaultdict(list)
    })

    for t in transactions:
        fecha = t.date
        if not isinstance(fecha, datetime):
            try:
                fecha = pd.to_datetime(fecha)
            except Exception:
                continue

        mes = fecha.strftime("%Y-%m")
        semana = fecha.strftime("%Y-%U")
        gastos_por_comercio[t.merchant]["mensual"][mes].append((fecha, t.amount))
        gastos_por_comercio[t.merchant]["semanal"][semana].append((fecha, t.amount))

    resultado = {}
    # Para el top 5 comercios
    total_gasto_por_comercio = {}

    for comercio, data in gastos_por_comercio.items():
        # --- Mensual ---
        meses_validos = {k: v for k, v in data["mensual"].items() if len(v) > 0}
        if len(meses_validos) >= 3:
            # Buscar el día más frecuente de pago
            dias_pago = [fecha.day for mes in meses_validos.values() for fecha, _ in mes]
            if dias_pago:
                conteo_dias = Counter(dias_pago)
                dia_mas_frecuente, veces = conteo_dias.most_common(1)[0]
                # Promedio de los montos en ese día
                montos = [monto for mes in meses_validos.values() for fecha, monto in mes if fecha.day == dia_mas_frecuente]
                if len(montos) >= 3:
                    resultado[comercio] = {
                        "tipo": "mensual",
                        "dia_pago": dia_mas_frecuente,
                        "promedio_monto": sum(montos) / len(montos)
                    }
                    # Calcular gasto total y promedio mensual para top 5
                    total_gasto = sum([monto for mes in meses_validos.values() for _, monto in mes])
                    promedio_mensual = total_gasto / len(meses_validos)
                    total_gasto_por_comercio[comercio] = {
                        "total_gastado": total_gasto,
                        "promedio_mensual": promedio_mensual
                    }
                    continue  # Si es mensual, no lo reportes como semanal

        # --- Semanal ---
        semanas_validas = {k: v for k, v in data["semanal"].items() if len(v) >= 3}
        if semanas_validas:
            # Buscar el día de la semana más frecuente (0=Lunes, 6=Domingo)
            dias_semana = [fecha.weekday() for semana in semanas_validas.values() for fecha, _ in semana]
            if dias_semana:
                conteo_dias_sem = Counter(dias_semana)
                dia_semana_mas_frec, veces = conteo_dias_sem.most_common(1)[0]
                montos = [monto for semana in semanas_validas.values() for fecha, monto in semana if fecha.weekday() == dia_semana_mas_frec]
                if len(montos) >= 3:
                    resultado[comercio] = {
                        "tipo": "semanal",
                        "dia_pago": dia_semana_mas_frec,
                        "promedio_monto": sum(montos) / len(montos)
                    }
                    # Para top 5, también considerar gasto semanal como gasto total y promedio mensual
                    total_gasto = sum([monto for semana in semanas_validas.values() for _, monto in semana])
                    # Para promedio mensual, estimar usando semanas/4.345 (promedio semanas por mes)
                    semanas = len(semanas_validas)
                    promedio_mensual = total_gasto / (semanas / 4.345) if semanas else 0
                    total_gasto_por_comercio[comercio] = {
                        "total_gastado": total_gasto,
                        "promedio_mensual": promedio_mensual
                    }


    return resultado

def calcular_top5_comercios(transactions):
    """
    Calcula el top 5 de comercios en los que más se gastó y el promedio mensual gastado en cada uno.
    Retorna una lista de dicts con 'comercio', 'total_gastado' y 'promedio_mensual'.
    """
    from collections import defaultdict
    from datetime import datetime
    import pandas as pd

    gastos_por_comercio = defaultdict(lambda: defaultdict(list))

    for t in transactions:
        fecha = t.date
        if not isinstance(fecha, datetime):
            try:
                fecha = pd.to_datetime(fecha)
            except Exception:
                continue
        mes = fecha.strftime("%Y-%m")
        gastos_por_comercio[t.merchant][mes].append(t.amount)

    resumen = []
    for comercio, meses in gastos_por_comercio.items():
        total_gasto = sum([monto for montos in meses.values() for monto in montos])
        meses_distintos = len(meses)
        promedio_mensual = total_gasto / meses_distintos if meses_distintos else 0
        resumen.append({
            "comercio": comercio,
            "total_gastado": round(total_gasto, 2),
            "promedio_mensual": round(promedio_mensual, 2)
        })

    top5 = sorted(resumen, key=lambda x: x["total_gastado"], reverse=True)[:5]
    return top5


def promedio_gasto_diario(transactions):
    """
    Calcula el promedio de gasto diario del usuario y los tres días de la semana con mayor gasto promedio.
    Retorna un dict con:
    {
        "promedio_diario": float,
        "top3_dias_semana": [
            {"dia_semana": int, "promedio": float}, ...
        ]
    }
    """
    from collections import defaultdict

    if not transactions:
        return {
            "promedio_diario": 0.0,
            "top3_dias_semana": []
        }

    # Gasto total por día (YYYY-MM-DD)
    gasto_por_dia = defaultdict(float)
    # Gasto total por día de la semana (0=Lunes, 6=Domingo)
    gasto_por_dia_semana = defaultdict(list)

    for t in transactions:
        fecha = t.date
        if not isinstance(fecha, datetime):
            try:
                fecha = pd.to_datetime(fecha)
            except Exception:
                continue
        dia_str = fecha.strftime("%Y-%m-%d")
        gasto_por_dia[dia_str] += t.amount
        gasto_por_dia_semana[fecha.weekday()].append(t.amount)

    # Promedio diario
    if gasto_por_dia:
        promedio_diario = sum(gasto_por_dia.values()) / len(gasto_por_dia)
    else:
        promedio_diario = 0.0

    # Promedio por día de la semana
    promedios_semana = []
    for dia, montos in gasto_por_dia_semana.items():
        if montos:
            promedios_semana.append({
                "dia_semana": dia,
                "promedio": sum(montos) / len(montos)
            })
    # Top 3 días de la semana con mayor promedio
    top3 = sorted(promedios_semana, key=lambda x: x["promedio"], reverse=True)[:3]

    return {
        "promedio_diario": round(promedio_diario, 2),
        "top3_dias_semana": [
            {"dia_semana": d["dia_semana"], "promedio": round(d["promedio"], 2)}
            for d in top3
        ]
    }
