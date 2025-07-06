import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Lock, Sparkles } from 'lucide-react';

export const PremiumSection: React.FC = () => {
  const premiumNames = [
    { name: 'king', category: 'Royal', price: '$2,500' },
    { name: 'crypto', category: 'Finance', price: '$5,000' },
    { name: 'ai', category: 'Tech', price: '$10,000' },
    { name: 'web3', category: 'Blockchain', price: '$3,000' },
    { name: 'nft', category: 'Digital', price: '$4,000' },
    { name: 'defi', category: 'Finance', price: '$6,000' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-8 text-center"
    >
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Crown className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-900">🔥 Rare Names Available Now</h2>
        <Sparkles className="w-6 h-6 text-purple-500" />
      </div>
      
      <p className="text-gray-600 mb-6">
        Premium usernames with high market value across multiple platforms
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {premiumNames.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4"
          >
            <div className="font-bold text-gray-900 text-lg">{item.name}</div>
            <div className="text-sm text-gray-600">{item.category}</div>
            <div className="text-sm font-semibold text-green-600 mt-1">{item.price}</div>
          </motion.div>
        ))}
      </div>

      <motion.button
        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-full font-semibold flex items-center space-x-2 mx-auto transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Lock className="w-4 h-4" />
        <span>Unlock Premium for $2</span>
      </motion.button>
      
      <p className="text-xs text-gray-500 mt-3">
        Get access to premium name analytics and market insights
      </p>
    </motion.div>
  );
};
