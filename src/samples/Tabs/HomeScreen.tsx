import type { CaseTypeInfo } from './context/PegaProvider';
import './styles.css';

interface HomeScreenProps {
  isPegaReady: boolean;
  caseTypes: CaseTypeInfo[];
  onCreateCase: (caseType: CaseTypeInfo) => void;
}

export default function HomeScreen({ isPegaReady, caseTypes, onCreateCase }: HomeScreenProps) {
  return (
    <div className='tabs-home'>
      <h1 className='tabs-home-title'>Home</h1>
      <p className='tabs-home-subtitle'>Select a case type to open it in a dedicated tab.</p>

      {!isPegaReady && <p className='tabs-home-status'>Loading case types…</p>}

      {isPegaReady && caseTypes.length === 0 && <p className='tabs-home-status'>No case types are available to create.</p>}

      <div className='tabs-casetype-grid'>
        {caseTypes.map(caseType => (
          <button key={caseType.id} type='button' className='tabs-casetype-card' onClick={() => onCreateCase(caseType)}>
            <span className='tabs-casetype-name'>{caseType.name}</span>
            <span className='tabs-casetype-action'>Create case</span>
          </button>
        ))}
      </div>
    </div>
  );
}
