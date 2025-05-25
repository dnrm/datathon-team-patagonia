import { NextResponse } from 'next/server';

export async function GET() {
  // This is a placeholder API endpoint
  // In a real application, you would fetch this data from your database
  // For now, we'll throw an error to demonstrate the error handling in the frontend
  return NextResponse.error();
  
  // When you're ready to implement the real API, you can use this response:
  /*
  return NextResponse.json([
    {
      name: "Emergency Fund",
      description: "Build a 6-month emergency fund",
      startingAmount: 5000,
      changePercentage: 15
    },
    {
      name: "Retirement Savings",
      description: "Increase retirement contributions",
      startingAmount: 50000,
      changePercentage: 8
    },
    {
      name: "Debt Reduction",
      description: "Pay off credit card debt",
      startingAmount: 8000,
      changePercentage: -25
    }
  ]);
  */
} 