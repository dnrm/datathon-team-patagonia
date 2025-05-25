import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Sample data from the endpoint
    const expensesData = {
      "OXXO": {
        "tipo": "mensual",
        "dia_pago": 12,
        "promedio_monto": 15.2453333333333
      },
      "7 ELEVEN": {
        "tipo": "mensual",
        "dia_pago": 16,
        "promedio_monto": 7.30888888888889
      },
      "MI ATT": {
        "tipo": "mensual",
        "dia_pago": 7,
        "promedio_monto": 190.92
      },
      "AMAZON": {
        "tipo": "mensual",
        "dia_pago": 20,
        "promedio_monto": 8.60222222222222
      },
      "SPOTIFY": {
        "tipo": "mensual",
        "dia_pago": 9,
        "promedio_monto": 15.06
      },
      "FARMACIAS GUADALAJARA": {
        "tipo": "mensual",
        "dia_pago": 12,
        "promedio_monto": 12.266
      },
      "CINEPOLIS": {
        "tipo": "mensual",
        "dia_pago": 15,
        "promedio_monto": 16.5566666666667
      },
      "IZZI": {
        "tipo": "mensual",
        "dia_pago": 15,
        "promedio_monto": 50.02
      },
      "AMAZON PRIME": {
        "tipo": "mensual",
        "dia_pago": 16,
        "promedio_monto": 11.62
      },
      "MERCADO PAGO": {
        "tipo": "mensual",
        "dia_pago": 17,
        "promedio_monto": 82.532
      },
      "MELIMAS": {
        "tipo": "mensual",
        "dia_pago": 21,
        "promedio_monto": 15.16
      },
      "GOOGLE": {
        "tipo": "mensual",
        "dia_pago": 25,
        "promedio_monto": 21.28
      },
      "FACEBOOK": {
        "tipo": "mensual",
        "dia_pago": 15,
        "promedio_monto": 136.536
      },
      "MAX": {
        "tipo": "mensual",
        "dia_pago": 26,
        "promedio_monto": 14.64
      },
      "NETFLIX": {
        "tipo": "mensual",
        "dia_pago": 19,
        "promedio_monto": 11.62
      }
    };

    return NextResponse.json(expensesData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch expenses data' },
      { status: 500 }
    );
  }
}