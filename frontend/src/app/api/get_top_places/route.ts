import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data based on the provided structure
  const mockData = {
    "estado": "Jalisco",
    "categorias": [
      {
        "category": "Train",
        "results": [
          {
            "commerce": "Jose Cuervo Express",
            "address": "Estación de tren de Guadalajara, Guadalajara, Jalisco",
            "latitude": 20.656463,
            "longitude": -103.352146
          }
        ]
      },
      {
        "category": "Bed and Breakfast",
        "results": [
          {
            "commerce": "Olga Querida B&B Hostal",
            "address": "Pavo 277 (Miguel Blanco y Prisciliano Sánchez), 44100 Guadalajara, Jalisco",
            "latitude": 20.672443,
            "longitude": -103.353382
          },
          {
            "commerce": "Hostel del Refugio",
            "address": "Juan Alvarez, 927 (jesus y cruz verde), 44200 Guadalajara, Jalisco",
            "latitude": 20.684422,
            "longitude": -103.356722
          },
          {
            "commerce": "Villa Calavera",
            "address": "Morelos 1072, Guadalajara, 44160, Jalisco",
            "latitude": 20.676315,
            "longitude": -103.360726
          }
        ]
      },
      {
        "category": "Restaurant",
        "results": [
          {
            "commerce": "La Chata de Guadalajara",
            "address": "Corona 126, Centro, 44100 Guadalajara, Jalisco",
            "latitude": 20.673611,
            "longitude": -103.347222
          },
          {
            "commerce": "Café de la Esquina",
            "address": "Av. México 2903, Ladrón de Guevara, 44650 Guadalajara, Jalisco",
            "latitude": 20.678889,
            "longitude": -103.362500
          }
        ]
      },
      {
        "category": "Unknown",
        "results": []
      }
    ]
  };

  return NextResponse.json(mockData);
}
