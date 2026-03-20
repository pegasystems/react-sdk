import styled from 'styled-components';
import { colors } from '../styles';

const Rail = styled.aside`
  position: fixed;
  right: 0;
  top: 56px;
  width: 48px;
  height: calc(100vh - 56px);
  background: ${colors.surface};
  border-left: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  gap: 4px;
  z-index: 90;
`;

const IconBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.textSecondary};
  font-size: 1.05rem;
  transition: background 0.15s;

  &:hover {
    background: ${colors.background};
    color: ${colors.textPrimary};
  }
`;

const Separator = styled.hr`
  width: 24px;
  border: none;
  border-top: 1px solid ${colors.border};
  margin: 4px 0;
`;

export default function Sidebar() {
  return (
    <Rail>
      <IconBtn aria-label='Notifications' title='Notifications'>
        △
      </IconBtn>
      <IconBtn aria-label='Add' title='Add'>
        +
      </IconBtn>
      <Separator />
      <IconBtn aria-label='Phone' title='Phone'>
        ☏
      </IconBtn>
      <IconBtn aria-label='Contacts' title='Contacts'>
        ◎
      </IconBtn>
      <Separator />
      <IconBtn aria-label='Link' title='Link'>
        ⊙
      </IconBtn>
      <IconBtn aria-label='Insights' title='Insights'>
        ◇
      </IconBtn>
      <div style={{ flex: 1 }} />
      <IconBtn aria-label='Help' title='Help'>
        ?
      </IconBtn>
    </Rail>
  );
}
