import React, { useState, ReactNode, useEffect } from 'react';
import { useCookies } from 'react-cookie';

type CookieContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
} | null
export const CookieContext = React.createContext<CookieContextType>(null);

export function CookieProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies();

  useEffect(() => {
    if (cookies.darkMode) {
      setDarkMode(cookies.darkMode);
    }
  }, []);
  
  const toggleDarkMode = () => {
    if (darkMode) {
      removeCookie('darkMode');
    } else {
      setCookie('darkMode', 'true', { path: '/' });
    }
    setDarkMode(!darkMode);
  }
  
  return (
    <CookieContext.Provider value={{
      darkMode,
      toggleDarkMode,
    }}>
      {children}
    </CookieContext.Provider>
  );
}