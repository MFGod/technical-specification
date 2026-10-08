import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: { main: "#243f35" },
    text: { primary: "#202923", secondary: "#626b65" },
    error: { main: "#b3261e" },
    divider: "#cddceb",
  },
  typography: {
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    h1: {
      fontSize: 32,
      fontWeight: 600,
      lineHeight: "40px",
    },
    body1: { fontSize: 16, lineHeight: "24px" },
    body2: { fontSize: 14, lineHeight: "20px" },
    button: { textTransform: "none", fontWeight: 600, fontSize: 14 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { minHeight: 44, paddingInline: 18 } },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true, size: "small" },
      styleOverrides: { root: { gap: 4 } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 4,
          fontSize: 14,
        },
        notchedOutline: { borderColor: "var(--mui-palette-divider)" },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { minWidth: 44, minHeight: 44 },
      },
    },
    MuiFormHelperText: { styleOverrides: { root: { margin: 0 } } },
    MuiFormLabel: {
      styleOverrides: {
        root: { fontSize: 14, color: "var(--mui-palette-text-secondary)" },
      },
    },
  },
});
