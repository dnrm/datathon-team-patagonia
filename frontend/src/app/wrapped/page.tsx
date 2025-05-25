"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Calendar,
  ShoppingBag,
  CreditCard,
  Play,
  Trophy,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

const sections = [
  "intro",
  "top-stores",
  "customer-ranking",
  "peak-spending",
  "top-category",
  "daily-average",
  "subscriptions",
  "summary",
];

interface TopStore {
  commerce: string;
  count: number;
  total: number;
  category: string;
}

interface FavoriteCommerce {
  tienda_favorita: string;
  visitas_usuario: number;
  porcentaje_participacion: number;
  gasto_promedio: number;
}

interface DayMoreSpent {
  date: string;
  total: number;
  top3_merchants: {
    merchant: string;
    amount: number;
  }[];
}

interface FavoriteCategory {
  favorite_category: string;
  purchase_count: number;
  average_spent_in_category: number;
  percentage_of_total_spent: number;
  total_spent_in_category: number;
}

interface AverageSpendingDaily {
  promedio_diario: number;
  top3_dias_semana: {
    dia_semana: number;
    promedio: number;
  }[];
}

export default function HeyWrapped() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const router = useRouter();

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSection(currentSection + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSection(currentSection - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

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
  }, [currentSection]);

  const IntroSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 text-center space-y-8 px-4">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight flex flex-col items-center justify-center">
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
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              WRAPPED
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-medium opacity-90">
            Tu año financiero en números increíbles
          </p>
          <p className="text-lg opacity-75">
            Descubre cómo gastaste tu dinero en 2025
          </p>
        </div>
        <Button
          onClick={nextSection}
          size="lg"
          className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-full"
        >
          Comenzar mi Wrapped
          <Play className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  const TopStoresSection = () => {
    const [topStores, setTopStores] = useState<TopStore[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchTopStores = async () => {
        try {
          const response = await fetch(
            "http://localhost:8000/top-commerce-year/2023"
          );
          if (!response.ok) {
            throw new Error("Failed to fetch top stores data");
          }
          const data = await response.json();
          setTopStores(data);
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "An error occurred"
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchTopStores();
    }, []);

    // SVG de ubicación amarillo
    const LocationIcon = (
      <MapPin className="w-16 h-16 mx-auto mb-2 text-yellow-300" />
    );

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center text-white p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-300 mx-auto mb-4"></div>
            <p className="text-xl">Cargando tus lugares favoritos...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center text-white p-4">
          <div className="text-center">
            <div className="text-yellow-300 mb-4">⚠️</div>
            <p className="text-xl">Oops, algo salió mal al cargar tus datos.</p>
            <p className="text-sm opacity-75 mt-2">
              Por favor, intenta de nuevo más tarde.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center text-white p-4">
        <div className="max-w-4xl w-full space-y-8 text-center">
          <div className="space-y-4">
            {LocationIcon}
            <h2 className="text-5xl md:text-6xl font-black">
              TUS LUGARES
              <span className="block text-yellow-300">FAVORITOS</span>
            </h2>
            <p className="text-xl opacity-90">Donde más gastaste este año</p>
          </div>

          <div className="grid gap-6 md:gap-8">
            {/* Top 1 grande */}
            {topStores.length > 0 && (
              <Card className="text-white bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center text-2xl font-bold text-black">
                        1
                      </div>
                      <div className="text-left text-white">
                        <h3 className="text-2xl font-bold">
                          {topStores[0].commerce}
                        </h3>
                        <p className="text-white/70">{topStores[0].category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black">
                        {Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(topStores[0].total)}
                      </p>
                      <p className="text-white/70">
                        {topStores[0].count} visitas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top 2-5 en dos columnas */}
            <div className="grid md:grid-cols-2 gap-4">
              {topStores.slice(1).map((store, index) => (
                <Card
                  key={store.commerce}
                  className="text-white bg-white/10 backdrop-blur-sm border-white/20 p-4"
                >
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <div className="w-14 h-14 aspect-square bg-white/20 rounded-full flex items-center justify-center font-bold">
                          <p className="text-xl">{index + 2}</p>
                        </div>
                        <div className="text-left">
                          <h4 className="text-lg font-bold">
                            {store.commerce}
                          </h4>
                          <p className="text-sm text-white/70">
                            {store.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right min-w-[90px]">
                        <p className="text-lg font-bold">
                          {Intl.NumberFormat("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          }).format(store.total)}
                        </p>
                        <p className="text-sm text-white/70">
                          {store.count} visitas
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CustomerRankingSection = () => {
    const [favoriteCommerce, setFavoriteCommerce] =
      useState<FavoriteCommerce | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            "http://localhost:8000/favorite-commerce/2023"
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await response.json();
          setFavoriteCommerce(data);
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "An error occurred"
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, []);

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 flex items-center justify-center text-white p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-300 mx-auto mb-4"></div>
            <p className="text-xl">Cargando tus datos...</p>
          </div>
        </div>
      );
    }

    if (error || !favoriteCommerce) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 flex items-center justify-center text-white p-4">
          <div className="text-center">
            <div className="text-yellow-300 mb-4">⚠️</div>
            <p className="text-xl">Oops, algo salió mal al cargar tus datos.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 flex items-center justify-center text-white p-4">
        <div className="max-w-4xl w-full space-y-8 text-center">
          <div className="space-y-4">
            <Trophy className="h-16 w-16 mx-auto text-yellow-300" />
            <h2 className="text-5xl md:text-6xl font-black">
              FORMAS PARTE DEL{" "}
              <span className="text-yellow-300">
                TOP{" "}
                {Math.round(100 - favoriteCommerce.porcentaje_participacion)}%
              </span>
              DE LOS CLIENTES DE
              <span className="text-yellow-300">
                {" " + favoriteCommerce.tienda_favorita}
              </span>
            </h2>
          </div>

          <Card className="text-white bg-white/10 backdrop-blur-sm border-white/20 p-8">
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-8xl font-black text-yellow-300 mb-2">
                  {favoriteCommerce.tienda_favorita}
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {favoriteCommerce.visitas_usuario}
                    </div>
                    <p className="text-sm text-white/70">Visitas totales</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      ${favoriteCommerce.gasto_promedio.toFixed(2)}
                    </div>
                    <p className="text-sm text-white/70">Gasto promedio</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const PeakSpendingSection = () => {
    const [dayMoreSpent, setDayMoreSpent] = useState<DayMoreSpent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch("http://localhost:8000/day-more-spent");
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await response.json();
          setDayMoreSpent(data[0]); // Taking the first item since it's an array
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "An error occurred"
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, []);

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 flex items-center justify-center text-white p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-300 mx-auto mb-4"></div>
            <p className="text-xl">Cargando tus datos...</p>
          </div>
        </div>
      );
    }

    if (error || !dayMoreSpent) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 flex items-center justify-center text-white p-4">
          <div className="text-center">
            <div className="text-yellow-300 mb-4">⚠️</div>
            <p className="text-xl">Oops, algo salió mal al cargar tus datos.</p>
          </div>
        </div>
      );
    }

    const formattedDate = new Date(dayMoreSpent.date).toLocaleDateString(
      "es-MX",
      {
        day: "numeric",
        month: "long",
      }
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 flex items-center justify-center text-white p-4">
        <div className="max-w-4xl w-full space-y-8 text-center">
          <div className="space-y-4">
            <Calendar className="h-16 w-16 mx-auto text-yellow-300" />
            <h2 className="text-5xl md:text-6xl font-black">
              TU DÍA MÁS
              <span className="block text-yellow-300">GASTÓN</span>
            </h2>
          </div>

          <Card className="text-white bg-white/10 backdrop-blur-sm border-white/20 p-8">
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-black text-yellow-300 mb-2">
                  {formattedDate}
                </div>
                <p className="text-2xl font-bold">
                  ${dayMoreSpent.total.toFixed(2)}
                </p>
              </div>

              <div className="space-y-4">
                {dayMoreSpent.top3_merchants.map((merchant, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white/10 rounded-lg p-4"
                  >
                    <span>{merchant.merchant}</span>
                    <span className="font-bold">
                      ${merchant.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const TopCategorySection = () => {
    const [favoriteCategory, setFavoriteCategory] =
      useState<FavoriteCategory | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            "http://localhost:8000/favorite-categorie"
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await response.json();
          setFavoriteCategory(data);
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "An error occurred"
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, []);

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center text-white p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-300 mx-auto mb-4"></div>
            <p className="text-xl">Cargando tus datos...</p>
          </div>
        </div>
      );
    }

    if (error || !favoriteCategory) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center text-white p-4">
          <div className="text-center">
            <div className="text-yellow-300 mb-4">⚠️</div>
            <p className="text-xl">Oops, algo salió mal al cargar tus datos.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center text-white p-4">
        <div className="max-w-4xl w-full space-y-8 text-center">
          <div className="space-y-4">
            <ShoppingBag className="h-16 w-16 mx-auto text-yellow-300" />
            <h2 className="text-5xl md:text-6xl font-black">
              TU CATEGORÍA
              <span className="block text-yellow-300">GANADORA</span>
            </h2>
          </div>

          <Card className="text-white bg-white/10 backdrop-blur-sm border-white/20 p-8">
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">🛍️</div>
                <div className="text-4xl font-black text-yellow-300 mb-2">
                  {favoriteCategory.favorite_category}
                </div>
                <p className="text-2xl font-bold">
                  ${favoriteCategory.total_spent_in_category.toFixed(2)}
                </p>
                <p className="text-white/70 mt-2">{1}% de todos tus gastos</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold">
                    {favoriteCategory.purchase_count}
                  </div>
                  <p className="text-sm text-white/70">Compras totales</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold">
                    ${favoriteCategory.average_spent_in_category.toFixed(2)}
                  </div>
                  <p className="text-sm text-white/70">Gasto promedio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const DailyAverageSection = () => {
    const [averageSpending, setAverageSpending] =
      useState<AverageSpendingDaily | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            "http://localhost:8000/average-spending-daily"
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await response.json();
          setAverageSpending(data);
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "An error occurred"
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, []);

    const getDayName = (dayNumber: number) => {
      const days = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];
      return days[dayNumber];
    };

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-teal-500 via-green-500 to-blue-500 flex items-center justify-center text-white p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-300 mx-auto mb-4"></div>
            <p className="text-xl">Cargando tus datos...</p>
          </div>
        </div>
      );
    }

    if (error || !averageSpending) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-teal-500 via-green-500 to-blue-500 flex items-center justify-center text-white p-4">
          <div className="text-center">
            <div className="text-yellow-300 mb-4">⚠️</div>
            <p className="text-xl">Oops, algo salió mal al cargar tus datos.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-500 via-green-500 to-blue-500 flex items-center justify-center text-white p-4">
        <div className="max-w-4xl w-full space-y-8 text-center">
          <div className="space-y-4">
            <TrendingUp className="h-16 w-16 mx-auto text-yellow-300" />
            <h2 className="text-5xl md:text-6xl font-black">
              GASTAS EN
              <span className="block text-yellow-300">PROMEDIO</span>
            </h2>
          </div>

          <Card className="text-white bg-white/10 backdrop-blur-sm border-white/20 p-8">
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-8xl font-black text-yellow-300 mb-2">
                  ${averageSpending.promedio_diario.toFixed(2)}
                </div>
                <p className="text-xl">por día</p>
                <p className="text-white/70 mt-2">
                  Eso son ${(averageSpending.promedio_diario * 30).toFixed(2)}{" "}
                  al mes 💰
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {averageSpending.top3_dias_semana.map((day, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-4">
                    <div className="text-xl font-bold">
                      {getDayName(day.dia_semana)}
                    </div>
                    <div className="text-2xl font-black text-yellow-300">
                      ${day.promedio.toFixed(2)}
                    </div>
                    <p className="text-xs text-white/70">
                      {index === 0 ? "Tu día de más gastos" : ""}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const SubscriptionsSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 flex items-center justify-center text-white p-4">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <CreditCard className="h-16 w-16 mx-auto text-yellow-300" />
          <h2 className="text-5xl md:text-6xl font-black">
            TUS
            <span className="block text-yellow-300">SUSCRIPCIONES</span>
          </h2>
          <p className="text-xl opacity-90">$890 al mes en entretenimiento</p>
        </div>

        <div className="space-y-4">
          <Card className="text-white bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🎵</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold">Spotify Premium</h3>
                    <p className="text-white/70">Música</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">$199</p>
                  <Badge className="bg-green-500 text-white">Más usada</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="text-white bg-white/10 backdrop-blur-sm border-white/20 p-4">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📺</span>
                    <div>
                      <h4 className="font-bold">Netflix</h4>
                      <p className="text-sm text-white/70">$279/mes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-white bg-white/10 backdrop-blur-sm border-white/20 p-4">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🏰</span>
                    <div>
                      <h4 className="font-bold">Disney+</h4>
                      <p className="text-sm text-white/70">$159/mes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="text-white bg-white/10 backdrop-blur-sm border-white/20 p-3">
              <CardContent className="text-center">
                <span className="text-xl">💪</span>
                <p className="font-bold">Gym</p>
                <p className="text-sm text-white/70">$890</p>
              </CardContent>
            </Card>
            <Card className="text-white bg-white/10 backdrop-blur-sm border-white/20 p-3">
              <CardContent className="text-center">
                <span className="text-xl">☁️</span>
                <p className="font-bold">iCloud</p>
                <p className="text-sm text-white/70">$49</p>
              </CardContent>
            </Card>
            <Card className="text-white bg-white/10 backdrop-blur-sm border-white/20 p-3">
              <CardContent className="text-center">
                <span className="text-xl">🎮</span>
                <p className="font-bold">Xbox Live</p>
                <p className="text-sm text-white/70">$199</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  const SummarySection = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-white p-4">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <Sparkles className="h-16 w-16 mx-auto text-yellow-300" />
          <h2 className="text-5xl md:text-6xl font-black">
            TU 2024 EN
            <span className="block text-yellow-300">NÚMEROS</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-white">
          <Card className="text-white bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <CardContent className="text-center space-y-2">
              <div className="text-4xl font-black text-green-300">$24,500</div>
              <p className="text-lg">Total gastado</p>
            </CardContent>
          </Card>

          <Card className="text-white bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <CardContent className="text-center space-y-2">
              <div className="text-4xl font-black text-blue-300">365</div>
              <p className="text-lg">Días activo</p>
            </CardContent>
          </Card>

          <Card className="text-white bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <CardContent className="text-center space-y-2">
              <div className="text-4xl font-black text-purple-300">1,247</div>
              <p className="text-lg">Transacciones</p>
            </CardContent>
          </Card>

          <Card className="text-white bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <CardContent className="text-center space-y-2">
              <div className="text-4xl font-black text-yellow-300">47</div>
              <p className="text-lg">Comercios visitados</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 mt-12">
          <p className="text-xl">¡Gracias por confiar en Hey Banco!</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Dialog open={shareOpen} onOpenChange={setShareOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-full"
                  onClick={() => setShareOpen(true)}
                >
                  Compartir mi Wrapped
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Compartir tu Hey Wrapped</DialogTitle>
                  <DialogDescription>
                    Elige una red social para compartir tu resumen:
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-4">
                  {/* Botones de compartir */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=Soy%20el%20TOP%205%25%20de%20los%20clientes%20de%20Starbucks%20este%20a%C3%B1o%20%F0%9F%8F%86%0A%0A5%25%20de%20todos%20los%20que%20visitaron%20Starbucks%20en%202025.%0A%C2%A1Soy%20un%20verdadero%20fan!%20%F0%9F%92%96%0A%0A50%20Visitas%20totales%0A%23heybanco%20%23heywrapped%20https://heybanco.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition w-full text-center"
                  >
                    Compartir en Twitter/X
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=https://heybanco.com&quote=ERES%20EL%20TOP%205%25%0Ade%20nuestros%20clientes%20este%20a%C3%B1o%20%F0%9F%8F%86%0A%0A5%25%20de%20todos%20los%20que%20nos%20visitaron%20en%202025.%0A%C2%A1Eres%20un%20verdadero%20fan!%20%F0%9F%92%96%0A%0A47%20Visitas%20totales%0A%23heybanco%20%23heywrapped`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full transition w-full text-center"
                  >
                    Compartir en Facebook
                  </a>
                  <a
                    href={`https://wa.me/?text=ERES%20EL%20TOP%205%25%0Ade%20nuestros%20clientes%20este%20a%C3%B1o%20%F0%9F%8F%86%0A%0A5%25%20de%20todos%20los%20que%20nos%20visitaron%20en%202025.%0A%C2%A1Eres%20un%20verdadero%20fan!%20%F0%9F%92%96%0A%0A47%20Visitas%20totales%0A%23heybanco%20%23heywrapped%20https://heybanco.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition w-full text-center"
                  >
                    Compartir en WhatsApp
                  </a>
                  {/* Instagram no permite crear post directo, así que solo dejamos el enlace al perfil */}
                  <a
                    href="https://www.instagram.com/heybanco/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full transition w-full text-center"
                  >
                    Ir al perfil de Instagram
                  </a>
                </div>
                <DialogClose asChild>
                  <Button className="mt-4 w-full" variant="outline">
                    Cerrar
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            <Button
              asChild
              size="lg"
              className="bg-yellow-300 text-purple-700 hover:bg-yellow-400 font-bold text-lg px-8 py-4 rounded-full"
            >
              <a href="/vision">Ver predicciones</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    const sectionComponents = [
      IntroSection,
      TopStoresSection,
      CustomerRankingSection,
      PeakSpendingSection,
      TopCategorySection,
      DailyAverageSection,
      SubscriptionsSection,
      SummarySection,
    ];

    const Component = sectionComponents[currentSection];
    return <Component />;
  };

  return (
    <div className="relative ">
      <div
        className={`transition-opacity duration-300 ${
          isAnimating ? "opacity-0" : "opacity-100"
        }`}
      >
        {renderSection()}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-50">
        {currentSection === 0 ? null : (
          <>
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
              {currentSection === sections.length - 1
                ? "Finalizar"
                : "Siguiente"}
            </Button>
          </>
        )}
      </div>

      {/* Progress indicator */}
      <div className="fixed bottom-19 left-1/2 transform -translate-x-1/2 flex space-x-2 z-50">
        {sections.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSection ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
