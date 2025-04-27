import { createTheme, alpha } from '@mui/material/styles';

const themeColors = {
  primary: '#002B5B',
  secondary: '#F7931E',
  white: '#FFFFFF'
};

const theme = createTheme({
  palette: {
    primary: {
      main: themeColors.primary,
      light: alpha(themeColors.primary, 0.8),
      dark: '#001b3b',
      contrastText: themeColors.white,
    },
    secondary: {
      main: themeColors.secondary,
      light: alpha(themeColors.secondary, 0.8),
      dark: '#e58710',
      contrastText: themeColors.white,
    },
    background: {
      default: '#f8f9fa',
      paper: themeColors.white,
    },
    text: {
      primary: themeColors.primary,
      secondary: alpha(themeColors.primary, 0.7),
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: themeColors.primary,
    },
    h2: {
      fontWeight: 700,
      color: themeColors.primary,
    },
    h3: {
      fontWeight: 700,
      color: themeColors.primary,
    },
    h4: {
      fontWeight: 700,
      color: themeColors.primary,
    },
    h5: {
      fontWeight: 600,
      color: themeColors.primary,
    },
    h6: {
      fontWeight: 600,
      color: themeColors.primary,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,43,91,0.05),0px 1px 1px 0px rgba(0,43,91,0.03),0px 1px 3px 0px rgba(0,43,91,0.02)',
    '0px 3px 3px -2px rgba(0,43,91,0.06),0px 3px 4px 0px rgba(0,43,91,0.04),0px 1px 8px 0px rgba(0,43,91,0.02)',
    '0px 3px 5px -1px rgba(0,43,91,0.08),0px 5px 8px 0px rgba(0,43,91,0.05),0px 1px 14px 0px rgba(0,43,91,0.03)',
    '0px 4px 6px -2px rgba(0,43,91,0.08),0px 8px 12px 1px rgba(0,43,91,0.05),0px 3px 14px 2px rgba(0,43,91,0.03)',
    '0px 6px 10px -3px rgba(0,43,91,0.09),0px 10px 15px 1px rgba(0,43,91,0.06),0px 4px 18px 3px rgba(0,43,91,0.03)',
    '0px 8px 12px -4px rgba(0,43,91,0.1),0px 16px 24px 2px rgba(0,43,91,0.06),0px 6px 30px 5px rgba(0,43,91,0.03)',
    '0px 10px 15px -5px rgba(0,43,91,0.1),0px 20px 30px 3px rgba(0,43,91,0.06),0px 8px 40px 7px rgba(0,43,91,0.03)',
    '0px 12px 18px -6px rgba(0,43,91,0.1),0px 24px 36px 4px rgba(0,43,91,0.06),0px 10px 50px 10px rgba(0,43,91,0.03)',
    '0px 14px 20px -7px rgba(0,43,91,0.1),0px 28px 42px 5px rgba(0,43,91,0.06),0px 12px 60px 12px rgba(0,43,91,0.03)',
    '0px 16px 24px -8px rgba(0,43,91,0.1),0px 32px 48px 6px rgba(0,43,91,0.06),0px 14px 70px 14px rgba(0,43,91,0.03)',
    '0px 18px 26px -9px rgba(0,43,91,0.1),0px 36px 54px 7px rgba(0,43,91,0.06),0px 16px 80px 16px rgba(0,43,91,0.03)',
    '0px 20px 30px -10px rgba(0,43,91,0.1),0px 40px 60px 8px rgba(0,43,91,0.06),0px 18px 90px 18px rgba(0,43,91,0.03)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          padding: '12px 24px',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0, 43, 91, 0.15)',
          },
        },
        contained: {
          boxShadow: '0 4px 10px rgba(0, 43, 91, 0.1)',
        },
        containedPrimary: {
          backgroundColor: themeColors.primary,
          '&:hover': {
            backgroundColor: '#003e82',
          },
        },
        containedSecondary: {
          backgroundColor: themeColors.secondary,
          '&:hover': {
            backgroundColor: '#e58710',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
        outlinedPrimary: {
          borderColor: alpha(themeColors.primary, 0.5),
          '&:hover': {
            borderColor: themeColors.primary,
            backgroundColor: alpha(themeColors.primary, 0.04),
          },
        },
        outlinedSecondary: {
          borderColor: alpha(themeColors.secondary, 0.5),
          '&:hover': {
            borderColor: themeColors.secondary,
            backgroundColor: alpha(themeColors.secondary, 0.04),
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            transition: 'all 0.2s',
            '&:hover': {
              boxShadow: '0 0 0 1px rgba(0, 43, 91, 0.1)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 2px rgba(0, 43, 91, 0.2)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 6px 18px rgba(0, 43, 91, 0.08)',
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0, 43, 91, 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 43, 91, 0.06)',
        },
        elevation1: {
          boxShadow: '0 2px 12px rgba(0, 43, 91, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0, 43, 91, 0.08)',
        },
        elevation3: {
          boxShadow: '0 6px 20px rgba(0, 43, 91, 0.1)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: `2px solid ${themeColors.white}`,
          boxShadow: '0 2px 10px rgba(0, 43, 91, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 500,
          boxShadow: '0 2px 5px rgba(0, 43, 91, 0.08)',
        },
        colorPrimary: {
          backgroundColor: alpha(themeColors.primary, 0.12),
          color: themeColors.primary,
          '&:hover': {
            backgroundColor: alpha(themeColors.primary, 0.18),
          },
        },
        colorSecondary: {
          backgroundColor: alpha(themeColors.secondary, 0.12),
          color: themeColors.secondary,
          '&:hover': {
            backgroundColor: alpha(themeColors.secondary, 0.18),
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: '8px 0',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: alpha(themeColors.primary, 0.04),
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha(themeColors.primary, 0.08),
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        colorPrimary: {
          color: themeColors.secondary,
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '&.Mui-selected': {
            backgroundColor: alpha(themeColors.secondary, 0.12),
            color: themeColors.secondary,
            fontWeight: 600,
            '&:hover': {
              backgroundColor: alpha(themeColors.secondary, 0.18),
            },
          },
        },
      },
    },
  },
});

export default theme;