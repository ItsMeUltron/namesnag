import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Copy, Check } from 'lucide-react';

export const TipJar: React.FC = () => {
  const [showTip, setShowTip] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const ethAddress = '0x742d35Cc6634C0532925a3b8D4C9db96590b5b8e';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ethAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowTip(!showTip)}
        className="flex items-center space-x-2 bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-full font-medium transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart className="w-4 h-4" />
        <span>Support</span>
      </motion.button>

      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-80 glass-card rounded-xl p-4 shadow-lg z-50"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Support NameSnag 💜</h3>
            <p className="text-sm text-gray-600 mb-3">
              Help us keep this tool free and add more features!
            </p>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">ETH/USDC Address</p>
                  <p className="text-sm font-mono text-gray-800 break-all">
                    {ethAddress}
                  </p>
                </div>
                <motion.button
                  onClick={handleCopy}
                  className="ml-2 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </motion.button>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-2 text-center">
              Every contribution helps us improve NameSnag ✨
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
