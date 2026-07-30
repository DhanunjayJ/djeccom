const USER_STORAGE_KEY = "user";

export function getStoredUser() {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function storeUser(user) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function getAccessToken() {
  return getStoredUser()?.accessToken ?? null;
}
