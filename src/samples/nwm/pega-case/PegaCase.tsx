import { useSearchParams, useNavigate } from 'react-router';
import styled from 'styled-components';
import { colors } from '../styles';
import Header from './Header';
import Sidebar from '../components/Sidebar';
import { useEffect } from 'react';
import { usePega } from '../../Embedded/context/PegaReadyContext';

const Page = styled.div`
  min-height: 100vh;
  background: ${colors.surface};
  overflow-x: hidden;
`;

const Content = styled.div`
  margin-right: 48px;
`;

export default function PegaCase() {
  const [searchParams] = useSearchParams();
  const casetype = searchParams.get('casetype');
  const navigate = useNavigate();
  const { isPegaReady, PegaContainer, createCase } = usePega();

  console.log('PegaCase component rendering with casetype:', casetype);

  useEffect(() => {
    if (!isPegaReady) {
      console.log('Pega is not ready yet. Waiting...');
      return;
    }

    if (!casetype) {
      navigate('/nwm');
    }

    createCase(casetype || '', {}).then(() => {
      console.log('createCase rendering is complete');
    });
  }, [casetype, navigate, isPegaReady]);

  if (!isPegaReady) {
    return <div>Loading...</div>;
  }

  const caseTypes = PCore.getEnvironmentInfo().environmentInfoObject?.pyCaseTypeList || [];
  const title = caseTypes.find(ct => ct.pyWorkTypeImplementationClassName === casetype)?.pyWorkTypeName || 'New Case';

  return (
    <Page>
      <Header title={title} user='Shivtysr Sharty' />
      <Content>{isPegaReady && <PegaContainer />}</Content>
      <Sidebar />
    </Page>
  );
}
