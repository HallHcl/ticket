export const fetchNews = async (query = 'ไอที') => {
  try {
    const response = await fetch(`http://localhost:5000/api/news?q=${query}`);
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};
