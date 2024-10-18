import { createContext, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextProps = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

export const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export function ThemeContextProvider({children}: {children: React.ReactNode}) {
  const [theme, setTheme] = useState<Theme>("light");

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
