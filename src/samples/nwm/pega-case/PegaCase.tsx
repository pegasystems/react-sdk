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
  let title = 'New Case';
  const { isPegaReady, PegaContainer, createCase } = usePega();

  useEffect(() => {
    if (!casetype) {
      navigate('/nwm');
    }

    createCase(casetype || '', {}).then(() => {
      console.log('createCase rendering is complete');
    });
  }, [casetype, navigate]);

  if (isPegaReady) {
    const caseTypes = PCore.getEnvironmentInfo().environmentInfoObject?.pyCaseTypeList || [];
    title = caseTypes.find(ct => ct.pyWorkTypeImplementationClassName === casetype)?.pyWorkTypeName || 'New Case';
  }
  return (
    <Page>
      <Header title={title} />
      <Content>{isPegaReady && <PegaContainer />}</Content>
      <Sidebar />
    </Page>
  );
}
