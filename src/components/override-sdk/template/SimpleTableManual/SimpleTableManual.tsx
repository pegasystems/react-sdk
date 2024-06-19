import React, { PropsWithChildren } from 'react';
import { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

interface SimpleTableManualProps extends PConnProps {
  referenceList?: [any];
  label?: string;
  showLabel?: boolean;
  propertyLabel?: string;
}

export default function SimpleTableManual(props: PropsWithChildren<SimpleTableManualProps>) {
  const {
    getPConnect,
    referenceList = [], // if referenceList not in configProps$, default to empy list
    children,
    label: labelProp,
    propertyLabel,
    showLabel
  } = props;

  const label = labelProp || propertyLabel;
  const propsToUse = { label, showLabel, ...getPConnect().getInheritedProps() };
  if (propsToUse.showLabel === false) {
    propsToUse.label = '';
  }

  const headingList = children[0].children.map(child => child.config.label);

  const renderTh = list => {
    return (
      <tr className='govuk-table__row'>
        {list.map((item, index) => {
          return (
            <th
              scope='col'
              className={`govuk-table__header ${
                index ? 'govuk-!-width-one-quarter' : 'govuk-!-width-one-half'
              }`}
            >
              {item}
            </th>
          );
        })}
      </tr>
    );
  };

  return (
    <table className='govuk-table'>
      {propsToUse?.label && (
        <caption className='govuk-table__caption govuk-table__caption--m'>
          {propsToUse.label}
        </caption>
      )}
      <thead className='govuk-table__head'>{renderTh(headingList)}</thead>
      <tbody className='govuk-table__body'>
        {referenceList?.map(item => {
          return (
            <tr className='govuk-table__row'>
              <th scope='row' className='govuk-table__header'>
                {item.FullName}
              </th>
              <td className='govuk-table__cell'>{item.Age}</td>
              <td className='govuk-table__cell'>{item.ClaimEndDate}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
