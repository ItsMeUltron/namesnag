import React from 'react';
import { Trophy, Medal, Crown, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  id: number;
  name: string;
  score: number;
  avatar?: string;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { id: 1, name: 'Mario Master', score: 15420 },
  { id: 2, name: 'Coin Collector', score: 12890 },
  { id: 3, name: 'Jump King', score: 11750 },
  { id: 4, name: 'Speed Runner', score: 10200 },
  { id: 5, name: 'Platform Pro', score: 9850 },
  { id: 6, name: 'Goomba Slayer', score: 8900 },
  { id: 7, name: 'Power Up', score: 8200 },
  { id: 8, name: 'Star Collector', score: 7650 }
];

export const Leaderboard: React.FC<{
  currentScore: number;
  playerName?: string;
}> = ({ currentScore, playerName = 'You' }) => {
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-blue-500" />;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white';
      default:
        return 'bg-white border border-gray-200';
    }
  };

  // Add current player to leaderboard if they have a score
  const fullLeaderboard = currentScore > 0 
    ? [...mockLeaderboard, { id: 999, name: playerName, score: currentScore }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
    : mockLeaderboard;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold">Leaderboard</h2>
      </div>

      <div className="space-y-3">
        {fullLeaderboard.map((entry, index) => {
          const position = index + 1;
          const isCurrentPlayer = entry.name === playerName;
          
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                getRankColor(position)
              } ${isCurrentPlayer ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
            >
              <div className="flex items-center space-x-2">
                {getRankIcon(position)}
                <span className="font-bold text-lg">#{position}</span>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {entry.name.charAt(0)}
                  </div>
                  <span className={`font-medium ${isCurrentPlayer ? 'font-bold' : ''}`}>
                    {entry.name}
                    {isCurrentPlayer && ' (You)'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-lg">
                  {entry.score.toLocaleString()}
                </div>
                <div className="text-sm opacity-75">points</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {currentScore === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Play a game to see your ranking!</p>
        </div>
      )}
    </div>
  );
};
