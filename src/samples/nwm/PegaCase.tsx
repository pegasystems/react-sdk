import { useParams, useNavigate } from 'react-router';
import styled from 'styled-components';
import { colors } from './styles';

const Wrapper = styled.div`
  padding: 32px;
`;

const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: ${colors.accent};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-bottom: 24px;

  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: ${colors.textPrimary};
`;

const CaseTypeLabel = styled.p`
  font-size: 0.9375rem;
  color: ${colors.textSecondary};
  margin: 0;
`;

export default function PegaCase() {
  const { casetype } = useParams<{ casetype: string }>();
  const navigate = useNavigate();

  return (
    <Wrapper>
      <BackBtn onClick={() => navigate('/nwm')}>&larr; Back to Home</BackBtn>
      <Title>Create New Case</Title>
      <CaseTypeLabel>Case Type: {casetype}</CaseTypeLabel>
    </Wrapper>
  );
}
