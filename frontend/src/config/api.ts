export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  auth: {
    signin: `${API_URL}/auth/signin`,
    signup: `${API_URL}/auth/signup`,
  },
  entries: {
    list: `${API_URL}/entries/en`,
    details: (word: string) =>
      `${API_URL}/entries/en/word?word=${encodeURIComponent(word)}`,
    favorite: (word: string) =>
      `${API_URL}/entries/en/word/favorite?word=${encodeURIComponent(word)}`,
    unfavorite: (word: string) =>
      `${API_URL}/entries/en/word/unfavorite?word=${encodeURIComponent(word)}`,
  },
  user: {
    profile: `${API_URL}/user/me`,
    history: `${API_URL}/user/me/history`,
    favorites: `${API_URL}/user/me/favorites`,
  },
};
