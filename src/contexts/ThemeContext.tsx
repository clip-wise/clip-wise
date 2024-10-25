// import React, { createContext, useContext, ReactNode, useState } from 'react';
// import { Theme } from '../types';
// import { useStorage } from '../hooks/useStorage';

// interface ThemeContextType {
//   theme: Theme;
//   toggleTheme: () => void;
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [theme, setTheme] = useState<Theme>({ mode: 'light' });

//   try {
//     const [storedTheme, setStoredTheme] = useStorage<Theme>('theme', {
//       mode: 'light',
//     });

//     const toggleTheme = () => {
//       const newTheme = {
//         mode: storedTheme.mode === 'light' ? 'dark' : 'light',
//       };
//       setStoredTheme(newTheme as Theme);
//     };

//     return (
//       <ThemeContext.Provider value={{ theme: storedTheme, toggleTheme }}>
//         {children}
//       </ThemeContext.Provider>
//     );
//   } catch (error) {
//     console.error('Error accessing chrome.storage:', error);

//     const toggleTheme = () => {
//       setTheme((prevTheme) => ({
//         mode: prevTheme.mode === 'light' ? 'dark' : 'light',
//       }));
//     };

//     return (
//       <ThemeContext.Provider value={{ theme, toggleTheme }}>
//         {children}
//       </ThemeContext.Provider>
//     );
//   }
// };

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };
