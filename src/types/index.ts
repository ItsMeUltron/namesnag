export interface AvailabilityResult {
  platform: string;
  available: boolean;
  url?: string;
  mintUrl?: string;
  icon: string;
  category: 'web3' | 'social';
  loading?: boolean;
}

export interface Platform {
  name: string;
  category: 'web3' | 'social';
  icon: string;
  checkUrl?: string;
  mintUrl?: string;
  hasApi: boolean;
}
