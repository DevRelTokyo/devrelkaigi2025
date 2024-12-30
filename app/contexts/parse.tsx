import React, { ReactNode } from 'react';
import BrowserParse from 'parse';
import NodeParse from 'parse/node';

type ParseContextType = {
  Parse: typeof Parse;
} | null

export const ParseContext = React.createContext<ParseContextType>(null);

interface ParseProviderProps {
  appId: string;
  jsKey: string;
  serverUrl: string;
  children: ReactNode;
}

if (typeof localStorage === 'undefined') {
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  };
}

export function ParseProvider({ children, appId, jsKey, serverUrl }: ParseProviderProps) {
  BrowserParse.initialize(appId, jsKey);
  BrowserParse.serverURL = serverUrl;
  NodeParse.initialize(appId, jsKey);
  NodeParse.serverURL = serverUrl;
  return (
    <ParseContext.Provider value={{
      Parse: typeof window === 'undefined' ? NodeParse : BrowserParse,
    }}>
      {children}
    </ParseContext.Provider>
  );
}