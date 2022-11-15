import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-test-id' });
