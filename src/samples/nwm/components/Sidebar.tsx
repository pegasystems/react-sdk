import styled from 'styled-components';
import { colors } from '../styles';

const Rail = styled.aside`
  position: fixed;
  right: 0;
  top: 0;
  width: 48px;
  height: 100vh;
  background: ${colors.surface};
  border-left: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  gap: 6px;
  z-index: 110;
`;

const IconBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 6px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.textSecondary};
  font-size: 1rem;
  transition: background 0.15s;

  &:hover {
    background: ${colors.background};
    color: ${colors.textPrimary};
  }
`;

const Separator = styled.hr`
  width: 20px;
  border: none;
  border-top: 1px solid ${colors.border};
  margin: 2px 0;
`;

/* ── inline SVG icons to match the screenshot ── */
const SvgIcon = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d={d} />
  </svg>
);

const PenIcon = () => <SvgIcon d='M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z' />;
const PhoneIcon = () => (
  <SvgIcon d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
);
const GlobeIcon = () => (
  <svg width={18} height={18} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <circle cx='12' cy='12' r='10' />
    <path d='M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
  </svg>
);
const LinkIcon = () => (
  <SvgIcon d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
);
const LightbulbIcon = () => <SvgIcon d='M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z' />;
const GearIcon = () => (
  <svg width={18} height={18} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <circle cx='12' cy='12' r='3' />
    <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1.08 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1.08z' />
  </svg>
);
const HelpIcon = () => (
  <svg width={18} height={18} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <circle cx='12' cy='12' r='10' />
    <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01' />
  </svg>
);

export default function Sidebar() {
  return (
    <Rail>
      <IconBtn aria-label='Edit' title='Edit'>
        <PenIcon />
      </IconBtn>
      <Separator />
      <IconBtn aria-label='Phone' title='Phone'>
        <PhoneIcon />
      </IconBtn>
      <IconBtn aria-label='Globe' title='Globe'>
        <GlobeIcon />
      </IconBtn>
      <Separator />
      <IconBtn aria-label='Link' title='Link'>
        <LinkIcon />
      </IconBtn>
      <IconBtn aria-label='Insights' title='Insights'>
        <LightbulbIcon />
      </IconBtn>
      <div style={{ flex: 1 }} />
      <IconBtn aria-label='Settings' title='Settings'>
        <GearIcon />
      </IconBtn>
      <IconBtn aria-label='Help' title='Help'>
        <HelpIcon />
      </IconBtn>
    </Rail>
  );
}
