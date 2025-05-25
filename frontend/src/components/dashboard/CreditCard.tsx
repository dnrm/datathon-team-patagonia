export function CreditCard({ clientName }: { clientName: string }) {
  return (
    <div className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-lg">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hey_card.png')",
        }}
      />
      <div className="absolute inset-0 px-8 flex py-5 flex-col items-start justify-end text-white">
        <div className="space-y-1">
          <div className="card-number">
            <div className="card-number-group">
              <div className="card-number-group-item text-sm font-semibold opacity-85">
                CARD NUMBER
              </div>
              <div className="card-number-group-item font-mono text-xl">
                1234 5678 9012 3456
              </div>
            </div>
          </div>
          <div className="flex justify-between items-end text-sm">
            <div>
              <div className="opacity-70">Name</div>
              <h1 className="text-2xl font-medium uppercase bg-[#12121200]">
                {clientName}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
