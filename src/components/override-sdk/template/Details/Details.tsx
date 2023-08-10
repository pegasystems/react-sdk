import React from 'react';

import DetailsFields from '@pega/react-sdk-components/lib/components/designSystemExtension/DetailsFields';


export default function Details(props) {
  const { children, label, context } = props;
  const arFields: Array<any> = [];

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
          {label && context && <h1 className='govuk-heading-l'>{label}</h1>}
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
