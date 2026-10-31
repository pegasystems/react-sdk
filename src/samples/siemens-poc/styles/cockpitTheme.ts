import { createTheme, type Theme } from '@mui/material/styles';

export type CockpitMode = 'dark' | 'light';

// Same palettes as cockpit.scss (.ck-root / .ck-root.ck-light)
export const cockpitPalettes = {
  dark: {
    bg: '#0b0d22',
    surface: '#171a3a',
    surfaceRaised: '#1d2149',
    surfaceHover: '#232858',
    input: '#12152f',
    border: 'rgba(148, 163, 255, 0.14)',
    text: '#f1f3ff',
    muted: '#9aa3c7',
    subtle: '#6b7399',
    accent: '#2dd4bf',
    accentStrong: '#14b8a6',
    onAccent: '#0b0d22',
    violet: '#8b5cf6',
    action: { active: 'rgba(241, 243, 255, 0.7)', disabled: 'rgba(241, 243, 255, 0.3)', disabledBackground: 'rgba(241, 243, 255, 0.12)' }
  },
  light: {
    bg: '#f4f6fb',
    surface: '#ffffff',
    surfaceRaised: '#f1f4fa',
    surfaceHover: '#e8edf7',
    input: '#f8fafc',
    border: 'rgba(15, 23, 42, 0.1)',
    text: '#0f172a',
    muted: '#5b6478',
    subtle: '#8a93a8',
    accent: '#0d9488',
    accentStrong: '#0f766e',
    onAccent: '#ffffff',
    violet: '#7c3aed',
    action: { active: 'rgba(15, 23, 42, 0.54)', disabled: 'rgba(15, 23, 42, 0.26)', disabledBackground: 'rgba(15, 23, 42, 0.12)' }
  }
};

/**
 * Nested theme for everything rendered inside the Cockpit shell (cases, assignments, dialogs).
 * Extends the app theme so SDK-specific keys (actionButtons, card, …) keep working, just recolored.
 */
export function createCockpitTheme(outer: Theme, mode: CockpitMode = 'dark'): Theme {
  const c = cockpitPalettes[mode];
  return createTheme(
    outer as any,
    {
      palette: {
        mode,
        primary: {
          main: c.accent,
          // The SDK case header paints itself with primary.light; keep it a neutral surface so it reads like a Cockpit card.
          light: c.surfaceHover,
          dark: c.accentStrong,
          contrastText: c.onAccent
        },
        secondary: { main: c.violet, light: '#a78bfa', dark: '#6d28d9', contrastText: '#fff' },
        // Stages use info.dark for the current stage; case/assignment avatars use info.light.
        info: { main: '#3b82f6', light: '#6366f1', dark: c.accent, contrastText: '#fff' },
        background: { default: c.bg, paper: c.surface },
        text: { primary: c.text, secondary: c.muted, disabled: c.subtle },
        divider: c.border,
        // Set explicitly: the outer theme may have been resolved for the other mode.
        action: { ...c.action, hover: 'rgba(45, 212, 191, 0.08)', selected: 'rgba(45, 212, 191, 0.14)' }
      },
      shape: { borderRadius: 10 },
      actionButtons: {
        primary: { backgroundColor: c.accent, color: c.onAccent },
        secondary: { backgroundColor: c.surfaceRaised, color: c.text }
      },
      card: { backgroundColor: c.surface, borderLeft: '', borderLeftColor: '' },
      backgroundColor: c.bg,
      components: {
        MuiPaper: {
          styleOverrides: {
            root: { backgroundImage: 'none', backgroundColor: c.surface, border: `1px solid ${c.border}`, boxShadow: 'none' },
            rounded: { borderRadius: 14 }
          }
        },
        MuiCard: { styleOverrides: { root: { overflow: 'visible' } } },
        MuiCardHeader: {
          styleOverrides: {
            title: { fontWeight: 700, fontSize: '1.05rem' },
            subheader: { color: c.muted, fontSize: '0.78rem' }
          }
        },
        MuiButton: {
          defaultProps: { disableElevation: true },
          styleOverrides: {
            root: { textTransform: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', padding: '0.45rem 1rem', boxShadow: 'none' },
            containedPrimary: { '&:hover': { backgroundColor: c.accentStrong } },
            // Secondary actions (e.g. Cancel in modals) use a neutral surface rather than the violet secondary color.
            containedSecondary: { backgroundColor: c.surfaceRaised, color: c.text, '&:hover': { backgroundColor: c.surfaceHover } },
            outlined: { borderColor: c.border }
          }
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              backgroundColor: c.input,
              borderRadius: 8,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: c.border },
              '&:hover:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(45, 212, 191, 0.45)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: c.accent, borderWidth: 1 }
            }
          }
        },
        MuiInputLabel: {
          styleOverrides: { root: { color: c.muted, '&.Mui-focused': { color: c.accent } } }
        },
        MuiBreadcrumbs: {
          styleOverrides: {
            root: { '& .MuiTypography-h5': { fontSize: '0.95rem', fontWeight: 600 } },
            separator: { color: c.subtle, '& svg': { fontSize: '1rem' } }
          }
        },
        MuiDivider: { styleOverrides: { root: { borderColor: c.border } } },
        MuiAvatar: { styleOverrides: { root: { fontWeight: 700, fontSize: '0.9rem' } } },
        MuiMenu: { styleOverrides: { paper: { backgroundColor: c.surfaceRaised } } },
        MuiPopover: { styleOverrides: { paper: { backgroundColor: c.surfaceRaised } } },
        MuiAutocomplete: { styleOverrides: { paper: { backgroundColor: c.surfaceRaised } } },
        MuiDialog: {
          styleOverrides: {
            paper: { backgroundColor: c.surface, borderRadius: 16 },
            container: { backdropFilter: 'blur(2px)' }
          }
        },
        MuiBackdrop: { styleOverrides: { root: { backgroundColor: 'rgba(6, 8, 24, 0.6)' } } },
        MuiDialogTitle: {
          styleOverrides: {
            // '&&' outranks the SDK modal's makeStyles classes.
            root: { '&&': { fontSize: '1.15rem', fontWeight: 700, paddingBottom: '0.75rem', borderBottom: `1px solid ${c.border}` } }
          }
        },
        // SDK tables (SimpleTable / embedded data) hard-code light borders and a CSS-var header color via makeStyles.
        MuiTableHead: { styleOverrides: { root: { '&&': { background: c.surfaceRaised } } } },
        MuiTableCell: {
          styleOverrides: {
            root: {
              '&&': {
                padding: '0.65rem 0.9rem',
                borderRight: `1px solid ${c.border}`,
                borderBottom: `1px solid ${c.border}`,
                fontSize: '0.85rem',
                color: c.text
              },
              '&&:last-of-type': { borderRight: 0 },
              '&&.MuiTableCell-head': {
                backgroundColor: c.surfaceRaised,
                color: c.muted,
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                verticalAlign: 'middle',
                '& svg': { color: c.subtle, fontSize: '1.1rem' }
              }
            }
          }
        },
        MuiTableRow: {
          styleOverrides: { root: { '&.MuiTableRow-hover:hover, tbody &:hover': { backgroundColor: 'rgba(45, 212, 191, 0.04)' } } }
        },
        MuiLink: {
          styleOverrides: {
            root: { color: c.accent, fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }
          }
        },
        MuiTooltip: { styleOverrides: { tooltip: { backgroundColor: c.surfaceRaised, border: `1px solid ${c.border}`, fontSize: '0.75rem' } } },
        MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } }
      }
    } as any
  );
}
