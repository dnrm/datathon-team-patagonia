import { AppleIcon, YouTubeIcon, NetflixIcon } from "./icons";

const transactions = [
  {
    id: 1,
    icon: AppleIcon,
    name: "Apple Store",
    category: "Shopping",
    paymentMethod: "Payment with Apple Pay",
    amount: -1250,
    cashback: 25,
    time: "12:40 PM",
  },
  {
    id: 2,
    icon: YouTubeIcon,
    name: "YouTube",
    category: "Social Media",
    paymentMethod: "Payment with Apple Pay",
    amount: -45,
    cashback: 3,
    time: "12:40 PM",
  },
];

export function TransactionList() {
  return (
    <div className="mt-8">
      <h3 className="font-medium mb-6 text-black">Last Transaction</h3>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-white rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl">
                <transaction.icon className="w-6 h-6 text-black" />
              </div>
              <div>
                <div className="font-medium text-black">{transaction.name}</div>
                <div className="text-sm text-gray-500">
                  {transaction.category} • {transaction.paymentMethod}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <div className="text-right min-w-[120px]">
                <div className="font-medium text-black">
                  {transaction.amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </div>
                <div className="text-sm text-gray-500">
                  Cashback: {transaction.cashback}$
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
