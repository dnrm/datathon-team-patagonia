"use client";

import { ReactNode, useState } from "react";
import {
  HomeIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Gift } from "lucide-react";
import { Telescope } from "lucide-react";
import { Calendar } from "lucide-react";
import { usePathname } from "next/navigation";
import { ChatWidget } from "@/components/ChatWidget";

interface WrappedFutureLayoutProps {
  children: ReactNode;
}

export default function WrappedFutureLayout({
  children,
}: WrappedFutureLayoutProps) {
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(false);

  return (
    <div className="min-h-screen ">
      {/* Toggle area for nav */}
      <div
        className="fixed top-1/2 left-0 z-50"
        style={{ transform: "translateY(-50%)" }}
        onMouseEnter={() => setShowNav(true)}
        onMouseLeave={() => setShowNav(false)}
      >
        <div className="relative">
          {/* Flecha */}
          <div
            className={clsx(
              "bg-black rounded-r-full flex items-center justify-center cursor-pointer transition-all duration-300 absolute left-0",
              showNav ? "translate-x-20 shadow-xl" : "translate-x-0"
            )}
            style={{ width: 40, height: 60, zIndex: 20 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </div>
          {/* NavBar */}
          <nav
            className={clsx(
              "h-screen w-20 bg-black bg-black flex flex-col items-center py-8 space-y-8 animate-fade-in transition-all duration-300 absolute left-0 top-1/2",
              showNav
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 -translate-x-8 pointer-events-none"
            )}
            style={{ transform: "translateY(-50%)" }}
          >
            <div className="mb-8">
              <Image src="/Hey_Banco.svg" alt="Logo" width={32} height={32} />
            </div>
            <Link
              href="/dashboard"
              className={clsx(
                "p-3 rounded-xl transition-colors duration-200",
                pathname === "/dashboard"
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-400 hover:bg-gray-100"
              )}
            >
              <HomeIcon className="w-6 h-6" />
            </Link>
            <Link
              href="/wrapped"
              className={clsx(
                "p-3 rounded-xl transition-colors duration-200",
                pathname === "/cards"
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-400 hover:bg-gray-100"
              )}
            >
              <Gift className="w-6 h-6" />
            </Link>
            <Link
              href="/vision"
              className={clsx(
                "p-3 rounded-xl transition-colors duration-200",
                pathname === "/analytics"
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-400 hover:bg-gray-100"
              )}
            >
              <Telescope className="w-6 h-6" />
            </Link>
            <Link
              href="/calendar"
              className={clsx(
                "p-3 rounded-xl transition-colors duration-200",
                pathname === "/international"
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-400 hover:bg-gray-100"
              )}
            >
              <Calendar className="w-6 h-6" />
            </Link>
            <Link
              href="/cards"
              className={clsx(
                "p-3 rounded-xl transition-colors duration-200",
                pathname === "/history"
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-400 hover:bg-gray-100"
              )}
            >
              <CreditCardIcon className="w-6 h-6" />
            </Link>
            <Link
              href="/chatbot"
              className={clsx(
                "p-3 rounded-xl transition-colors duration-200",
                pathname === "/chatbot"
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-400 hover:bg-gray-100"
              )}
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="ml-0">
        {children}
        <ChatWidget />
      </main>
    </div>
  );
}
