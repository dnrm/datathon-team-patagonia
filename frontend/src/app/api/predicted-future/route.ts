import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data based on the provided structure
  const mockData = {
    "top5": [
      {
        "comercio": "OXXO GAS",
        "pred_monto": 697.390038297624
      },
      {
        "comercio": "MERCADOPAGO",
        "pred_monto": 669.044271740041
      },
      {
        "comercio": "IZZI",
        "pred_monto": 643.937427463005
      },
      {
        "comercio": "MERCADO PAGO",
        "pred_monto": 634.361011493649
      },
      {
        "comercio": "MI ATT",
        "pred_monto": 558.055804665599
      }
    ],
    "total_anual": 18086.05
  };

  return NextResponse.json(mockData);
}
