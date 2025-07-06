export const calculateRarity = (name: string): number => {
  let score = 50; // Base score
  
  // Length factor (shorter = rarer)
  if (name.length <= 3) score += 40;
  else if (name.length <= 5) score += 25;
  else if (name.length <= 7) score += 15;
  else if (name.length >= 12) score -= 10;
  
  // Character composition
  const hasNumbers = /\d/.test(name);
  const hasSpecialChars = /[^a-zA-Z0-9]/.test(name);
  const isAlphaOnly = /^[a-zA-Z]+$/.test(name);
  
  if (isAlphaOnly) score += 10;
  if (hasNumbers) score -= 5;
  if (hasSpecialChars) score -= 10;
  
  // Dictionary words (common words are less rare)
  const commonWords = [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'
  ];
  
  if (commonWords.includes(name.toLowerCase())) {
    score -= 20;
  }
  
  // Palindromes are special
  if (name === name.split('').reverse().join('')) {
    score += 15;
  }
  
  // Repeating patterns
  if (/(.)\1{2,}/.test(name)) {
    score -= 10; // Repeating characters
  }
  
  // Premium patterns
  if (/^[a-z]{3,6}$/.test(name.toLowerCase())) {
    score += 20; // Clean short alphabetic names
  }
  
  // Ensure score is between 1 and 99
  return Math.max(1, Math.min(99, Math.round(score)));
};
