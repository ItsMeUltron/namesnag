import type { AvailabilityResult } from '../types';

const platforms = [
  {
    name: 'ENS',
    category: 'web3' as const,
    icon: '🌐',
    mintUrl: (name: string) => `https://app.ens.domains/name/${name}.eth/register`,
    hasApi: true
  },
  {
    name: 'Lens Protocol',
    category: 'web3' as const,
    icon: '🌿',
    mintUrl: (name: string) => `https://claim.lens.xyz/handle/${name}`,
    hasApi: false
  },
  {
    name: 'Farcaster',
    category: 'web3' as const,
    icon: '🟣',
    mintUrl: (name: string) => `https://warpcast.com/~/signup?username=${name}`,
    hasApi: false
  },
  {
    name: 'Unstoppable Domains',
    category: 'web3' as const,
    icon: '🔗',
    mintUrl: (name: string) => `https://unstoppabledomains.com/search?searchTerm=${name}`,
    hasApi: false
  },
  {
    name: 'Twitter (X)',
    category: 'social' as const,
    icon: '🐦',
    mintUrl: (name: string) => `https://twitter.com/${name}`,
    hasApi: false
  },
  {
    name: 'Telegram',
    category: 'social' as const,
    icon: '✈️',
    mintUrl: (name: string) => `https://t.me/${name}`,
    hasApi: false
  },
  {
    name: 'Discord',
    category: 'social' as const,
    icon: '🎮',
    mintUrl: (name: string) => `https://discord.com/users/${name}`,
    hasApi: false
  },
  {
    name: 'Threads',
    category: 'social' as const,
    icon: '🧵',
    mintUrl: (name: string) => `https://threads.net/@${name}`,
    hasApi: false
  }
];

// Simulate API calls with realistic delays and responses
const simulateAvailabilityCheck = async (name: string, platform: any): Promise<boolean> => {
  // Add realistic delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  
  // Simulate realistic availability based on name characteristics
  const nameLength = name.length;
  const hasNumbers = /\d/.test(name);
  const hasSpecialChars = /[^a-zA-Z0-9]/.test(name);
  
  // Shorter names are less likely to be available
  let availabilityChance = 0.3;
  
  if (nameLength > 8) availabilityChance += 0.3;
  if (nameLength > 12) availabilityChance += 0.2;
  if (hasNumbers) availabilityChance += 0.2;
  if (hasSpecialChars) availabilityChance += 0.1;
  
  // Some platforms are more saturated
  if (platform.name === 'Twitter (X)' || platform.name === 'Discord') {
    availabilityChance *= 0.6;
  }
  
  if (platform.name === 'ENS' && nameLength < 6) {
    availabilityChance *= 0.3; // Short ENS names are very rare
  }
  
  return Math.random() < availabilityChance;
};

export const checkNameAvailability = async (name: string): Promise<AvailabilityResult[]> => {
  const results: AvailabilityResult[] = [];
  
  // Check all platforms concurrently
  const promises = platforms.map(async (platform) => {
    try {
      const available = await simulateAvailabilityCheck(name, platform);
      
      return {
        platform: platform.name,
        available,
        mintUrl: available ? platform.mintUrl(name) : undefined,
        icon: platform.icon,
        category: platform.category
      };
    } catch (error) {
      console.error(`Error checking ${platform.name}:`, error);
      return {
        platform: platform.name,
        available: false,
        icon: platform.icon,
        category: platform.category
      };
    }
  });
  
  const platformResults = await Promise.all(promises);
  results.push(...platformResults);
  
  return results;
};
