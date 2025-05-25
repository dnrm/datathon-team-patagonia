interface ProfileCardProps {
  clientName: string;
}

export function ProfileCard({ clientName }: ProfileCardProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <h2 className="text-black font-semibold">Mi Perfil</h2>
        <p className="text-sm text-gray-600">
          {clientName.toLowerCase().replaceAll(" ", ".")}@gmail.com
        </p>
      </div>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
        {clientName[0]}
      </div>
    </div>
  );
}
