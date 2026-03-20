import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../styles';

/* ── styled pieces ── */
const Nav = styled.header`
  background: ${colors.primary};
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 56px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
`;

const NavSpacer = styled.div`
  height: 56px;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 4px;
  flex: 1;
  overflow-x: auto;
`;

const NavLink = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) => ($active ? 'rgba(255,255,255,0.15)' : 'transparent')};
  color: #fff;
  border: none;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: -2px;
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 4px;
  padding: 0 12px;
  margin-right: 16px;
  height: 34px;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: #fff;
  font-size: 0.8125rem;
  width: 180px;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.55);
  }
`;

const AvatarButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${colors.accent};
  color: #fff;
  font-weight: 700;
  font-size: 0.8125rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 44px;
  right: 0;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  min-width: 160px;
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

const LogoCircle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0071b2 0%, #00b4d8 100%);
  margin-right: 16px;
  flex-shrink: 0;
`;

const Chevron = styled.span`
  font-size: 0.625rem;
  margin-left: 4px;
  opacity: 0.7;
`;

/* ── component ── */
const NAV_ITEMS: { label: string; hasDropdown?: boolean }[] = [
  { label: 'Home' },
  { label: 'Business', hasDropdown: true },
  { label: 'Task Management', hasDropdown: true },
  { label: 'Clients', hasDropdown: true },
  { label: 'Docket' },
  { label: 'Insurance', hasDropdown: true },
  { label: 'Planning' },
  { label: 'Total Rewards' }
];

export default function Header() {
  const [active, setActive] = useState('Home');
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
    <>
      <Nav>
        <LogoCircle />

        <NavLinks>
          {NAV_ITEMS.map(item => (
            <NavLink key={item.label} $active={item.label === active} onClick={() => setActive(item.label)}>
              {item.label}
              {item.hasDropdown && <Chevron>&#9662;</Chevron>}
            </NavLink>
          ))}
        </NavLinks>

        <Spacer />

        <SearchBox>
          <SearchInput placeholder='Search' aria-label='Search' />
        </SearchBox>

        <div ref={menuRef} style={{ position: 'relative' }}>
          <AvatarButton aria-label='User menu' aria-expanded={menuOpen} onClick={() => setMenuOpen(prev => !prev)}>
            SS
          </AvatarButton>
          {menuOpen && (
            <DropdownMenu role='menu'>
              <DropdownItem role='menuitem'>My Profile</DropdownItem>
              <DropdownItem role='menuitem'>Settings</DropdownItem>
              <DropdownItem role='menuitem'>Sign Out</DropdownItem>
            </DropdownMenu>
          )}
        </div>
      </Nav>
      <NavSpacer />
    </>
  );
}
