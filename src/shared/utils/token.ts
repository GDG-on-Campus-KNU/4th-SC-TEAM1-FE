const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const storage = localStorage;

type TokenHandler = {
  set: (token: string) => void;
  get: () => string | null;
  remove: () => void;
};

const createTokenHandler = (key: string): TokenHandler => ({
  set: (token: string) => storage.setItem(key, token),
  get: () => storage.getItem(key),
  remove: () => storage.removeItem(key),
});

export const accessToken = createTokenHandler(ACCESS_TOKEN_KEY);
export const refreshToken = createTokenHandler(REFRESH_TOKEN_KEY);

export const clearTokens = () => {
  accessToken.remove();
  refreshToken.remove();
};
