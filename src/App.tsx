import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, Share2, Sparkles, Crown, Zap, Heart } from 'lucide-react';
import { SearchInput } from './components/SearchInput';
import { AvailabilityResults } from './components/AvailabilityResults';
import { AlternativeSuggestions } from './components/AlternativeSuggestions';
import { RarityScore } from './components/RarityScore';
import { TipJar } from './components/TipJar';
import { checkNameAvailability } from './services/nameChecker';
import { generateAlternatives } from './utils/nameGenerator';
import { calculateRarity } from './utils/rarityCalculator';
import type { AvailabilityResult } from './types';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<AvailabilityResult[]>([]);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [rarityScore, setRarityScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (name: string) => {
    if (!name.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const availabilityResults = await checkNameAvailability(name);
      setResults(availabilityResults);
      
      // Generate alternatives if any platform shows taken
      const hasTakenNames = availabilityResults.some(result => !result.available);
      if (hasTakenNames) {
        setAlternatives(generateAlternatives(name));
      } else {
        setAlternatives([]);
      }
      
      // Calculate rarity score
      setRarityScore(calculateRarity(name));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    const text = `🔥 Just checked "${searchTerm}" on NameSnag! ${rarityScore}% rarity score. Find your perfect Web3 name at`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">NameSnag</h1>
                <p className="text-sm text-gray-600">Web3 Name Discovery</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <TipJar />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Snag your{' '}
              <span className="gradient-text">Web3 name</span>
              <br />
              before someone else does
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Check availability across ENS, Lens, Farcaster, and socials instantly.
              <br />
              <span className="text-sm text-gray-500 mt-2 block">
                Completely free for everyone — we just help you claim it faster.
              </span>
            </p>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </motion.div>
        </div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Availability Results */}
              <AvailabilityResults
                results={results}
                searchTerm={searchTerm}
                isLoading={isLoading}
              />

              {/* Rarity Score & Share */}
              {!isLoading && results.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <RarityScore score={rarityScore} name={searchTerm} />
                  <motion.button
                    onClick={handleShare}
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share this</span>
                  </motion.button>
                </div>
              )}

              {/* Alternative Suggestions */}
              {alternatives.length > 0 && (
                <AlternativeSuggestions
                  alternatives={alternatives}
                  onSelectAlternative={(alt) => {
                    setSearchTerm(alt);
                    handleSearch(alt);
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Grid */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600 text-sm">Check 8+ platforms in seconds with real-time availability</p>
            </div>

            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Always Free</h3>
              <p className="text-gray-600 text-sm">No premium tiers, no hidden costs — completely free for everyone</p>
            </div>

            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Suggestions</h3>
              <p className="text-gray-600 text-sm">Get creative alternatives when your first choice is taken</p>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 bg-white/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Built with <Heart className="w-4 h-4 inline text-red-500" /> for the Web3 community
            </p>
            <p className="text-gray-500 text-xs mt-2">
              NameSnag helps you discover and claim usernames. We don't mint or manage identities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
