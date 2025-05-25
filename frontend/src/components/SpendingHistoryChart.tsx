"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Gastos por Categoría",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value: any) {
          return "$ " + new Intl.NumberFormat("es-MX").format(value);
        },
      },
    },
  },
};

interface SpendingData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    hoverOffset: number;
  }[];
}

export default function SpendingHistoryChart() {
  const [spendingData, setSpendingData] = useState<SpendingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpendingData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/spending-by-category"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch spending data");
        }
        const data = await response.json();
        setSpendingData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpendingData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!spendingData) {
    return null;
  }

  return (
    <div className="w-full h-[600px] p-4">
      <Bar options={options} data={spendingData} />
    </div>
  );
}
