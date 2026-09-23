const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80';
  if (imageUrl.startsWith('/uploads/')) return `${BASE_URL}${imageUrl}`;
  return imageUrl;
};