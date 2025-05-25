import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data based on the provided structure
  const mockData = {
    "promedio_cambio_porcentual": 20.07,
    "promedio_monto_mensual": 1623.75,
    "mayor_incremento": {
      "Mes": "Marzo",
      "cambio_porcentual": 207.8
    },
    "trimestre_mas_activo": "Q1 (Enero-Marzo)",
    "gasto_por_mes": [
      {
        "mes": "Enero",
        "gasto": 1104.83
      },
      {
        "mes": "Febrero",
        "gasto": 775.49
      },
      {
        "mes": "Marzo",
        "gasto": 2386.93
      },
      {
        "mes": "Abril",
        "gasto": 1186.38
      },
      {
        "mes": "Mayo",
        "gasto": 1938.39
      },
      {
        "mes": "Junio",
        "gasto": 1295.7
      },
      {
        "mes": "Julio",
        "gasto": 1845.55
      },
      {
        "mes": "Agosto",
        "gasto": 1517.09
      },
      {
        "mes": "Septiembre",
        "gasto": 1910.53
      },
      {
        "mes": "Octubre",
        "gasto": 1735.02
      },
      {
        "mes": "Noviembre",
        "gasto": 1691.63
      },
      {
        "mes": "Diciembre",
        "gasto": 2097.41
      }
    ]
  };

  return NextResponse.json(mockData);
}
