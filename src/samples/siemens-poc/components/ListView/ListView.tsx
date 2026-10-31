import { useEffect, useMemo, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SdkListView from '@pega/react-sdk-components/lib/components/template/ListView';

import { localize, useCockpit } from '../../context/CockpitContext';

interface ListViewProps {
  getPConnect: () => typeof PConnect;
  parameters?: Record<string, unknown>;
  [key: string]: any;
}

interface Column {
  field: string;
  label: string;
  type: string;
  isLink: boolean;
}

interface Preset {
  id: string;
  label: string;
  columns: Column[];
  filter?: { field: string; comparator: string; value: unknown };
}

const PAGE_SIZE = 10;
const HIGH_PRIORITY = 75;

function humanize(field: string) {
  return field.replace(/^p[xyz]/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
}

function toColumns(preset: any, classID: string): Column[] {
  const fields = preset?.children?.[0]?.children ?? [];
  return fields.map((item: any) => {
    const field = String(item.config?.value ?? '').replace(/^@P \./, '');
    const metaLabel = (PCore.getMetadataUtils().getPropertyMetadata(field, classID) as any)?.label;
    const authored = String(item.config?.label ?? '');
    return {
      field,
      label: localize(authored.startsWith('@') ? metaLabel || humanize(field) : authored),
      type: item.type,
      isLink: item.config?.additionalDetails?.type === 'DISPLAY_LINK'
    };
  });
}

// Supports the simple single-condition filters authored on list presets (EQ / NEQ).
function toFilter(preset: any): Preset['filter'] {
  try {
    const condition = JSON.parse(preset?.config?.filterExpression ?? 'null')?.condition;
    if (!condition?.lhs?.field) return undefined;
    const raw = condition.rhs?.value;
    const value = typeof raw === 'string' && raw.startsWith('"') ? JSON.parse(raw) : raw;
    return { field: condition.lhs.field, comparator: condition.comparator, value };
  } catch {
    return undefined;
  }
}

function matches(row: any, filter: Preset['filter']) {
  if (!filter) return true;
  const equal = String(row[filter.field] ?? '') === String(filter.value ?? '');
  if (filter.comparator === 'EQ') return equal;
  if (filter.comparator === 'NEQ') return !equal;
  return true;
}

function resolveParameters(dpMeta: any, parameters: Record<string, unknown> = {}) {
  const operatorId = PCore.getEnvironmentInfo().getOperatorIdentifier();
  return (dpMeta?.parameters ?? []).reduce((acc: Record<string, unknown>, param: any) => {
    // Worklist data pages are typically keyed by the current operator when the view doesn't bind the parameter.
    acc[param.name] = parameters[param.name] ?? (/operator/i.test(param.name) ? operatorId : param.defaultValue);
    return acc;
  }, {});
}

function isPegaAssignment(row: any) {
  // Worklist rows from Pega carry an assignment handle; rows from external tools (SAP Ariba, Salesforce, …) don't.
  return typeof row.pzInsKey === 'string' && row.pzInsKey.toUpperCase().startsWith('ASSIGN-');
}

export default function CockpitListView(props: ListViewProps) {
  const { enabled } = useCockpit();
  const config: any = props.getPConnect().getComponentConfig();
  const referenceList = config?.referenceList;
  const dpMeta: any = typeof referenceList === 'string' ? PCore.getMetadataUtils().getDataPageMetadata(referenceList) : null;

  if (!enabled || !dpMeta?.isAssignObject) {
    return <SdkListView {...(props as any)} />;
  }

  return <Taskboard {...props} config={config} dpMeta={dpMeta} />;
}

function Taskboard({ getPConnect, parameters, config, dpMeta }: ListViewProps & { config: any; dpMeta: any }) {
  const { setAssignments } = useCockpit();
  const pConn = getPConnect();
  const [rows, setRows] = useState<any[] | null>(null);
  const [error, setError] = useState('');
  const [presetIndex, setPresetIndex] = useState(0);
  const [page, setPage] = useState(1);

  const presets: Preset[] = useMemo(
    () =>
      (config.presets ?? []).map((preset: any, index: number) => ({
        id: preset.id ?? `preset-${index}`,
        label: localize(preset.label) || localize('Tasks'),
        columns: toColumns(preset, dpMeta.classID),
        filter: toFilter(preset)
      })),
    [config]
  );

  useEffect(() => {
    PCore.getDataPageUtils()
      .getDataAsync(config.referenceList, pConn.getContextName(), resolveParameters(dpMeta, parameters))
      .then((response: any) => {
        const data = response?.data ?? [];
        setRows(data);
        setAssignments(data);
      })
      .catch(err => {
        console.error(`Unable to load ${config.referenceList}`, err);
        setError(localize('Unable to load tasks'));
        setRows([]);
      });
    return () => setAssignments(null);
  }, [config.referenceList]);

  const preset = presets[presetIndex];
  const filtered = useMemo(() => (rows ?? []).filter(row => matches(row, preset?.filter)), [rows, preset]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const title = localize(pConn.getInheritedProps()?.label || config.title || 'My Taskboard');

  const start = (row: any) => {
    if (isPegaAssignment(row)) {
      pConn
        .getActionsApi()
        .openAssignment(row.pzInsKey, row.pxRefObjectClass, { containerName: 'primary', channelName: '' } as any)
        .catch((err: unknown) => console.error(`Unable to open assignment ${row.pzInsKey}`, err));
      return;
    }
    if (row.RedirectURL) {
      window.open(row.RedirectURL, '_blank', 'noopener');
    }
  };

  return (
    <section className='ck-card ck-taskboard' aria-label={title}>
      <div className='ck-taskboard-header'>
        <h2>{title}</h2>
        {presets.length > 1 && (
          <div className='ck-tabs' role='tablist' aria-label={localize('Taskboard views')}>
            {presets.map((item, index) => (
              <button
                key={item.id}
                type='button'
                role='tab'
                aria-selected={index === presetIndex}
                className={`ck-tab ${index === presetIndex ? 'ck-tab-active' : ''}`}
                onClick={() => {
                  setPresetIndex(index);
                  setPage(1);
                }}
              >
                {`${item.label} (${(rows ?? []).filter(row => matches(row, item.filter)).length})`}
              </button>
            ))}
          </div>
        )}
      </div>

      <table className='ck-table'>
        <thead>
          <tr>
            <th scope='col'>#</th>
            {preset?.columns.map(column => (
              <th key={column.field} scope='col'>
                {column.label}
              </th>
            ))}
            <th scope='col'>{localize('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {rows === null && (
            <tr>
              <td colSpan={(preset?.columns.length ?? 0) + 2}>{localize('Loading tasks...')}</td>
            </tr>
          )}
          {rows !== null && pageRows.length === 0 && (
            <tr>
              <td colSpan={(preset?.columns.length ?? 0) + 2}>{error || localize('No tasks')}</td>
            </tr>
          )}
          {pageRows.map((row, index) => (
            <tr key={row.pzInsKey ?? index}>
              <td className='ck-row-index'>{String((page - 1) * PAGE_SIZE + index + 1).padStart(2, '0')}</td>
              {preset.columns.map(column => (
                <td key={column.field}>
                  <Cell column={column} value={row[column.field]} />
                </td>
              ))}
              <td>
                <button
                  type='button'
                  className='ck-start'
                  title={isPegaAssignment(row) ? undefined : localize('Opens in a new tab')}
                  onClick={() => start(row)}
                >
                  {`${localize('Start')} ${isPegaAssignment(row) ? '→' : '↗'}`}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='ck-taskboard-footer'>
        <span>{`${filtered.length} ${localize('tasks')}`}</span>
        <div className='ck-pager'>
          <IconButton aria-label={localize('Previous page')} disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeftIcon fontSize='small' />
          </IconButton>
          <span>{`${page} / ${pageCount}`}</span>
          <IconButton aria-label={localize('Next page')} disabled={page >= pageCount} onClick={() => setPage(page + 1)}>
            <ChevronRightIcon fontSize='small' />
          </IconButton>
        </div>
      </div>
    </section>
  );
}

function Cell({ column, value }: { column: Column; value: any }) {
  if (value === null || value === undefined || value === '') return <span className='ck-row-index'>—</span>;

  if (column.isLink) {
    return (
      <span className='ck-task'>
        <span className='ck-task-icon'>
          <DescriptionOutlinedIcon />
        </span>
        {value}
      </span>
    );
  }
  if (column.type === 'Integer' || column.type === 'Decimal') {
    const high = /priority|urgency/i.test(column.field) && Number(value) >= HIGH_PRIORITY;
    return <span className={`ck-pill ${high ? 'ck-pill-high' : ''}`}>{value}</span>;
  }
  if (column.type === 'DateTime' || column.type === 'Date') {
    const date = new Date(value);
    return <span>{Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()}</span>;
  }
  if (/\[.+\]$/.test(String(value))) {
    // Case references ("Purchase Request [PRQ8209]") get the reference styling.
    return <span className='ck-reference'>{value}</span>;
  }
  return <span>{value}</span>;
}
