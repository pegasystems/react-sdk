import { useRef } from 'react';
import styled from 'styled-components';

import { buildMetaForListView, getContext } from '@pega/react-sdk-components/lib/components/helpers/simpleTableHelpers';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';

import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

// ---------------------------------------------------------------------------
// Northwestern Mutual "Luna" design tokens
// ---------------------------------------------------------------------------
const NM = {
  navy: '#1f2d46',
  border: '#c8ced8',
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

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${NM.surface};
  border: 1px solid ${NM.border};
  border-radius: 4px;
  overflow: hidden;
  font-size: ${NM.fontSize};
`;

export const THead = styled.thead`
  background-color: ${NM.headerBg};
`;

export const TH = styled.th<{ $align?: string }>`
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

export const TBody = styled.tbody``;

export const TR = styled.tr<{ $selected?: boolean }>`
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

export const TD = styled.td<{ $align?: string }>`
  padding: 0.625rem 0.875rem;
  font-size: ${NM.fontSize};
  color: ${NM.textColor};
  text-align: ${({ $align }) => $align ?? 'left'};
  vertical-align: middle;
`;

// Visually hidden native checkbox (accessible)
export const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  margin: 0;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;
`;

export const CheckboxCell = styled.label<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  position: relative;
`;

export const CheckMark = styled.span<{ $checked?: boolean; $disabled?: boolean }>`
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

// Can't use SimpleTableProps until getComponentConfig() and getFieldMetadata() are NOT private
interface SimpleTableProps extends PConnProps {
  // If any, enter additional props that only exist on this component
  multiRecordDisplayAs: string;
  allowTableEdit: boolean;
  contextClass: any;
  label: string;
  propertyLabel?: string;
  displayMode?: string;
  fieldMetadata?: any;
  hideLabel?: boolean;
  parameters?: any;
  isDataObject?: boolean;
  type?: string;
  ruleClass?: string;
  authorContext?: string;
  name?: string;
}

export default function SimpleTable(props: SimpleTableProps) {
  // Get emitted components from map (so we can get any override that may exist)
  const ListView = getComponentFromMap('ListView');
  const FieldGroupTemplate = getComponentFromMap('FieldGroupTemplate');
  const SimpleTableManual = getComponentFromMap('SimpleTableManual');

  const {
    getPConnect,
    multiRecordDisplayAs,
    allowTableEdit,
    label: labelProp,
    propertyLabel,
    displayMode,
    fieldMetadata,
    hideLabel,
    parameters,
    isDataObject,
    type,
    ruleClass,
    authorContext,
    name
  } = props;

  let { contextClass } = props;
  if (!contextClass) {
    let listName = getPConnect().getComponentConfig().referenceList;
    listName = PCore.getAnnotationUtils().getPropertyName(listName);
    // was... contextClass = getPConnect().getFieldMetadata(listName)?.pageClass;
    const theFieldMetadata = getPConnect().getFieldMetadata(listName);
    if (theFieldMetadata) {
      contextClass = theFieldMetadata.pageClass;
    } else {
      contextClass = undefined;
    }
  }
  if (multiRecordDisplayAs === 'fieldGroup') {
    const fieldGroupProps = { ...props, contextClass };
    const fieldGroupLabel = labelProp || propertyLabel;
    return (
      <TableWrapper>
        {fieldGroupLabel && <SectionTitle>{fieldGroupLabel}</SectionTitle>}
        <FieldGroupTemplate {...fieldGroupProps} />
      </TableWrapper>
    );
  }

  const label = labelProp || propertyLabel;
  const propsToUse = { label, ...getPConnect().getInheritedProps() };
  const isDisplayModeEnabled = displayMode === 'DISPLAY_ONLY';

  if (fieldMetadata && fieldMetadata.type === 'Page List' && fieldMetadata.dataRetrievalType === 'refer') {
    const {
      children: [{ children: rawFields }],
      parameters: rawParams
    } = (getPConnect().getRawMetadata() as any).config;
    if (isDisplayModeEnabled && hideLabel) {
      propsToUse.label = '';
    }

    const metaForListView = buildMetaForListView(
      fieldMetadata,
      rawFields,
      type,
      ruleClass,
      name,
      propsToUse.label,
      isDataObject,
      parameters // resolved params
    );

    const metaForPConnect = JSON.parse(JSON.stringify(metaForListView));
    // @ts-expect-error - PCore.getMetadataUtils().getPropertyMetadata - An argument for 'currentClassID' was not provided.
    metaForPConnect.config.parameters = rawParams ?? PCore.getMetadataUtils().getPropertyMetadata(name)?.datasource?.parameters;

    const { referenceListStr: referenceList } = getContext(getPConnect());
    let requiredContextForQueryInDisplayMode = {};
    if (isDisplayModeEnabled) {
      requiredContextForQueryInDisplayMode = {
        referenceList
      };
    }
    const options = {
      context: getPConnect().getContextName(),
      pageReference: getPConnect().getPageReference(),
      ...requiredContextForQueryInDisplayMode
    };

    const refToPConnect = useRef(PCore.createPConnect({ meta: metaForPConnect, options }).getPConnect).current; // getPConnect should be created only once.
    /* BUG-637178 : need to send context */
    const listViewProps = {
      ...metaForListView.config,
      getPConnect: refToPConnect,
      displayMode,
      fieldName: authorContext,
      bInForm: true
    };
    return (
      <TableWrapper>
        {!isDisplayModeEnabled && propsToUse.label && <SectionTitle>{propsToUse.label}</SectionTitle>}
        <ListView {...listViewProps} />
      </TableWrapper>
    );
  }
  const simpleTableManualProps: any = { ...props, contextClass };
  if (allowTableEdit === false) {
    simpleTableManualProps.hideAddRow = true;
    simpleTableManualProps.hideDeleteRow = true;
    simpleTableManualProps.disableDragDrop = true;
  }
  return (
    <TableWrapper>
      {propsToUse.label && <SectionTitle>{propsToUse.label}</SectionTitle>}
      <SimpleTableManual {...simpleTableManualProps} />
    </TableWrapper>
  );
}
