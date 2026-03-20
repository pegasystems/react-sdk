import Header from './Header';
import ClientHeader from './ClientHeader';
import RecentActivity from './RecentActivity';
import Sidebar from './Sidebar';
import { NwmGlobalStyle, PageWrapper, Main } from '../styles';
import { usePega } from '../../Embedded/context/PegaReadyContext';

export default function Home() {
  const { isPegaReady } = usePega();
  console.log('Is Pega Ready?', isPegaReady);

  if (!isPegaReady) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NwmGlobalStyle />
      <PageWrapper>
        <Header />
        <ClientHeader />
        <Main>
          <RecentActivity />
        </Main>
        <Sidebar />
      </PageWrapper>
    </>
  );
}
