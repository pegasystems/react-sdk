import styled from 'styled-components';
import { colors, Button } from '../styles';

const Wrapper = styled.section`
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%);
  color: #fff;
  border-radius: 10px;
  padding: 40px 36px;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
`;

const TextBlock = styled.div`
  max-width: 560px;
`;

const Greeting = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 8px;
`;

const SubText = styled.p`
  font-size: 1rem;
  margin: 0;
  opacity: 0.85;
  line-height: 1.5;
`;

const StatRow = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`;

const StatBox = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.75;
  margin-top: 2px;
`;

const HeroButton = styled(Button)`
  background: #fff;
  color: ${colors.primary};
  border: none;
  margin-top: 20px;

  &:hover {
    background: rgba(255, 255, 255, 0.88);
    color: ${colors.primary};
  }
`;

export default function HeroSection() {
  return (
    <Wrapper>
      <TextBlock>
        <Greeting>Good morning, Shivtysr</Greeting>
        <SubText>
          Here&rsquo;s a quick overview of your accounts and recent activity. Stay on top of your financial plan and explore new opportunities.
        </SubText>
        <HeroButton>View Financial Plan</HeroButton>
      </TextBlock>

      <StatRow>
        <StatBox>
          <StatValue>12</StatValue>
          <StatLabel>Active Policies</StatLabel>
        </StatBox>
        <StatBox>
          <StatValue>3</StatValue>
          <StatLabel>Pending Tasks</StatLabel>
        </StatBox>
        <StatBox>
          <StatValue>$225.17</StatValue>
          <StatLabel>Balance Due</StatLabel>
        </StatBox>
      </StatRow>
    </Wrapper>
  );
}
