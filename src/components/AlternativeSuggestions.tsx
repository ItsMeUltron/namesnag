import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface AlternativeSuggestionsProps {
  alternatives: string[];
  onSelectAlternative: (alternative: string) => void;
}

export const AlternativeSuggestions: React.FC<AlternativeSuggestionsProps> = ({
  alternatives,
  onSelectAlternative
}) => {
  if (alternatives.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Try these alternatives</h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {alternatives.map((alternative, index) => (
          <motion.button
            key={alternative}
            onClick={() => onSelectAlternative(alternative)}
            className="bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-gray-800 px-4 py-2 rounded-full font-medium transition-all"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {alternative}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
