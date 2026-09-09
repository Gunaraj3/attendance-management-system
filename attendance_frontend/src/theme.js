import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4F46E5", // Indigo 600
      light: "#818CF8", // Indigo 400
      dark: "#3730A3", // Indigo 800
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#0EA5E9", // Sky 500
      light: "#38BDF8",
      dark: "#0369A1",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#10B981", // Emerald 500
      light: "#34D399",
      dark: "#059669",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#F43F5E", // Rose 500
      light: "#FB7185",
      dark: "#E11D48",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#F59E0B", // Amber 500
      light: "#FBBF24",
      dark: "#D97706",
      contrastText: "#FFFFFF",
    },
    info: {
      main: "#6366F1",
      light: "#A5B4FC",
      dark: "#4338CA",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F8FAFC", // Slate 50
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A", // Slate 900
      secondary: "#64748B", // Slate 500
    },
    divider: "#E2E8F0", // Slate 200
  },
  typography: {
    fontFamily: [
      '"Plus Jakarta Sans"',
      '"Inter"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#64748B",
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "#64748B",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
    "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
    "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
    "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
    "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
    ...Array(18).fill("0 10px 25px -5px rgba(0, 0, 0, 0.08)"),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "8px 18px",
          fontWeight: 600,
          boxShadow: "none",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #4338CA 0%, #4F46E5 100%)",
          },
        },
        containedSuccess: {
          background: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
        },
        containedError: {
          background: "linear-gradient(135deg, #E11D48 0%, #F43F5E 100%)",
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid #F1F5F9",
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
          transition: "all 0.25s ease",
          "&:hover": {
            boxShadow: "0 12px 28px -4px rgba(0, 0, 0, 0.08)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        rounded: {
          borderRadius: 14,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: "#475569",
          backgroundColor: "#F8FAFC",
          fontSize: "0.8125rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          borderBottom: "1px solid #E2E8F0",
        },
        body: {
          color: "#1E293B",
          fontSize: "0.875rem",
          borderBottom: "1px solid #F1F5F9",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "background-color 0.15s ease",
          "&:hover": {
            backgroundColor: "#F8FAFC",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "medium",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#E2E8F0",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#94A3B8",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4F46E5",
            borderWidth: "2px",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
