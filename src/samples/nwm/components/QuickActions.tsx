import styled from 'styled-components';
import { colors, Card, CardGrid, SectionTitle } from '../styles';

const ActionCard = styled(Card)`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  transition:
    box-shadow 0.2s,
    transform 0.15s;

  &:hover {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const IconCircle = styled.div<{ $bg: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.25rem;
`;

const ActionTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 4px;
  color: ${colors.textPrimary};
`;

const ActionDesc = styled.p`
  font-size: 0.8125rem;
  margin: 0;
  color: ${colors.textSecondary};
  line-height: 1.45;
`;

const ACTIONS = [
  {
    icon: '📄',
    bg: '#E8F5E9',
    title: 'Manage Billing Account',
    desc: 'View and update billing account details, payment methods, and schedules.'
  },
  {
    icon: '💳',
    bg: '#E3F2FD',
    title: 'Make a Payment',
    desc: 'Submit a one-time payment or set up automatic recurring payments.'
  },
  {
    icon: '📋',
    bg: '#FFF3E0',
    title: 'View Policies',
    desc: 'Review your active policies, coverage details, and beneficiaries.'
  },
  {
    icon: '📊',
    bg: '#F3E5F5',
    title: 'Reports & Analytics',
    desc: 'Access financial reports, account statements, and planning insights.'
  }
];

export default function QuickActions() {
  return (
    <section>
      <SectionTitle>Quick Actions</SectionTitle>
      <CardGrid>
        {ACTIONS.map(a => (
          <ActionCard key={a.title} tabIndex={0} role='button' aria-label={a.title}>
            <IconCircle $bg={a.bg}>{a.icon}</IconCircle>
            <div>
              <ActionTitle>{a.title}</ActionTitle>
              <ActionDesc>{a.desc}</ActionDesc>
            </div>
          </ActionCard>
        ))}
      </CardGrid>
    </section>
  );
}
