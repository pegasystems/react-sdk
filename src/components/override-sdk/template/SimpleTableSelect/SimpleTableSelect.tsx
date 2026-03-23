/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from 'styled-components';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';

import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

// ---------------------------------------------------------------------------
// Northwestern Mutual "Luna" design tokens
// ---------------------------------------------------------------------------
const NM = {
  navy: '#1f2d46',
  border: '#c8ced8',
  borderHover: '#1f2d46',
  focusBlue: '#2d4dc5',
  errorRed: '#c93939',
  labelColor: '#5c697f',
  textColor: '#1f2d46',
  surface: '#ffffff',
  headerBg: '#f4f6f9',
  rowHover: '#f7f9fc',
  disabledOpacity: '0.5',
  fontFamily: "'Graphik', 'Helvetica Neue', Helvetica, sans-serif",
  fontSize: '0.9375rem',
  labelFontSize: '0.875rem',
  headerFontSize: '0.8125rem',
  transitionSpeed: '0.15s'
};

// --- Styled primitives -------------------------------------------------------

const TableWrapper = styled.div`
  width: 100%;
  font-family: ${NM.fontFamily};
  color: ${NM.textColor};
`;

const SectionTitle = styled.h3`
  font-family: ${NM.fontFamily};
  font-size: 1.0625rem;
  font-weight: 600;
  color: ${NM.navy};
  margin: 0 0 0.75rem 0;
  padding: 0;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${NM.surface};
  border: 1px solid ${NM.border};
  border-radius: 4px;
  overflow: hidden;
  font-size: ${NM.fontSize};
`;

const THead = styled.thead`
  background-color: ${NM.headerBg};
`;

const TH = styled.th<{ $align?: string }>`
  padding: 0.625rem 0.875rem;
  font-size: ${NM.headerFontSize};
  font-weight: 600;
  color: ${NM.labelColor};
  text-align: ${({ $align }) => $align ?? 'left'};
  letter-spacing: 0.03em;
  text-transform: uppercase;
  border-bottom: 1px solid ${NM.border};
  white-space: nowrap;
`;

const TBody = styled.tbody``;

const TR = styled.tr<{ $selected?: boolean }>`
  background-color: ${({ $selected }) => ($selected ? '#eef1f7' : NM.surface)};
  border-bottom: 1px solid ${NM.border};
  transition: background-color ${NM.transitionSpeed} ease;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: ${({ $selected }) => ($selected ? '#e2e8f4' : NM.rowHover)};
  }
`;

const TD = styled.td<{ $align?: string }>`
  padding: 0.625rem 0.875rem;
  font-size: ${NM.fontSize};
  color: ${NM.textColor};
  text-align: ${({ $align }) => $align ?? 'left'};
  vertical-align: middle;
`;

// Visually hidden native checkbox (accessible)
const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  margin: 0;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;
`;

const CheckboxCell = styled.label<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  position: relative;
`;

const CheckMark = styled.span<{ $checked?: boolean; $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 2px;
  border: 2px solid ${({ $checked }) => ($checked ? NM.navy : NM.border)};
  background-color: ${({ $checked }) => ($checked ? NM.navy : '#fff')};
  flex-shrink: 0;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
  opacity: ${({ $disabled }) => ($disabled ? NM.disabledOpacity : '1')};

  &::after {
    content: '';
    display: block;
    opacity: ${({ $checked }) => ($checked ? '1' : '0')};
    width: 0.55rem;
    height: 0.32rem;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #fff;
    transform: translateY(-15%) rotate(-45deg);
    transition: opacity 0.1s ease;
  }

  ${CheckboxCell}:focus-within & {
    box-shadow: 0 0 0 3px ${NM.focusBlue}33;
  }
`;

interface SimpleTableSelectProps extends PConnProps {
  // If any, enter additional props that only exist on this component
  label: string;
  referenceList: object[] | string;
  renderMode: string;
  showLabel: boolean;
  promptedFilters: object[];
  viewName: string;
  parameters: any;
  readonlyContextList: object[] | string;
  dataRelationshipContext: string;
}

const isSelfReferencedProperty = (param, referenceProp) => {
  const [, parentPropName] = param.split('.');
  return parentPropName === referenceProp;
};

/**
 * SimpleTableSelect react component — NWM Luna styled
 * @param {*} props - props
 */
export default function SimpleTableSelect(props: SimpleTableSelectProps) {
  // Get emitted components from map (so we can get any override that may exist)
  const ListView = getComponentFromMap('ListView');
  const SimpleTable = getComponentFromMap('SimpleTable');
  const PromotedFilters = getComponentFromMap('PromotedFilters');

  const { label, getPConnect, renderMode = '', showLabel = true, viewName = '', parameters, dataRelationshipContext = null } = props;

  const propsToUse = { label, showLabel, ...getPConnect().getInheritedProps() };
  if (propsToUse.showLabel === false) {
    propsToUse.label = '';
  }

  const pConn = getPConnect();
  const { MULTI } = PCore.getConstants().LIST_SELECTION_MODE;
  const { selectionMode, selectionList } = pConn.getConfigProps() as any;
  const isMultiSelectMode = selectionMode === MULTI;

  if (isMultiSelectMode && renderMode === 'ReadOnly') {
    return (
      <TableWrapper>
        {propsToUse.label && <SectionTitle>{propsToUse.label}</SectionTitle>}
        <SimpleTable {...props} showLabel={false} />
      </TableWrapper>
    );
  }

  const pageReference = pConn.getPageReference();
  let referenceProp = isMultiSelectMode ? selectionList.substring(1) : pageReference.substring(pageReference.lastIndexOf('.') + 1);
  // Replace here to use the context name instead
  let contextPageReference: string | null = null;
  if (props.dataRelationshipContext !== null && selectionMode === 'single') {
    referenceProp = dataRelationshipContext;
    contextPageReference = pageReference.concat('.').concat(referenceProp);
  }

  // Need to get this written so typedefs work
  const { datasource: { parameters: fieldParameters = {} } = {}, pageClass } = isMultiSelectMode
    ? pConn.getFieldMetadata(`@P .${referenceProp}`)
    : pConn.getCurrentPageFieldMetadata(contextPageReference);

  const compositeKeys: any[] = [];
  Object.values(fieldParameters).forEach((param: any) => {
    if (isSelfReferencedProperty(param, referenceProp)) {
      compositeKeys.push(param.substring(param.lastIndexOf('.') + 1));
    }
  });

  // setting default row height for select table
  const defaultRowHeight = '2';

  const additionalTableConfig = {
    rowDensity: false,
    enableFreezeColumns: false,
    autoSizeColumns: false,
    resetColumnWidths: false,
    defaultFieldDef: {
      showMenu: false,
      noContextMenu: true,
      grouping: false
    },
    itemKey: '$key',
    defaultRowHeight
  };

  const listViewProps = {
    ...props,
    title: propsToUse.label,
    personalization: false,
    grouping: false,
    expandGroups: false,
    reorderFields: false,
    showHeaderIcons: false,
    editing: false,
    globalSearch: false,
    toggleFieldVisibility: false,
    basicMode: true,
    additionalTableConfig,
    compositeKeys,
    viewName,
    parameters
  };

  const filters = (getPConnect().getRawMetadata() as any).config.promotedFilters ?? [];
  const isSearchable = filters.length > 0 && false; // search disabled

  return (
    <TableWrapper>
      {propsToUse.label && <SectionTitle>{propsToUse.label}</SectionTitle>}
      <StyledTable>
        <THead>
          <tr>
            {/* Column headers are rendered by the inner ListView/PromotedFilters — */}
            {/* this shell provides the NWM visual chrome around the SDK component  */}
          </tr>
        </THead>
      </StyledTable>
      {isSearchable ? (
        <PromotedFilters
          getPConnect={getPConnect}
          viewName={viewName}
          filters={filters}
          listViewProps={listViewProps}
          pageClass={pageClass}
          parameters={parameters}
        />
      ) : (
        <ListView {...listViewProps} />
      )}
    </TableWrapper>
  );
}
