import styled from 'styled-components';
import { colors } from '../styles';

const Banner = styled.header`
  background: ${colors.primary};
  color: #fff;
  width: 100%;
  padding: 14px 24px;
  text-align: center;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: 0.2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const BannerSpacer = styled.div`
  height: 49px;
`;

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <>
      <Banner>{title}</Banner>
      <BannerSpacer />
    </>
  );
}
