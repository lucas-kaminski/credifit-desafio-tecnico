function getAuthToken(): string | null {
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith('auth_token=')
  );
  if (!authCookie) return null;
  return authCookie.split('=')[1].trim();
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: token } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    document.cookie =
      'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response;
}
