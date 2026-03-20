import styled, { createGlobalStyle } from 'styled-components';

/* ── colour tokens ── */
export const colors = {
  primary: '#0C2340',
  primaryLight: '#1A3A5C',
  accent: '#0071B2',
  accentHover: '#005A8E',
  surface: '#FFFFFF',
  background: '#F4F6F9',
  border: '#DDE1E6',
  textPrimary: '#1A1A1A',
  textSecondary: '#5A6872',
  success: '#198038',
  warning: '#F1C21B',
  danger: '#DA1E28'
};

/* ── global reset scoped to #nwm-root ── */
export const NwmGlobalStyle = createGlobalStyle`
  #nwm-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: ${colors.textPrimary};
    background: ${colors.background};
    min-height: 100vh;
    box-sizing: border-box;
  }

  #nwm-root *, #nwm-root *::before, #nwm-root *::after {
    box-sizing: inherit;
  }
`;

/* ── layout ── */
export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const Main = styled.main`
  flex: 1;
  width: 100%;
  padding: 24px 32px 32px;
  margin-right: 48px;
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 16px;
  color: ${colors.primary};
`;

/* ── cards ── */
export const Card = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 24px;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

/* ── buttons ── */
export const Button = styled.button<{ $variant?: 'primary' | 'outline' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;
  border: 2px solid ${({ $variant }) => ($variant === 'outline' ? colors.accent : 'transparent')};
  background: ${({ $variant }) => ($variant === 'outline' ? 'transparent' : colors.accent)};
  color: ${({ $variant }) => ($variant === 'outline' ? colors.accent : '#fff')};

  &:hover {
    background: ${({ $variant }) => ($variant === 'outline' ? colors.accent : colors.accentHover)};
    color: #fff;
  }

  &:focus-visible {
    outline: 2px solid ${colors.accent};
    outline-offset: 2px;
  }
`;
