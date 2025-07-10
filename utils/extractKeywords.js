function extractKeywords(text) {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopwords.includes(word));
  
    const freq = {};
  
    for (const word of words) {
      freq[word] = (freq[word] || 0) + 1;
    }
  
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }
  
  const stopwords = [
    'this', 'that', 'with', 'from', 'have', 'your', 'which', 'will',
    'been', 'were', 'they', 'their', 'there', 'some', 'such', 'into',
    'when', 'what', 'than', 'then', 'them', 'very', 'more', 'most', 'like'
  ];
  
  module.exports = { extractKeywords };
  