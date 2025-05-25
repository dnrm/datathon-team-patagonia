"use client";

export function Statistics() {
  const categories = [
    { label: "Shopping", amount: "$ 3,650" },
    { label: "Grocery", amount: "$ 2,870" },
    { label: "Restaurants", amount: "$ 2,030" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4 text-black">Top Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.label}
              className="flex justify-between items-center"
            >
              <span className="text-gray-600">{category.label}</span>
              <span className="font-medium text-black">{category.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4 text-black">Weekly Spending</h3>
        <div className="text-2xl font-bold text-black">$ 8,550</div>
        <div className="mt-4 h-24 flex items-end gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-purple-200 rounded-t-md"
              style={{
                height: `${(i + 1) * 5 * Math.sin(i) + 40}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
