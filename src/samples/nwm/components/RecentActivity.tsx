import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { colors, Card } from '../styles';

const PageTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 20px;
  color: ${colors.textPrimary};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${colors.border};
`;

const CardTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  color: ${colors.textPrimary};
`;

const NewRequestBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  background: ${colors.accent};
  color: #fff;
  border: none;
  transition: background 0.2s;
  position: relative;

  &:hover {
    background: ${colors.accentHover};
  }
`;

const ChevronSpan = styled.span`
  font-size: 0.625rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 20px;
  font-weight: 600;
  color: ${colors.textSecondary};
  border-bottom: 2px solid ${colors.border};
  white-space: nowrap;
  font-size: 0.8125rem;
`;

const Td = styled.td`
  padding: 14px 20px;
  border-bottom: 1px solid ${colors.border};
  color: ${colors.textPrimary};
  vertical-align: top;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  font-size: 0.8125rem;
  color: #946200;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${colors.warning};
  }
`;

const LinkText = styled.span`
  color: ${colors.accent};
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const SubText = styled.span`
  display: block;
  font-size: 0.75rem;
  color: ${colors.textSecondary};
  margin-top: 2px;
`;

const FooterRow = styled.tr`
  td {
    font-weight: 700;
    border-bottom: none;
  }
`;

/* ── Row action menu ── */
const ActionCell = styled.td`
  padding: 14px 12px;
  border-bottom: 1px solid ${colors.border};
  text-align: center;
  vertical-align: top;
  position: relative;
`;

const MoreBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: ${colors.textSecondary};
  padding: 4px 8px;
  border-radius: 4px;
  line-height: 1;

  &:hover {
    background: ${colors.background};
  }
`;

const ActionDropdown = styled.div`
  position: absolute;
  top: 40px;
  right: 12px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  min-width: 200px;
  z-index: 200;
  padding: 4px 0;
`;

const ActionItem = styled.button`
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

/* ── New Request dropdown ── */
const NewRequestDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  min-width: max-content;
  z-index: 200;
  padding: 4px 0;
`;

export default function RecentActivity() {
  const [rowMenuOpen, setRowMenuOpen] = useState(false);
  const [newReqMenuOpen, setNewReqMenuOpen] = useState(false);
  const rowMenuRef = useRef<HTMLTableCellElement>(null);
  const newReqRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const caseTypes = PCore.getEnvironmentInfo().environmentInfoObject?.pyCaseTypeList || [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rowMenuRef.current && !rowMenuRef.current.contains(e.target as Node)) {
        setRowMenuOpen(false);
      }
      if (newReqRef.current && !newReqRef.current.contains(e.target as Node)) {
        setNewReqMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateCase = (caseType: string) => {
    setNewReqMenuOpen(false);
    navigate(`/pega-case/${encodeURIComponent(caseType)}`);
  };

  return (
    <section>
      <PageTitle>Payments &amp; Transactions</PageTitle>

      <Card style={{ padding: 0, overflow: 'visible' }}>
        <CardHeader>
          <CardTitle>Billing Accounts</CardTitle>
          <div ref={newReqRef} style={{ position: 'relative' }}>
            <NewRequestBtn onClick={() => setNewReqMenuOpen(prev => !prev)}>
              New Request <ChevronSpan>&#9662;</ChevronSpan>
            </NewRequestBtn>
            {newReqMenuOpen && (
              <NewRequestDropdown role='menu'>
                {caseTypes.map(ct => (
                  <ActionItem
                    key={ct.pyWorkTypeImplementationClassName}
                    role='menuitem'
                    onClick={() => handleCreateCase(ct.pyWorkTypeImplementationClassName)}
                  >
                    {ct.pyWorkTypeName}
                  </ActionItem>
                ))}
              </NewRequestDropdown>
            )}
          </div>
        </CardHeader>

        <Table>
          <thead>
            <tr>
              <Th>Payer</Th>
              <Th>Billing Account (ISA)</Th>
              <Th>Status</Th>
              <Th>Due Date/Frequency</Th>
              <Th style={{ textAlign: 'right' }}>Account Surplus</Th>
              <Th style={{ width: 48 }} />
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Shivtysr Sharty</Td>
              <Td>
                <LinkText>3972875</LinkText>
                <SubText>Billing Account</SubText>
              </Td>
              <Td>
                <StatusBadge>Pending Payment</StatusBadge>
              </Td>
              <Td>
                08/19/33
                <SubText>Quarterly</SubText>
              </Td>
              <Td style={{ textAlign: 'right' }}>$36,023.63</Td>
              <ActionCell ref={rowMenuRef}>
                <MoreBtn aria-label='Row actions' onClick={() => setRowMenuOpen(prev => !prev)}>
                  &#8942;
                </MoreBtn>
                {rowMenuOpen && (
                  <ActionDropdown role='menu'>
                    <ActionItem role='menuitem'>Manage Billing Account</ActionItem>
                    <ActionItem role='menuitem'>Cancel EFT Payment</ActionItem>
                  </ActionDropdown>
                )}
              </ActionCell>
            </tr>
            <FooterRow>
              <Td colSpan={4}>Total</Td>
              <Td style={{ textAlign: 'right' }}>$225.17</Td>
              <Td />
            </FooterRow>
          </tbody>
        </Table>
      </Card>
    </section>
  );
}
