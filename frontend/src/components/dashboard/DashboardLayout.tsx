import { ReactNode } from "react";
import {
  HomeIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Gift } from "lucide-react";
import { Telescope } from "lucide-react";
import { usePathname } from "next/navigation";
import { ChatWidget } from "@/components/ChatWidget";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 h-screen w-20 bg-black border-r border-gray-600 flex flex-col items-center py-8 space-y-8">
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
            pathname === "/wrapped"
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
            pathname === "/vision"
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
            pathname === "/calendar"
              ? "bg-purple-100 text-purple-600"
              : "text-gray-400 hover:bg-gray-100"
          )}
        >
          <CalendarIcon className="w-6 h-6" />
        </Link>

        <Link
          href="/cards"
          className={clsx(
            "p-3 rounded-xl transition-colors duration-200",
            pathname === "/cards"
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

      {/* Main Content */}
      <main className="ml-20">
        {children}
        {pathname !== "/chatbot" && <ChatWidget />}
      </main>
    </div>
  );
}
