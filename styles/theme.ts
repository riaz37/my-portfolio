export const themeColors = {
  dark: {
    // Modern dark theme with deep, rich colors and high contrast
    background: '#0A0F1E', // Deep space blue
    foreground: '#E8ECFF', // Soft white with blue tint
    card: '#131B2E', // Rich navy blue
    'card-foreground': '#E8ECFF',
    popover: '#131B2E',
    'popover-foreground': '#E8ECFF',
    primary: '#7C3AED', // Vibrant purple
    'primary-foreground': '#FFFFFF',
    secondary: '#2DD4BF', // Turquoise
    'secondary-foreground': '#0A0F1E',
    muted: '#1E293B',
    'muted-foreground': '#94A3B8',
    accent: '#F59E0B', // Warm amber
    'accent-foreground': '#0A0F1E',
    destructive: '#EF4444',
    'destructive-foreground': '#FFFFFF',
    border: '#1E293B',
    input: '#1E293B',
    ring: '#7C3AED',
  },
  light: {
    // Fresh light theme with subtle depth
    background: '#F8FAFF', // Cool white
    foreground: '#0F172A',
    card: '#FFFFFF',
    'card-foreground': '#0F172A',
    popover: '#FFFFFF',
    'popover-foreground': '#0F172A',
    primary: '#7C3AED', // Vibrant purple
    'primary-foreground': '#FFFFFF',
    secondary: '#2DD4BF', // Turquoise
    'secondary-foreground': '#FFFFFF',
    muted: '#F1F5F9',
    'muted-foreground': '#64748B',
    accent: '#F59E0B', // Warm amber
    'accent-foreground': '#0F172A',
    destructive: '#EF4444',
    'destructive-foreground': '#FFFFFF',
    border: '#E2E8F0',
    input: '#E2E8F0',
    ring: '#7C3AED',
  },
  gradients: {
    // Modern, energetic gradients
    primary: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', // Purple gradient
    secondary: 'linear-gradient(135deg, #2DD4BF 0%, #0D9488 100%)', // Turquoise gradient
    accent: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', // Amber gradient
    aurora: 'linear-gradient(135deg, #7C3AED 0%, #2DD4BF 50%, #F59E0B 100%)', // Tri-color blend
    cosmic: 'linear-gradient(135deg, #0A0F1E 0%, #1E293B 50%, #7C3AED 100%)', // Space theme
    sunset: 'linear-gradient(135deg, #7C3AED 0%, #F59E0B 100%)', // Purple to amber
    ocean: 'linear-gradient(135deg, #2DD4BF 0%, #7C3AED 100%)', // Turquoise to purple
    subtle: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(45, 212, 191, 0.1) 100%)',
  },
  animations: {
    gradient: {
      primary: 'gradient-primary 6s ease infinite',
      secondary: 'gradient-secondary 6s ease infinite',
      accent: 'gradient-accent 6s ease infinite',
      aurora: 'gradient-aurora 8s ease infinite',
      cosmic: 'gradient-cosmic 8s ease infinite',
      sunset: 'gradient-sunset 8s ease infinite',
      ocean: 'gradient-ocean 8s ease infinite',
    },
    transition: {
      fast: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      medium: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  effects: {
    glow: {
      primary: '0 0 25px rgba(99, 102, 241, 0.5)',
      secondary: '0 0 25px rgba(16, 185, 129, 0.5)',
      accent: '0 0 25px rgba(244, 63, 94, 0.5)',
      soft: '0 0 15px rgba(99, 102, 241, 0.2)',
    },
    glassmorphism: {
      light: 'rgba(255, 255, 255, 0.1)',
      dark: 'rgba(17, 24, 39, 0.7)',
    },
    blur: {
      sm: '8px',
      md: '12px',
      lg: '24px',
      xl: '32px',
    },
  },
  shadows: {
    sm: '0 1px 2px rgba(17, 24, 39, 0.1)',
    md: '0 4px 6px rgba(17, 24, 39, 0.1)',
    lg: '0 10px 15px rgba(17, 24, 39, 0.1)',
    xl: '0 20px 25px rgba(17, 24, 39, 0.1)',
    inner: 'inset 0 2px 4px rgba(17, 24, 39, 0.1)',
    glow: '0 0 15px rgba(99, 102, 241, 0.3)',
  },
  typography: {
    heading: {
      fontFamily: 'var(--font-jetbrains-mono)',
      letterSpacing: '-0.02em',
      lineHeight: '1.2',
    },
    body: {
      fontFamily: 'var(--font-inter)',
      letterSpacing: '-0.01em',
      lineHeight: '1.6',
    },
  },
};
