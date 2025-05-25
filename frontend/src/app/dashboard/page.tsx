"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { CreditCard } from "@/components/dashboard/CreditCard";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { Statistics } from "@/components/dashboard/Statistics";
import SpendingHistoryChart from "@/components/SpendingHistoryChart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import Image from "next/image";

const CLIENT_NAME = "Hey Banco";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="announcement bg-neutral-900 text-white px-4 py-2 flex items-center gap-4 overflow-hidden">
        <div className="relative">
          <Image
            src="/Hey_Transparent.png"
            alt="Hey Wrapped"
            className="w-32 h-32 transform hover:scale-105 transition-transform duration-300"
            width={128}
            height={128}
          />
        </div>
        <div className="flex-1">
          <Dialog>
            <DialogTrigger asChild>
              <div className="cursor-pointer">
                <h2 className="text-2xl font-bold">
                  ¡Tu Hey Wrapped está listo!
                </h2>
                <p className="text-gray-300 underline hover:text-white transition-colors duration-300">
                  Descubre cómo has usado tu cuenta Hey este año
                </p>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] text-center">
              <DialogHeader>
                <DialogTitle className="text-2xl">Hey Wrapped 2024</DialogTitle>
                <DialogDescription>
                  Un resumen personalizado de tu año financiero con Hey
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6">
                <a
                  href="/wrapped"
                  className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Ir a Hey Wrapped
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <ProfileCard clientName={CLIENT_NAME} />
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12">
            <div className="grid grid-cols-2 gap-8 mb-8">
              <CreditCard clientName={CLIENT_NAME} />
              <Statistics />
            </div>
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="transactions" className="flex-1">
                  Últimas Transacciones
                </TabsTrigger>
                {/* <TabsTrigger value="predictions" className="flex-1">
                  Predicciones
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1">
                  Historial
                </TabsTrigger> */}
              </TabsList>
              <TabsContent value="transactions">
                <TransactionList />
              </TabsContent>
              <TabsContent
                value="predictions"
                className="h-[400px] flex flex-col items-center justify-center gap-4"
              >
                <p className="text-lg text-gray-600 text-center">
                  Basado en tus gastos, te ayudamos a predecir tus futuros
                  movimientos
                </p>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-8 py-6 h-auto text-lg font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => router.push("/vision")}
                >
                  Ver Predicciones
                </Button>
              </TabsContent>
              <TabsContent value="history">
                <div className="bg-white rounded-lg shadow p-6">
                  <SpendingHistoryChart />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
