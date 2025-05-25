"use client";

import SpendingHistoryChart from '@/components/SpendingHistoryChart';

export default function HistorialPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Historial de Gastos</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <SpendingHistoryChart />
      </div>
    </div>
  );
} 