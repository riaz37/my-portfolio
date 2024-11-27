export type ThemeColor = {
  DEFAULT: string;
  foreground: string;
};

export interface Theme {
  background: string;
  foreground: string;
  card: ThemeColor;
  popover: ThemeColor;
  primary: ThemeColor;
  secondary: ThemeColor;
  muted: ThemeColor;
  accent: ThemeColor;
  destructive: ThemeColor;
  border: string;
  input: string;
  ring: string;
}

export type ColorMode = 'light' | 'dark';

export interface ThemeConfig {
  darkMode: string[];
  theme: {
    container: {
      center: boolean;
      padding: string;
      screens: {
        '2xl': string;
      };
    };
    extend: {
      fontFamily: {
        mono: string[];
        inter: string[];
      };
      colors: Theme;
      borderRadius: {
        lg: string;
        md: string;
        sm: string;
      };
    };
  };
}
