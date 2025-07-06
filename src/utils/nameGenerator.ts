export const generateAlternatives = (baseName: string): string[] => {
  const alternatives: string[] = [];
  
  // Add numbers
  alternatives.push(`${baseName}1`, `${baseName}2`, `${baseName}3`);
  
  // Add prefixes
  const prefixes = ['the', 'real', 'official', 'crypto', 'web3', 'zk'];
  alternatives.push(...prefixes.slice(0, 2).map(prefix => `${prefix}${baseName}`));
  
  // Add suffixes
  const suffixes = ['x', 'pro', 'dev', 'eth', 'dao', 'fi'];
  alternatives.push(...suffixes.slice(0, 2).map(suffix => `${baseName}${suffix}`));
  
  // Character substitutions
  const substitutions: Record<string, string> = {
    'o': '0',
    'i': '1',
    'e': '3',
    'a': '@',
    's': '$'
  };
  
  let substituted = baseName;
  for (const [char, replacement] of Object.entries(substitutions)) {
    if (baseName.includes(char)) {
      substituted = baseName.replace(char, replacement);
      alternatives.push(substituted);
      break;
    }
  }
  
  // Remove duplicates and limit to 5
  return [...new Set(alternatives)].slice(0, 5);
};
