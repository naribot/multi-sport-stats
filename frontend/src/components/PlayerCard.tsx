type Player = {
  id: number;
  name: string;
  team: string;
  goals: number;
  assists: number;
  yellowCards: number;
};

export default function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="border rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-bold">{player.name}</h2>
      <p className="text-sm text-gray-600 mb-2">{player.team}</p>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div><span className="font-medium">Goals:</span> {player.goals}</div>
        <div><span className="font-medium">Assists:</span> {player.assists}</div>
        <div><span className="font-medium">YC:</span> {player.yellowCards}</div>
      </div>
    </div>
  );
}
