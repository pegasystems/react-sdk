import { useSearchParams, useNavigate } from 'react-router';
import styled from 'styled-components';
import { colors } from '../styles';
import Header from './Header';
import Sidebar from '../components/Sidebar';
import { useEffect } from 'react';
import { usePega } from '../../Embedded/context/PegaReadyContext';

const Page = styled.div`
  min-height: 100vh;
  background: ${colors.background};
  overflow-x: hidden;
`;

const Content = styled.div`
  padding: 32px;
  margin-right: 48px;
`;

export default function PegaCase() {
  const [searchParams] = useSearchParams();
  const casetype = searchParams.get('casetype');
  const navigate = useNavigate();
  const { isPegaReady, PegaContainer, createCase } = usePega();

  useEffect(() => {
    if (!casetype) {
      navigate('/nwm');
    }

    createCase(casetype || '', {}).then(() => {
      console.log('createCase rendering is complete');
    });
  }, [casetype, navigate]);

  return (
    <Page>
      <Header title={casetype ? decodeURIComponent(casetype) : 'New Case'} />
      <Content>{isPegaReady && <PegaContainer />}</Content>
      <Sidebar />
    </Page>
  );
}
