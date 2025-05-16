export const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

export const API_ENDPOINTS = {
  auth: {
    signin: `${API_URL}/auth/signin`,
    signup: `${API_URL}/auth/signup`,
  },
  entries: {
    list: `${API_URL}/entries/en`,
    details: (word: string) => `${API_URL}/entries/en/${word}`,
    favorite: (word: string) => `${API_URL}/entries/en/${word}/favorite`,
    unfavorite: (word: string) => `${API_URL}/entries/en/${word}/unfavorite`,
  },
  user: {
    profile: `${API_URL}/user/me`,
    history: `${API_URL}/user/me/history`,
    favorites: `${API_URL}/user/me/favorites`,
  },
};
