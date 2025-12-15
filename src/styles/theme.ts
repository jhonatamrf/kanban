// styles/theme.ts
export const theme = {
  colors: {
    primary: {
      main: '#4F46E5',
      light: '#818CF8',
      dark: '#3730A3',
    },
    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    infoLight: '#93C5FD',
    success: '#10B981',
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
    border: '#E5E7EB',
  },
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    large: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  borderRadius: {
    small: '6px',
    medium: '8px',
    large: '12px',
  },
  spacing: (factor: number) => `${0.25 * factor}rem`,
};