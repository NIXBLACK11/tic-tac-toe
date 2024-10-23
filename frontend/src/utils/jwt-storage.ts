const JWT_KEY = "nixarcade_jwt";

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value};domain=.nixarcade.fun;Secure;SameSite=None`;
};

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    const val = cookieValue?.split(",")[0];
    return val ? val : null;
  }
  return null;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=; domain=.nixarcade.fun;Secure;SameSite=None`;
};

export const saveJWT = (token: string) => {
  setCookie(JWT_KEY, token);
};

export const getJWT = () => {
  return getCookie(JWT_KEY);
};

export const removeJWT = () => {
  removeCookie(JWT_KEY);
};
