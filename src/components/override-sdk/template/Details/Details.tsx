import React from 'react';

import DetailsFields from '@pega/react-sdk-components/lib/components/designSystemExtension/DetailsFields';


export default function Details(props) {
  const { children, label, context } = props;
  const arFields: Array<any> = [];

  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const localeCategory = 'Assignment';
  // TODO: may be needed after page heading logic is re-worked (value may need changing to point to correct reference)
  // const localeReference = `${getPConnect().getCaseInfo().getClassName()}!CASE!${getPConnect().getCaseInfo().getName()}`.toUpperCase();


  for (const child of children) {
    const theChildPConn = child.props.getPConnect();
    theChildPConn.setInheritedProp('displayMode', 'LABELS_LEFT');
    theChildPConn.setInheritedProp('readOnly', true);
    const theChildrenOfChild = theChildPConn.getChildren();
    arFields.push(theChildrenOfChild);
  }

  return (<>
    <main className="govuk-main-wrapper govuk-main-wrapper--l" id="main-content" role="main">
      <div className="govuk-grid-row">
        <div className='govuk-grid-column-two-thirds'>
          {label && context && <h1 className='govuk-heading-l'>{localizedVal(label, localeCategory /* ,localeReference */)} details</h1>}
          <DetailsFields fields={arFields[0]}/>
        </div>
      </div>
    </main>
  </>)
}


Details.defaultProps = {
  // children: []
};

Details.propTypes = {
  // children: PropTypes.arrayOf(PropTypes.node)
};
