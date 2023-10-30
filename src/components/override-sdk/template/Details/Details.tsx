import React from 'react';
import DetailsFields from '@pega/react-sdk-components/lib/components/designSystemExtension/DetailsFields';
import MainWrapper from '../../../BaseComponents/MainWrapper';
import ConditionalWrapper from '../../../helpers/formatters/ConditionalWrapper';


export default function Details(props) {
  const { children, label, context, readOnly } = props;
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

  const contextName = PCore.getContainerUtils().getActiveContainerItemName(`${PCore.getConstants().APP.APP}/primary`);  
  const containerName = PCore.getContainerUtils().getActiveContainerItemName(`${contextName}/workarea`) || contextName;
  
  return (
    // Conditionally wrap in main wrapper only if we are not in a case with and open status (i.e. we are in a finished case, viewing the claim summary)
    <ConditionalWrapper    
      condition={!PCore.getStore().getState().data[containerName].caseInfo?.status.startsWith('Open') && !readOnly}
      wrapper = {childrenForWrap => <MainWrapper>{childrenForWrap}</MainWrapper>}
      childrenToWrap={
        <>        
          {label && context && <h1 className='govuk-heading-l'>{localizedVal(label, localeCategory /* ,localeReference */)} details</h1>}
          <DetailsFields fields={arFields[0]}/>
        </>
    }/>
  )
}


Details.defaultProps = {
  // children: []
};

Details.propTypes = {
  // children: PropTypes.arrayOf(PropTypes.node)
};
