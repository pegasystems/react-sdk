import type { ReactElement } from 'react';
import AppsIcon from '@mui/icons-material/Apps';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import LinkIcon from '@mui/icons-material/Link';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

// Maps Pega `pi pi-*` icon names (suffix "-solid" ignored) to MUI icons.
const PI_ICON_MAP: Record<string, ReactElement> = {
  headline: <HomeOutlinedIcon />,
  home: <HomeOutlinedIcon />,
  truck: <LocalShippingOutlinedIcon />,
  cart: <ShoppingCartOutlinedIcon />,
  'shopping-cart': <ShoppingCartOutlinedIcon />,
  mail: <MailOutlineIcon />,
  envelope: <MailOutlineIcon />,
  document: <ArticleOutlinedIcon />,
  'file-text': <ArticleOutlinedIcon />,
  case: <WorkOutlineIcon />,
  briefcase: <WorkOutlineIcon />,
  building: <BusinessOutlinedIcon />,
  chart: <InsightsOutlinedIcon />,
  polaris: <AutoAwesomeIcon />,
  sparkle: <AutoAwesomeIcon />,
  clipboard: <AssignmentOutlinedIcon />,
  grid: <AppsIcon />
};

export function getPiIcon(piIcon: string | undefined, fallback: ReactElement = <LinkIcon />): ReactElement {
  if (!piIcon) return fallback;
  const name = piIcon
    .replace(/^pi\s+pi-/, '')
    .replace(/-solid$/, '')
    .trim();
  return PI_ICON_MAP[name] ?? fallback;
}

// Cycles through accent gradients so tiles without a configured image still look distinct.
const ACCENTS = ['ck-accent-teal', 'ck-accent-blue', 'ck-accent-violet', 'ck-accent-indigo', 'ck-accent-amber'];

export function getAccentClass(index: number): string {
  return ACCENTS[index % ACCENTS.length];
}
