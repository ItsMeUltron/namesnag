import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';

interface RarityScoreProps {
  score: number;
  name: string;
}

export const RarityScore: React.FC<RarityScoreProps> = ({ score, name }) => {
  const getRarityLevel = (score: number) => {
    if (score >= 90) return { level: 'Legendary', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (score >= 75) return { level: 'Epic', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 50) return { level: 'Rare', color: 'text-green-600', bg: 'bg-green-100' };
    return { level: 'Common', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const rarity = getRarityLevel(score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-xl p-4 text-center"
    >
      <div className="flex items-center justify-center space-x-2 mb-2">
        <Star className={`w-5 h-5 ${rarity.color}`} />
        <span className="font-semibold text-gray-900">Name Rarity Score</span>
      </div>
      
      <div className="flex items-center justify-center space-x-3">
        <div className={`px-3 py-1 rounded-full ${rarity.bg} ${rarity.color} font-medium text-sm`}>
          {rarity.level}
        </div>
        <div className="text-2xl font-bold text-gray-900">{score}%</div>
      </div>
      
      <p className="text-sm text-gray-600 mt-2">
        "{name}" is {score}% rarer than other searches
      </p>
    </motion.div>
  );
};
