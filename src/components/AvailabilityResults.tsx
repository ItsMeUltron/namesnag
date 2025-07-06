import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Check, X, Loader2 } from 'lucide-react';
import type { AvailabilityResult } from '../types';

interface AvailabilityResultsProps {
  results: AvailabilityResult[];
  searchTerm: string;
  isLoading: boolean;
}

export const AvailabilityResults: React.FC<AvailabilityResultsProps> = ({
  results,
  searchTerm,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Checking availability across platforms...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) return null;

  const web3Results = results.filter(r => r.category === 'web3');
  const socialResults = results.filter(r => r.category === 'social');

  const ResultCard: React.FC<{ result: AvailabilityResult; index: number }> = ({ result, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass-card rounded-xl p-4 ${
        result.available ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{result.icon}</div>
          <div>
            <h3 className="font-semibold text-gray-900">{result.platform}</h3>
            <p className="text-sm text-gray-600">
              {result.available ? 'Available' : 'Taken'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            result.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {result.available ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </div>
          
          {result.available && result.mintUrl && (
            <motion.a
              href={result.mintUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Claim Now</span>
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Results for "{searchTerm}"
        </h2>
        <p className="text-gray-600">
          {results.filter(r => r.available).length} of {results.length} platforms available
        </p>
      </div>

      {/* Web3 Platforms */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🌐</span>
          Web3 Platforms
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {web3Results.map((result, index) => (
            <ResultCard key={result.platform} result={result} index={index} />
          ))}
        </div>
      </div>

      {/* Social Platforms */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">📱</span>
          Social Platforms
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialResults.map((result, index) => (
            <ResultCard key={result.platform} result={result} index={index + web3Results.length} />
          ))}
        </div>
      </div>
    </div>
  );
};
