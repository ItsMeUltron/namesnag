import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  isLoading: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
  isLoading
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleKeyPress = (e: React.KeyEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative max-w-2xl mx-auto"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className={`relative glass-card rounded-2xl p-2 transition-all duration-300 ${
        isFocused ? 'neon-glow ring-2 ring-blue-500/20' : ''
      }`}>
        <div className="flex items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your desired name..."
              className="w-full px-6 py-4 text-lg bg-transparent border-none outline-none placeholder-gray-400 text-gray-900"
              disabled={isLoading}
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={isLoading || !value.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-medium transition-all flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">
              {isLoading ? 'Checking...' : 'Search'}
            </span>
          </motion.button>
        </div>
      </div>
      
      {/* Search suggestions */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {['zkking', 'cryptodev', 'web3builder', 'defimaster'].map((suggestion) => (
          <motion.button
            key={suggestion}
            onClick={() => {
              onChange(suggestion);
              onSearch(suggestion);
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try "{suggestion}"
          </motion.button>
        ))}
      </div>
    </motion.form>
  );
};
