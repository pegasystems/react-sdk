import { useEffect, useState } from 'react';

import { localize } from '../../context/CockpitContext';

interface InsightProps {
  getPConnect: () => typeof PConnect;
  id: string;
  label?: string;
  dataViewParameters?: Record<string, unknown>;
}

interface InsightModel {
  title: string;
  dataView: string;
  isNonQueryable: boolean;
  headerField?: string;
  fields: string[];
  parameters?: Record<string, unknown>;
}

function parseInsight(insight: any): InsightModel | null {
  if (!insight) return null;
  const content = typeof insight.pyContent === 'string' ? JSON.parse(insight.pyContent) : (insight.pyContent ?? insight);
  const dataView = content?.defaultListDataView;
  if (!dataView) return null;
  const headerField = content.settings?.galleryConfig?.header?.field;
  const fields: string[] = (content.query?.columns ?? []).map((column: any) => column.id).filter((id: string) => id && id !== headerField);
  return {
    title: content.details?.title || insight.pyName || '',
    dataView,
    isNonQueryable: !!content.isNonQueryableDP,
    headerField,
    fields,
    parameters: content.query?.parameters
  };
}

async function loadInsight(id: string): Promise<InsightModel | null> {
  // The page response already caches insight rules; fall back to the insight API otherwise.
  const cached = (PCore.getMetadataUtils() as any).getInsight?.(id);
  if (cached) return parseInsight(cached);
  const response: any = await PCore.getAnalyticsUtils().getInsightByID(id);
  return parseInsight(response?.data?.pyInsights?.[0]);
}

async function loadRows(model: InsightModel, context: string, parameters?: Record<string, unknown>): Promise<any[]> {
  const params = { ...(model.parameters ?? {}), ...(parameters ?? {}) } as Record<string, any>;
  if (model.isNonQueryable) {
    const response: any = await PCore.getDataPageUtils().getDataAsync(model.dataView, context, params);
    return response?.data ?? [];
  }
  const select = [model.headerField, ...model.fields].filter(Boolean).map(field => ({ field }));
  const response: any = await PCore.getDataApiUtils().getData(
    model.dataView,
    { dataViewParameters: params, query: { select }, paging: { pageNumber: 1, pageSize: 50 } } as any,
    context
  );
  return response?.data?.data ?? [];
}

export default function Insight(props: InsightProps) {
  const { getPConnect, id, label, dataViewParameters } = props;
  const [model, setModel] = useState<InsightModel | null>(null);
  const [rows, setRows] = useState<any[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const context = getPConnect().getContextName();
    loadInsight(id)
      .then(async insightModel => {
        if (!insightModel) throw new Error('Insight definition not found');
        if (active) setModel(insightModel);
        const data = await loadRows(insightModel, context, dataViewParameters);
        if (active) setRows(data);
      })
      .catch(err => {
        console.error(`Unable to load insight ${id}`, err);
        if (active) setError(localize('Unable to load content'));
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (error) return <p className='ck-empty'>{error}</p>;
  if (!rows || !model) return <p className='ck-empty'>{localize('Loading…')}</p>;
  if (rows.length === 0) return <p className='ck-empty'>{localize('No items to show')}</p>;

  return (
    <ul className='ck-news-list' aria-label={localize(model.title || label)}>
      {rows.map((row, index) => (
        <li key={row.pyGUID ?? row.pzInsKey ?? index} className='ck-news'>
          {row.Category && <span className='ck-news-meta'>{row.Category}</span>}
          {model.headerField && <h3 className='ck-news-headline'>{row[model.headerField]}</h3>}
          {model.fields.map(field => (
            <p key={field} className='ck-news-body'>
              {row[field]}
            </p>
          ))}
        </li>
      ))}
    </ul>
  );
}
