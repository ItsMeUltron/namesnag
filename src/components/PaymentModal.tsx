import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Coins, X, Star } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

interface PaymentPackage {
  id: string;
  name: string;
  coins: number;
  price: number;
  bonus?: number;
  popular?: boolean;
}

const packages: PaymentPackage[] = [
  { id: 'small', name: 'Starter Pack', coins: 100, price: 0.99 },
  { id: 'medium', name: 'Power Pack', coins: 500, price: 4.99, bonus: 50, popular: true },
  { id: 'large', name: 'Mega Pack', coins: 1200, price: 9.99, bonus: 200 },
  { id: 'premium', name: 'Ultimate Pack', coins: 2500, price: 19.99, bonus: 500 }
];

export const PaymentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (coins: number) => void;
}> = ({ isOpen, onClose, onPurchase }) => {
  const [selectedPackage, setSelectedPackage] = useState<PaymentPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { webApp, showAlert, hapticFeedback, notificationFeedback } = useTelegram();

  const handlePurchase = async (pkg: PaymentPackage) => {
    setSelectedPackage(pkg);
    setIsProcessing(true);
    hapticFeedback('medium');

    try {
      // In a real app, you would integrate with Telegram Payments API
      // For demo purposes, we'll simulate the payment process
      
      if (webApp) {
        // Telegram WebApp payment integration would go here
        // webApp.openInvoice(invoiceUrl, callback);
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate successful payment
        const totalCoins = pkg.coins + (pkg.bonus || 0);
        onPurchase(totalCoins);
        notificationFeedback('success');
        showAlert(`Successfully purchased ${totalCoins} coins!`);
        onClose();
      } else {
        // Fallback for non-Telegram environment
        showAlert(`Demo: Would purchase ${pkg.name} for $${pkg.price}`);
        const totalCoins = pkg.coins + (pkg.bonus || 0);
        onPurchase(totalCoins);
        onClose();
      }
    } catch (error) {
      notificationFeedback('error');
      showAlert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setSelectedPackage(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-2">
                <Coins className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold">Buy Coins</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Packages */}
            <div className="p-6 space-y-4">
              {packages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    pkg.popular
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePurchase(pkg)}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>POPULAR</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{pkg.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span>{pkg.coins} coins</span>
                        {pkg.bonus && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                            +{pkg.bonus} BONUS
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        ${pkg.price}
                      </div>
                      {pkg.bonus && (
                        <div className="text-xs text-gray-500">
                          Total: {pkg.coins + pkg.bonus}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedPackage?.id === pkg.id && isProcessing && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-sm font-medium">Processing...</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CreditCard className="w-4 h-4" />
                <span>Secure payment via Telegram</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Payments are processed securely through Telegram's payment system.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
