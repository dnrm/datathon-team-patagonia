"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  CreditCard,
  ArrowRight,
  Sparkles,
  Brain,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Type definitions for API responses
interface MonthlyData {
  mes: string;
  gasto: number;
}

interface CambioMensualResponse {
  promedio_cambio_porcentual: number;
  promedio_monto_mensual: number;
  mayor_incremento: {
    Mes: string;
    cambio_porcentual: number;
  };
  trimestre_mas_activo: string;
  gasto_por_mes: MonthlyData[];
}

interface PredictedFutureResponse {
  top5: Array<{
    comercio: string;
    pred_monto: number;
  }>;
  total_anual: number;
}

interface PlaceResult {
  commerce: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface TopPlacesResponse {
  estado: string;
  categorias: Array<{
    category: string;
    results: PlaceResult[];
  }>;
}

interface SubscriptionData {
  tipo: string;
  dia_pago: number;
  promedio_monto: number;
}

interface SubscriptionsResponse {
  [key: string]: SubscriptionData;
}

const sections = [
  "intro",
  "spending-trend",
  "discovery-forecast",
  "subscriptions",
  // "summary",
];

export default function PredictionWrapped() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cambioMensualData, setCambioMensualData] =
    useState<CambioMensualResponse | null>(null);
  const [predictedFutureData, setPredictedFutureData] =
    useState<PredictedFutureResponse | null>(null);
  const [topPlacesData, setTopPlacesData] = useState<TopPlacesResponse | null>(
    null
  );
  const [subscriptionsData, setSubscriptionsData] = useState<SubscriptionsResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const nextSection = useCallback(() => {
    if (currentSection < sections.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSection(currentSection + 1);
        setIsAnimating(false);
      }, 300);
    }
  }, [currentSection]);

  const prevSection = useCallback(() => {
    if (currentSection > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSection(currentSection - 1);
        setIsAnimating(false);
      }, 300);
    }
  }, [currentSection]);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch cambio mensual data
        const cambioResponse = await fetch(
          "http://localhost:8000/cambio-mensual"
        );
        if (cambioResponse.ok) {
          const cambioData = await cambioResponse.json();
          setCambioMensualData(cambioData);
        }

        // Fetch predicted future data
        const futureResponse = await fetch(
          "http://localhost:8000/predicted-future"
        );
        if (futureResponse.ok) {
          const futureData = await futureResponse.json();
          setPredictedFutureData(futureData);
        }

        // Fetch top places data
        const placesResponse = await fetch(
          "http://localhost:8000/get_top_places"
        );
        if (placesResponse.ok) {
          const placesData = await placesResponse.json();
          setTopPlacesData(placesData);
        }

        // Fetch subscriptions data
        const subscriptionsResponse = await fetch(
          "http://localhost:8000/subscriptions"
        );
        if (subscriptionsResponse.ok) {
          const subscriptionsData = await subscriptionsResponse.json();
          setSubscriptionsData(subscriptionsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSection();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSection();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSection, nextSection, prevSection]);

  const IntroSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-700 flex items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 text-center space-y-8 px-4">
        <div className="space-y-4">
          <Brain className="h-20 w-20 mx-auto text-cyan-300 animate-pulse" />
          <div className="flex flex-col items-center justify-center">
            <span className="block w-full max-w-[350px] mx-auto">
              <Image
                src="/Hey_Banco.svg"
                alt="Hey Banco Logo"
                width={400}
                height={85}
                priority
                className="w-full h-auto mx-auto"
              />
            </span>
            <span className="block text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mt-2">
              VISION
            </span>
          </div>
          <p className="text-xl md:text-2xl font-medium opacity-90">
            Predicción de gastos inteligente
          </p>
          <p className="text-lg opacity-75">
            Descubre cómo gastarás en 2025 basado en tu comportamiento
          </p>
        </div>
        <Button
          onClick={nextSection}
          size="lg"
          className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-full"
        >
          Ver mi futuro financiero
          <Zap className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  const SpendingTrendSection = () => {
    if (isLoading || !cambioMensualData) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center text-white p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Cargando predicciones...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center text-white p-4">
        <div className="max-w-4xl w-full space-y-8 text-center mb-25 mt-10">
          <div className="space-y-4">
            <TrendingUp className="h-16 w-16 mx-auto text-yellow-300" />
            <h2 className="text-5xl md:text-6xl font-black">
              TU TENDENCIA
              <span className="block text-yellow-300">2025</span>
            </h2>
            <p className="text-xl opacity-90">
              Predicción basada en tu comportamiento actual
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-black text-green-300 mb-2">
                  +{cambioMensualData.promedio_cambio_porcentual.toFixed(1)}%
                </div>
                <p className="text-xl">Incremento proyectado en gastos</p>
                <p className="text-white/70 mt-2">
                  Promedio mensual: $
                  {cambioMensualData.promedio_monto_mensual.toLocaleString(
                    "es-MX",
                    { minimumFractionDigits: 2 }
                  )}
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-300">
                    {cambioMensualData.mayor_incremento.Mes}
                  </div>
                  <p className="text-sm text-white/70">
                    Mes de mayor crecimiento
                  </p>
                  <p className="text-xs text-green-200">
                    +
                    {cambioMensualData.mayor_incremento.cambio_porcentual.toFixed(
                      1
                    )}
                    %
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-300">
                    $
                    {cambioMensualData.promedio_monto_mensual.toLocaleString(
                      "es-MX",
                      { minimumFractionDigits: 0 }
                    )}
                  </div>
                  <p className="text-sm text-white/70">
                    Promedio mensual proyectado
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-300">
                    {cambioMensualData.trimestre_mas_activo}
                  </div>
                  <p className="text-sm text-white/70">Trimestre más activo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const DiscoveryForecastSection = () => {
    if (isLoading || !topPlacesData) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-teal-600 via-green-600 to-emerald-600 flex items-center justify-center text-white p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Cargando descubrimientos...</p>
          </div>
        </div>
      );
    }

    // Filter categories that have results
    const categoriesWithResults = topPlacesData.categorias.filter(
      (category) => category.results && category.results.length > 0
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-600 via-green-600 to-emerald-600 flex items-center justify-center text-white p-4">
        <div className="max-w-6xl w-full space-y-8 text-center mb-25 mt-10">
          <div className="space-y-4">
            <Sparkles className="h-16 w-16 mx-auto text-yellow-300" />
            <h2 className="text-5xl md:text-6xl font-black">
              DESCUBRIMIENTOS
              <span className="block text-yellow-300">CERCA DE TI</span>
            </h2>
            <p className="text-xl opacity-90">
              Comercios que visitarás por primera vez en {topPlacesData.estado}
            </p>
          </div>

          <div
            className={`grid md:grid-cols-${
              categoriesWithResults.filter((i) => i.category !== "Unknown")
                .length
            } gap-6 text-left`}
          >
            {categoriesWithResults.slice(0, 3).map((category, idx) => (
              <Card
                key={idx}
                className="bg-white/10 backdrop-blur-sm border-white/20 p-6 h-full text-white"
              >
                <CardContent>
                  <h3 className="text-xl font-bold mb-4 text-yellow-200 text-center">
                    {category.category}
                  </h3>
                  <div className="space-y-6">
                    {category.results.slice(0, 3).map((place, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold">{place.commerce}</div>
                          <div className="text-xs text-white/70">
                            {place.address}
                          </div>
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-white hover:text-yellow-400 flex items-center weight-bold"
                          title="Ver en Google Maps"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-6 w-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                            />
                          </svg>
                          <span className="sr-only">Ver en Google Maps</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const SubscriptionPredictionSection = () => {
    if (isLoading || !subscriptionsData) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Cargando suscripciones...</p>
          </div>
        </div>
      );
    }

    // Convert subscriptions object to array and sort by amount
    const subscriptionsArray = Object.entries(subscriptionsData)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.promedio_monto - a.promedio_monto);

    // Calculate total subscription cost
    const totalMonthlyCost = subscriptionsArray.reduce(
      (total, sub) => total + sub.promedio_monto,
      0
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white p-4">
        <div className="max-w-4xl w-full space-y-8 text-center mb-25 mt-10">
          <div className="space-y-4">
            <CreditCard className="h-16 w-16 mx-auto text-yellow-300" />
            <h2 className="text-5xl md:text-6xl font-black">
              SUSCRIPCIONES
              <span className="block text-yellow-300">2025</span>
            </h2>
            <p className="text-xl opacity-90">
              Tus pagos recurrentes mensuales
            </p>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-white">
              <CardContent className="space-y-4">
                <h3 className="text-2xl font-bold">
                  Tus suscripciones activas
                </h3>

                <div className="space-y-4">
                  {subscriptionsArray.slice(0, 3).map((subscription, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-xl font-bold">
                              {index + 1}
                            </span>
                          </div>
                          <div className="text-left">
                            <h4 className="text-lg font-bold">
                              {subscription.name}
                            </h4>
                            <p className="text-white/70">
                              Cobro día {subscription.dia_pago} de cada mes
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">
                            ${subscription.promedio_monto.toLocaleString("es-MX", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <Badge
                            className={`text-white ${
                              index === 0
                                ? "bg-green-500"
                                : index === 1
                                ? "bg-blue-500"
                                : "bg-purple-500"
                            }`}
                          >
                            Top {index + 1}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {subscriptionsArray.length > 3 && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {subscriptionsArray.slice(3, 5).map((subscription, index) => (
                      <div
                        key={index + 3}
                        className="bg-white/10 rounded-lg p-4"
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-xl font-bold">
                            {index + 4}
                          </span>
                          <div>
                            <h4 className="font-bold">{subscription.name}</h4>
                            <p className="text-sm text-white/70">
                              $
                              {subscription.promedio_monto.toLocaleString("es-MX", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-orange-500 text-white text-xs">
                          Día {subscription.dia_pago}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <CardContent className="space-y-4">
                <h3 className="text-xl font-bold text-white">
                  Resumen de suscripciones
                </h3>

                <div className="grid md:grid-cols-2 gap-6 text-white">
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-4xl font-black text-green-300">
                        $
                        {totalMonthlyCost.toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <p className="text-sm text-white/70">
                        Total mensual en suscripciones
                      </p>
                      <p className="text-xs text-white/60">
                        $
                        {(totalMonthlyCost * 12).toLocaleString("es-MX", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}{" "}
                        gasto anual proyectado
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold mb-3">Cronograma de pagos:</h4>
                    {subscriptionsArray
                      .sort((a, b) => a.dia_pago - b.dia_pago)
                      .map((subscription, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="truncate">
                            Día {subscription.dia_pago}: {subscription.name.slice(0, 12)}...
                          </span>
                          <span>
                            $
                            {subscription.promedio_monto.toLocaleString("es-MX", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const SummarySection = () => {
    if (
      isLoading ||
      !predictedFutureData ||
      !cambioMensualData ||
      !topPlacesData ||
      !subscriptionsData
    ) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900 flex items-center justify-center text-white p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Preparando resumen...</p>
          </div>
        </div>
      );
    }

    // Calculate categories with results
    const categoriesWithResults = topPlacesData.categorias.filter(
      (categoria) => categoria.results.length > 0
    ).length;

    // Calculate subscription data
    const subscriptionsArray = Object.entries(subscriptionsData);
    const totalMonthlySubs = subscriptionsArray.reduce(
      (total, [, data]) => total + data.promedio_monto,
      0
    );
    const topSubscription = subscriptionsArray.reduce((max, [name, data]) =>
      data.promedio_monto > max.data.promedio_monto ? { name, data } : max,
      { name: subscriptionsArray[0][0], data: subscriptionsArray[0][1] }
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900 flex items-center justify-center text-white p-4">
        <div className="max-w-4xl w-full space-y-2 text-center mb-25 mt-10">
          <div className="space-y-4">
            <Brain className="h-16 w-16 mx-auto text-cyan-300" />
            <h2 className="text-5xl md:text-6xl font-black">
              TU FUTURO
              <span className="block bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                FINANCIERO
              </span>
            </h2>
            <p className="text-xl opacity-90">
              Resumen de predicciones para 2025
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <CardContent className="text-center space-y-2">
                <div className="text-4xl font-black text-green-300">
                  $
                  {predictedFutureData.total_anual.toLocaleString("es-MX", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </div>
                <p className="text-lg">Gasto total proyectado</p>
                <p className="text-sm text-white/70">
                  +{cambioMensualData.promedio_cambio_porcentual.toFixed(1)}% vs
                  promedio actual
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <CardContent className="text-center space-y-2">
                <div className="text-4xl font-black text-blue-300">
                  $
                  {cambioMensualData.promedio_monto_mensual.toLocaleString(
                    "es-MX",
                    {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }
                  )}
                </div>
                <p className="text-lg">Promedio mensual</p>
                <p className="text-sm text-white/70">Gasto proyectado</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <CardContent className="text-center space-y-2">
                <div className="text-4xl font-black text-purple-300">
                  $
                  {totalMonthlySubs.toLocaleString("es-MX", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </div>
                <p className="text-lg">Suscripciones mensuales</p>
                <p className="text-sm text-white/70">
                  {subscriptionsArray.length} servicios activos
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <CardContent className="text-center space-y-2">
                <div className="text-4xl font-black text-yellow-300">
                  {categoriesWithResults}
                </div>
                <p className="text-lg">Nuevas categorías</p>
                <p className="text-sm text-white/70">de interés</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3 mt-5">
            <p className="text-xl">¡Tu futuro financiero se ve brillante! 🌟</p>
            <div className="text-sm text-white/70 mb-4">
              <p>Comercio top: {predictedFutureData.top5[0]?.comercio}</p>
              <p>
                Mes de mayor crecimiento:{" "}
                {cambioMensualData.mayor_incremento.Mes}
              </p>
              <p>
                Suscripción principal: {topSubscription.name} (${topSubscription.data.promedio_monto.toFixed(0)}/mes)
              </p>
            </div>
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 font-bold text-lg px-8 py-4 rounded-full"
              onClick={() => router.push("/chatbot")}
            >
              Recomendaciones Personalizadas
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderSection = () => {
    const sectionComponents = [
      IntroSection,
      SpendingTrendSection,
      DiscoveryForecastSection,
      SubscriptionPredictionSection,
      SummarySection,
    ];

    const Component = sectionComponents[currentSection];
    return <Component />;
  };

  return (
    <div className="relative">
      <div
        className={`transition-opacity duration-300 ${
          isAnimating ? "opacity-0" : "opacity-100"
        }`}
      >
        {renderSection()}
      </div>

      {/* Progress indicator */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-50 mb-2">
        {sections.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSection ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-50">
        <Button
          onClick={prevSection}
          disabled={currentSection === 0}
          variant="outline"
          size="sm"
          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
        >
          Anterior
        </Button>
        <Button
          onClick={() => {
            if (currentSection === sections.length - 1) {
              router.push("/dashboard");
            } else {
              nextSection();
            }
          }}
          disabled={currentSection === sections.length - 1 && isAnimating}
          size="sm"
          className="bg-white text-black hover:bg-gray-100"
        >
          {currentSection === sections.length - 1 ? "Finalizar" : "Siguiente"}
        </Button>
      </div>
    </div>
  );
}
