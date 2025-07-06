import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Star, Coins, Zap, Crown, Diamond } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

interface Prize {
  id: number;
  name: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const prizes: Prize[] = [
  { id: 1, name: '10 Coins', value: 10, icon: <Coins className="w-6 h-6" />, color: '#FFD700', rarity: 'common' },
  { id: 2, name: '25 Coins', value: 25, icon: <Coins className="w-6 h-6" />, color: '#FFA500', rarity: 'common' },
  { id: 3, name: '50 Coins', value: 50, icon: <Star className="w-6 h-6" />, color: '#FF6347', rarity: 'rare' },
  { id: 4, name: '100 Coins', value: 100, icon: <Zap className="w-6 h-6" />, color: '#9370DB', rarity: 'rare' },
  { id: 5, name: '250 Coins', value: 250, icon: <Crown className="w-6 h-6" />, color: '#FF1493', rarity: 'epic' },
  { id: 6, name: '500 Coins', value: 500, icon: <Diamond className="w-6 h-6" />, color: '#00CED1', rarity: 'legendary' },
  { id: 7, name: 'Power Up', value: 1, icon: <Gift className="w-6 h-6" />, color: '#32CD32', rarity: 'rare' },
  { id: 8, name: 'Extra Life', value: 1, icon: <Star className="w-6 h-6" />, color: '#FF4500', rarity: 'epic' }
];

export const SpinWheel: React.FC<{
  onPrizeWon: (prize: Prize) => void;
  canSpin: boolean;
  spinsLeft: number;
}> = ({ onPrizeWon, canSpin, spinsLeft }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { hapticFeedback, notificationFeedback } = useTelegram();

  const spinWheel = () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    hapticFeedback('heavy');

    // Calculate random rotation (multiple full rotations + random position)
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const finalRotation = spins * 360 + Math.random() * 360;
    
    setRotation(prev => prev + finalRotation);

    // Determine winning prize based on final position
    setTimeout(() => {
      const normalizedRotation = finalRotation % 360;
      const prizeIndex = Math.floor((360 - normalizedRotation) / (360 / prizes.length));
      const wonPrize = prizes[prizeIndex] || prizes[0];
      
      setSelectedPrize(wonPrize);
      setShowResult(true);
      setIsSpinning(false);
      
      notificationFeedback('success');
      onPrizeWon(wonPrize);
    }, 3000);
  };

  const closeResult = () => {
    setShowResult(false);
    setSelectedPrize(null);
  };

  const segmentAngle = 360 / prizes.length;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Wheel Container */}
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-600"></div>
        </div>

        {/* Wheel */}
        <motion.div
          className="relative w-80 h-80 rounded-full border-8 border-yellow-400 shadow-2xl overflow-hidden"
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: "easeOut" }}
        >
          {prizes.map((prize, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;
            
            return (
              <div
                key={prize.id}
                className="absolute w-full h-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(from ${startAngle}deg, ${prize.color} 0deg, ${prize.color} ${segmentAngle}deg, transparent ${segmentAngle}deg)`,
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180)}%)`
                }}
              >
                <div
                  className="absolute flex flex-col items-center text-white font-bold text-sm"
                  style={{
                    transform: `rotate(${startAngle + segmentAngle / 2 - 90}deg) translateY(-120px)`,
                    transformOrigin: 'center'
                  }}
                >
                  <div className="transform rotate-90">
                    {prize.icon}
                  </div>
                  <div className="transform rotate-90 mt-1 text-xs whitespace-nowrap">
                    {prize.name}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-yellow-400 rounded-full border-4 border-yellow-600 flex items-center justify-center">
            <Star className="w-8 h-8 text-yellow-800" />
          </div>
        </motion.div>
      </div>

      {/* Spin Button */}
      <motion.button
        onClick={spinWheel}
        disabled={!canSpin || isSpinning}
        className={`px-8 py-4 rounded-full font-bold text-xl shadow-lg transition-all ${
          canSpin && !isSpinning
            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transform hover:scale-105'
            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        {isSpinning ? 'SPINNING...' : `SPIN (${spinsLeft} left)`}
      </motion.button>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && selectedPrize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeResult}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Congratulations!</h2>
              
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white"
                style={{ backgroundColor: selectedPrize.color }}
              >
                {selectedPrize.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-2">{selectedPrize.name}</h3>
              <p className="text-gray-600 mb-6">
                {selectedPrize.rarity.charAt(0).toUpperCase() + selectedPrize.rarity.slice(1)} Prize!
              </p>
              
              <button
                onClick={closeResult}
                className="bg-green-500 text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition-colors"
              >
                Awesome!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
