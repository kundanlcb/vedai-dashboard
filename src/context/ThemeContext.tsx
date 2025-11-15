import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectTheme } from '@store/selectors/uiSelectors';
import { lightTheme, darkTheme } from '@styles/theme';
import { ThemeContext } from './ThemeContextType';

interface ThemeContextProviderProps {
  children: ReactNode;
}

export const ThemeContextProvider = ({ children }: ThemeContextProviderProps) => {
  const theme = useSelector(selectTheme);
  const muiTheme = theme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ThemeContext.Provider value={{ isDarkMode: theme === 'dark', toggleTheme: () => {} }}>
        {children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
};

export default ThemeContextProvider;

