"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCardIcon, BanknotesIcon, GiftIcon } from "@heroicons/react/24/outline";

// Types
interface Card {
  id: string;
  type: "debit" | "credit" | "rewards";
  name: string;
  lastFourDigits: string;
  balance?: number;
  creditLimit?: number;
  availableCredit?: number;
  points?: number;
  pointsValue?: number;
  isActive: boolean;
  expiryDate: string;
  cardColor: string;
}

interface Transaction {
  id: string;
  cardId: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  status: string;
  pointsEarned?: number;
}

// Mock data for cards
const mockCards: Card[] = [
  {
    id: "1",
    type: "debit" as const,
    name: "Hey Debit Card",
    lastFourDigits: "4532",
    balance: 12850.50,
    isActive: true,
    expiryDate: "12/26",
    cardColor: "bg-gradient-to-r from-gray-800 to-gray-900"
  },
  {
    id: "2",
    type: "credit" as const,
    name: "Hey Credit Card",
    lastFourDigits: "8901",
    balance: -2340.25,
    creditLimit: 25000,
    availableCredit: 22659.75,
    isActive: true,
    expiryDate: "08/27",
    cardColor: "bg-gradient-to-r from-purple-600 to-blue-500"
  },
  {
    id: "3",
    type: "rewards" as const,
    name: "Hey Rewards Card",
    lastFourDigits: "1234",
    points: 15420,
    pointsValue: 772.00,
    isActive: true,
    expiryDate: "03/28",
    cardColor: "bg-gradient-to-r from-yellow-400 to-orange-500"
  }
];

// Mock transactions data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    cardId: "1",
    merchant: "OXXO",
    amount: -45.50,
    date: "2024-03-20T15:30:00",
    category: "Convenience Store",
    status: "completed"
  },
  {
    id: "2",
    cardId: "2",
    merchant: "Amazon México",
    amount: -299.99,
    date: "2024-03-19T10:15:00",
    category: "Online Shopping",
    status: "completed"
  },
  {
    id: "3",
    cardId: "1",
    merchant: "Farmacias Guadalajara",
    amount: -125.75,
    date: "2024-03-18T18:45:00",
    category: "Pharmacy",
    status: "completed"
  },
  {
    id: "4",
    cardId: "3",
    merchant: "Starbucks",
    amount: -85.00,
    date: "2024-03-18T08:20:00",
    category: "Coffee & Food",
    status: "completed",
    pointsEarned: 42
  },
  {
    id: "5",
    cardId: "2",
    merchant: "Spotify Premium",
    amount: -169.00,
    date: "2024-03-17T12:00:00",
    category: "Subscription",
    status: "completed"
  },
  {
    id: "6",
    cardId: "1",
    merchant: "Uber",
    amount: -87.50,
    date: "2024-03-16T21:10:00",
    category: "Transportation",
    status: "completed"
  }
];

function CardIcon({ type }: { type: string }) {
  switch (type) {
    case "debit":
      return <BanknotesIcon className="w-6 h-6" />;
    case "credit":
      return <CreditCardIcon className="w-6 h-6" />;
    case "rewards":
      return <GiftIcon className="w-6 h-6" />;
    default:
      return <CreditCardIcon className="w-6 h-6" />;
  }
}

function CardComponent({ card }: { card: Card }) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`${card.cardColor} p-6 text-white relative`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{card.name}</h3>
            <p className="text-sm opacity-80">•••• •••• •••• {card.lastFourDigits}</p>
          </div>
          <CardIcon type={card.type} />
        </div>
        
        <div className="mt-6">
          {card.type === "debit" && card.balance !== undefined && (
            <div>
              <p className="text-sm opacity-80">Available Balance</p>
              <p className="text-2xl font-bold">${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
          )}
          
          {card.type === "credit" && card.availableCredit !== undefined && card.creditLimit !== undefined && (
            <div className="space-y-2">
              <div>
                <p className="text-sm opacity-80">Available Credit</p>
                <p className="text-xl font-bold">${card.availableCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-xs opacity-70">Credit Limit: ${card.creditLimit.toLocaleString('en-US')}</p>
              </div>
            </div>
          )}
          
          {card.type === "rewards" && card.points !== undefined && card.pointsValue !== undefined && (
            <div>
              <p className="text-sm opacity-80">Rewards Points</p>
              <p className="text-2xl font-bold">{card.points.toLocaleString()} pts</p>
              <p className="text-xs opacity-70">Worth ~${card.pointsValue.toFixed(2)}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm opacity-80">Expires {card.expiryDate}</p>
          <Badge variant={card.isActive ? "default" : "secondary"} className="bg-white/20 text-white">
            {card.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Details
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionRow({ transaction, card }: { transaction: Transaction; card: Card }) {
  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full ${card.cardColor} flex items-center justify-center text-white`}>
          <CardIcon type={card.type} />
        </div>
        <div>
          <p className="font-medium text-gray-900">{transaction.merchant}</p>
          <p className="text-sm text-gray-500">{transaction.category}</p>
          <p className="text-xs text-gray-400">
            {new Date(transaction.date).toLocaleDateString('es-MX', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <p className={`font-semibold ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
          ${Math.abs(transaction.amount).toFixed(2)}
        </p>
        <p className="text-xs text-gray-500">•••• {card.lastFourDigits}</p>
        {transaction.pointsEarned && (
          <p className="text-xs text-yellow-600">+{transaction.pointsEarned} pts</p>
        )}
      </div>
    </div>
  );
}

export default function CardsPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Cards</h1>
            <p className="text-gray-600 mt-1">Manage your debit, credit, and rewards cards</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
            Request New Card
          </Button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mockCards.map((card) => (
            <CardComponent key={card.id} card={card} />
          ))}
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Recent Transactions</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {mockTransactions.map((transaction) => {
                const card = mockCards.find(c => c.id === transaction.cardId);
                if (!card) return null;
                return (
                  <TransactionRow 
                    key={transaction.id} 
                    transaction={transaction} 
                    card={card} 
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CreditCardIcon className="w-8 h-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold mb-2">Block/Unblock Card</h3>
            <p className="text-sm text-gray-600">Instantly secure your cards</p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <BanknotesIcon className="w-8 h-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">Set Spending Limits</h3>
            <p className="text-sm text-gray-600">Control your card usage</p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <GiftIcon className="w-8 h-8 mx-auto mb-3 text-yellow-600" />
            <h3 className="font-semibold mb-2">Redeem Rewards</h3>
            <p className="text-sm text-gray-600">Use your earned points</p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
