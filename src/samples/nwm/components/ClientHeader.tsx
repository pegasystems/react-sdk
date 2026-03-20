import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../styles';

const Wrapper = styled.div`
  background: ${colors.primary};
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding: 20px 24px 0;
`;

const Inner = styled.div`
  padding-right: 48px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ProfileInfo = styled.div``;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const ClientLabel = styled.span`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
`;

const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${colors.success};
  color: #fff;
  font-size: 0.6875rem;

  &::after {
    content: '✓';
  }
`;

const ClientName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #fff !important;
`;

const QuickActionsBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: background 0.2s;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

const Chevron = styled.span`
  font-size: 0.625rem;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  min-width: 200px;
  z-index: 200;
  padding: 4px 0;
`;

const DropdownItem = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 10px 16px;
  font-size: 0.875rem;
  color: ${colors.textPrimary};
  cursor: pointer;

  &:hover {
    background: ${colors.background};
  }
`;

const TabsRow = styled.nav`
  display: flex;
  gap: 0;
  overflow-x: auto;
`;

const Tab = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  padding: 10px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ $active }) => ($active ? '#fff' : 'rgba(255, 255, 255, 0.6)')};
  cursor: pointer;
  white-space: nowrap;
  border-bottom: 2px solid ${({ $active }) => ($active ? '#fff' : 'transparent')};
  transition:
    color 0.15s,
    border-color 0.15s;

  &:hover {
    color: #fff;
  }
`;

const TAB_ITEMS: { label: string; hasDropdown?: boolean }[] = [
  { label: 'Profile' },
  { label: 'Accounts' },
  { label: 'Factfinding & Planning' },
  { label: 'Reports' },
  { label: 'Documents', hasDropdown: true },
  { label: 'Servicing', hasDropdown: true }
];

export default function ClientHeader() {
  const [activeTab, setActiveTab] = useState('Accounts');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Wrapper>
      <Inner>
        <TopRow>
          <ProfileInfo>
            <LabelRow>
              <ClientLabel>Client</ClientLabel>
              <VerifiedBadge />
            </LabelRow>
            <ClientName>Shivtysr Sharty</ClientName>
          </ProfileInfo>

          <div ref={menuRef} style={{ position: 'relative' }}>
            <QuickActionsBtn onClick={() => setMenuOpen(prev => !prev)}>
              Quick Actions <Chevron>&#9662;</Chevron>
            </QuickActionsBtn>
            {menuOpen && (
              <DropdownMenu role='menu'>
                <DropdownItem role='menuitem'>New Case</DropdownItem>
                <DropdownItem role='menuitem'>Send Correspondence</DropdownItem>
                <DropdownItem role='menuitem'>Schedule Meeting</DropdownItem>
              </DropdownMenu>
            )}
          </div>
        </TopRow>

        <TabsRow>
          {TAB_ITEMS.map(item => (
            <Tab key={item.label} $active={item.label === activeTab} onClick={() => setActiveTab(item.label)}>
              {item.label}
              {item.hasDropdown && <Chevron> &#9662;</Chevron>}
            </Tab>
          ))}
        </TabsRow>
      </Inner>
    </Wrapper>
  );
}
