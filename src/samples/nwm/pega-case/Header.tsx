import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { colors } from '../styles';

const Banner = styled.header`
  background: ${colors.primary};
  color: #fff;
  width: 100%;
  padding: 0 24px;
  padding-right: 55px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const BannerInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
`;

const BannerSpacer = styled.div`
  height: 56px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const AvailableAmount = styled.div`
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 500;
`;

const BackArrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  font-size: 0.875rem;
`;

const CenterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 2;
`;

const CaseTitle = styled.span`
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.2px;
`;

const CaseUser = styled.span`
  font-size: 0.75rem;
  opacity: 0.85;
  margin-top: 2px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
`;

interface HeaderProps {
  title: string;
  user?: string;
}

export default function Header({ title, user }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      <Banner>
        <BannerInner>
          <LeftSection>
            <BackBtn onClick={() => navigate('/nwm')}>
              <BackArrow>&larr;</BackArrow>
              Return to Summary
            </BackBtn>
          </LeftSection>

          <CenterSection>
            <CaseTitle>{title}</CaseTitle>
            <CaseUser>{user}</CaseUser>
          </CenterSection>

          <RightSection>
            <AvailableAmount>
              Available loan amount: <strong>$12,500</strong>
            </AvailableAmount>
          </RightSection>
        </BannerInner>
      </Banner>
      <BannerSpacer />
    </>
  );
}
